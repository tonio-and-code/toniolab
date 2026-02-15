"""
Fine-Tuning Workflow Automation Script

Complete automation for OpenAI fine-tuning lifecycle:
1. Data validation
2. File upload
3. Job creation
4. Progress monitoring
5. Evaluation
6. Deployment

Usage:
    python scripts/finetune_workflow.py --config config.yaml
    python scripts/finetune_workflow.py --mode validate --data training.jsonl
    python scripts/finetune_workflow.py --mode train --data training.jsonl --model gpt-4o-mini
    python scripts/finetune_workflow.py --mode evaluate --model-id ft:gpt-4o-mini:...
"""

import json
import time
import argparse
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
import yaml

try:
    from openai import OpenAI
except ImportError:
    print("❌ OpenAI SDK not installed. Run: pip install openai")
    sys.exit(1)


@dataclass
class ValidationResult:
    """Dataset validation results"""
    valid: bool
    total_examples: int
    token_stats: Dict[str, float]
    issues: List[str]
    warnings: List[str]


@dataclass
class TrainingConfig:
    """Training configuration"""
    model: str = "gpt-4o-mini-2024-07-18"
    n_epochs: int = 3
    batch_size: Optional[int] = None  # auto
    learning_rate_multiplier: float = 1.0
    suffix: str = "custom-model"


class FineTuneWorkflow:
    """Complete fine-tuning workflow automation"""

    def __init__(self, api_key: Optional[str] = None):
        self.client = OpenAI(api_key=api_key) if api_key else OpenAI()
        self.verbose = True

    def log(self, message: str, level: str = "info"):
        """Logging with emoji indicators"""
        if not self.verbose:
            return

        emoji_map = {
            "info": "ℹ️",
            "success": "✅",
            "warning": "⚠️",
            "error": "❌",
            "progress": "🔄"
        }
        print(f"{emoji_map.get(level, 'ℹ️')} {message}")

    # ========================================
    # Phase 1: Data Validation
    # ========================================

    def validate_dataset(self, file_path: str) -> ValidationResult:
        """
        Comprehensive dataset validation

        Checks:
        - Valid JSON/JSONL format
        - Required fields present
        - Token distribution
        - Duplicates
        - Format consistency
        """
        self.log(f"Validating dataset: {file_path}", "progress")

        issues = []
        warnings = []
        examples = []
        token_counts = []

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                for i, line in enumerate(f, 1):
                    try:
                        data = json.loads(line)
                        examples.append(data)

                        # Check required structure
                        if 'messages' not in data:
                            issues.append(f"Line {i}: Missing 'messages' field")
                            continue

                        messages = data['messages']
                        if not isinstance(messages, list):
                            issues.append(f"Line {i}: 'messages' must be a list")
                            continue

                        # Check message format
                        for j, msg in enumerate(messages):
                            if 'role' not in msg or 'content' not in msg:
                                issues.append(f"Line {i}, Message {j}: Missing 'role' or 'content'")

                        # Estimate tokens (rough: 1 token ≈ 4 chars)
                        text = json.dumps(data, ensure_ascii=False)
                        tokens = len(text) // 4
                        token_counts.append(tokens)

                        # Check token limits
                        if tokens > 4000:
                            warnings.append(f"Line {i}: {tokens} tokens (recommended < 4000)")

                    except json.JSONDecodeError as e:
                        issues.append(f"Line {i}: Invalid JSON - {e}")

        except FileNotFoundError:
            issues.append(f"File not found: {file_path}")
            return ValidationResult(False, 0, {}, issues, warnings)

        # Check for duplicates
        unique_examples = len(set(json.dumps(ex, sort_keys=True) for ex in examples))
        if unique_examples < len(examples):
            duplicates = len(examples) - unique_examples
            warnings.append(f"Found {duplicates} duplicate examples")

        # Token statistics
        token_stats = {}
        if token_counts:
            token_stats = {
                'min': min(token_counts),
                'max': max(token_counts),
                'mean': sum(token_counts) / len(token_counts),
                'total': sum(token_counts)
            }

        # Final validation
        valid = len(issues) == 0 and len(examples) >= 10

        if valid:
            self.log(f"Validation passed: {len(examples)} examples", "success")
        else:
            self.log(f"Validation failed: {len(issues)} issues", "error")

        return ValidationResult(
            valid=valid,
            total_examples=len(examples),
            token_stats=token_stats,
            issues=issues,
            warnings=warnings
        )

    def print_validation_report(self, result: ValidationResult):
        """Print detailed validation report"""
        print("\n" + "=" * 50)
        print("📊 VALIDATION REPORT")
        print("=" * 50)

        print(f"\n✅ Valid: {result.valid}")
        print(f"📝 Total Examples: {result.total_examples}")

        if result.token_stats:
            print(f"\n🔢 Token Statistics:")
            print(f"  - Min: {result.token_stats['min']:.0f}")
            print(f"  - Max: {result.token_stats['max']:.0f}")
            print(f"  - Mean: {result.token_stats['mean']:.0f}")
            print(f"  - Total: {result.token_stats['total']:.0f}")

        if result.issues:
            print(f"\n❌ Issues ({len(result.issues)}):")
            for issue in result.issues[:10]:  # Show first 10
                print(f"  - {issue}")
            if len(result.issues) > 10:
                print(f"  ... and {len(result.issues) - 10} more")

        if result.warnings:
            print(f"\n⚠️ Warnings ({len(result.warnings)}):")
            for warning in result.warnings[:10]:
                print(f"  - {warning}")
            if len(result.warnings) > 10:
                print(f"  ... and {len(result.warnings) - 10} more")

        print("\n" + "=" * 50)

    # ========================================
    # Phase 2: Training
    # ========================================

    def upload_file(self, file_path: str) -> str:
        """Upload training file to OpenAI"""
        self.log(f"Uploading file: {file_path}", "progress")

        with open(file_path, 'rb') as f:
            response = self.client.files.create(
                file=f,
                purpose='fine-tune'
            )

        file_id = response.id
        self.log(f"File uploaded: {file_id}", "success")
        return file_id

    def create_training_job(
        self,
        training_file_id: str,
        config: TrainingConfig,
        validation_file_id: Optional[str] = None
    ) -> str:
        """Create fine-tuning job"""
        self.log(f"Creating fine-tuning job with model: {config.model}", "progress")

        hyperparameters = {
            "n_epochs": config.n_epochs
        }

        if config.batch_size is not None:
            hyperparameters["batch_size"] = config.batch_size

        if config.learning_rate_multiplier != 1.0:
            hyperparameters["learning_rate_multiplier"] = config.learning_rate_multiplier

        job_params = {
            "training_file": training_file_id,
            "model": config.model,
            "hyperparameters": hyperparameters,
            "suffix": config.suffix
        }

        if validation_file_id:
            job_params["validation_file"] = validation_file_id

        job = self.client.fine_tuning.jobs.create(**job_params)

        job_id = job.id
        self.log(f"Job created: {job_id}", "success")
        return job_id

    def monitor_job(self, job_id: str, check_interval: int = 60) -> Tuple[bool, Optional[str]]:
        """
        Monitor training job until completion

        Returns:
            (success: bool, model_id: Optional[str])
        """
        self.log(f"Monitoring job: {job_id}", "progress")
        print(f"ℹ️ Checking status every {check_interval} seconds...")

        while True:
            job = self.client.fine_tuning.jobs.retrieve(job_id)
            status = job.status

            if status == "succeeded":
                model_id = job.fine_tuned_model
                self.log(f"Training succeeded! Model: {model_id}", "success")
                return True, model_id

            elif status == "failed":
                error = job.error if hasattr(job, 'error') else "Unknown error"
                self.log(f"Training failed: {error}", "error")
                return False, None

            elif status == "cancelled":
                self.log("Training was cancelled", "warning")
                return False, None

            else:
                # validating_files, queued, running
                self.log(f"Status: {status}", "progress")
                time.sleep(check_interval)

    def estimate_cost(self, token_count: int, model: str, epochs: int) -> Dict[str, float]:
        """Estimate training and inference costs"""
        # Pricing (2024 rates, subject to change)
        pricing = {
            "gpt-4o-mini-2024-07-18": {
                "training": 3.00,  # per 1M tokens
                "input": 0.150,
                "output": 0.600
            },
            "gpt-3.5-turbo": {
                "training": 8.00,
                "input": 3.00,
                "output": 6.00
            },
            "gpt-4o-2024-08-06": {
                "training": 25.00,
                "input": 2.50,
                "output": 10.00
            }
        }

        model_key = model if model in pricing else "gpt-4o-mini-2024-07-18"
        rates = pricing[model_key]

        training_tokens = token_count * epochs
        training_cost = (training_tokens / 1_000_000) * rates["training"]

        # Example inference cost (10K requests, 500 tokens avg)
        monthly_requests = 10_000
        avg_input_tokens = 200
        avg_output_tokens = 300

        monthly_input_cost = (monthly_requests * avg_input_tokens / 1_000_000) * rates["input"]
        monthly_output_cost = (monthly_requests * avg_output_tokens / 1_000_000) * rates["output"]
        monthly_total = monthly_input_cost + monthly_output_cost

        return {
            "training_cost": training_cost,
            "monthly_inference_cost": monthly_total,
            "total_first_month": training_cost + monthly_total
        }

    # ========================================
    # Phase 3: Evaluation
    # ========================================

    def evaluate_model(
        self,
        model_id: str,
        test_file: str,
        max_examples: int = 10
    ) -> Dict:
        """
        Evaluate fine-tuned model on test set

        Returns quality metrics and example outputs
        """
        self.log(f"Evaluating model: {model_id}", "progress")

        results = []
        with open(test_file, 'r', encoding='utf-8') as f:
            for i, line in enumerate(f):
                if i >= max_examples:
                    break

                data = json.loads(line)
                messages = data['messages'][:-1]  # Exclude expected answer
                expected = data['messages'][-1]['content']

                # Get model response
                response = self.client.chat.completions.create(
                    model=model_id,
                    messages=messages,
                    max_tokens=500
                )

                actual = response.choices[0].message.content

                results.append({
                    "input": messages[-1]['content'] if messages else "",
                    "expected": expected,
                    "actual": actual,
                    "match": expected.strip() == actual.strip()
                })

        # Calculate simple accuracy
        accuracy = sum(1 for r in results if r['match']) / len(results) if results else 0

        self.log(f"Evaluation complete: {accuracy:.1%} exact match rate", "success")

        return {
            "accuracy": accuracy,
            "total_examples": len(results),
            "results": results
        }

    def print_evaluation_report(self, eval_results: Dict):
        """Print evaluation report"""
        print("\n" + "=" * 50)
        print("📈 EVALUATION REPORT")
        print("=" * 50)

        print(f"\n🎯 Accuracy: {eval_results['accuracy']:.1%}")
        print(f"📝 Examples Evaluated: {eval_results['total_examples']}")

        print("\n📋 Sample Outputs:")
        for i, result in enumerate(eval_results['results'][:3], 1):
            print(f"\n--- Example {i} ---")
            print(f"Input: {result['input'][:100]}...")
            print(f"Expected: {result['expected'][:100]}...")
            print(f"Actual: {result['actual'][:100]}...")
            print(f"Match: {'✅' if result['match'] else '❌'}")

        print("\n" + "=" * 50)

    # ========================================
    # Complete Workflow
    # ========================================

    def run_complete_workflow(
        self,
        training_file: str,
        config: TrainingConfig,
        validation_file: Optional[str] = None,
        test_file: Optional[str] = None
    ) -> Optional[str]:
        """
        Run complete fine-tuning workflow

        Returns:
            model_id if successful, None otherwise
        """
        print("\n🚀 Starting Complete Fine-Tuning Workflow")
        print("=" * 50)

        # Phase 1: Validate
        print("\n📋 Phase 1: Data Validation")
        result = self.validate_dataset(training_file)
        self.print_validation_report(result)

        if not result.valid:
            self.log("Validation failed. Fix issues before training.", "error")
            return None

        # Cost estimate
        cost_estimate = self.estimate_cost(
            result.token_stats['total'],
            config.model,
            config.n_epochs
        )
        print(f"\n💰 Cost Estimate:")
        print(f"  - Training: ${cost_estimate['training_cost']:.2f}")
        print(f"  - Monthly Inference (10K requests): ${cost_estimate['monthly_inference_cost']:.2f}")
        print(f"  - First Month Total: ${cost_estimate['total_first_month']:.2f}")

        # User confirmation
        proceed = input("\n🤔 Proceed with training? (yes/no): ").strip().lower()
        if proceed != 'yes':
            self.log("Training cancelled by user", "warning")
            return None

        # Phase 2: Upload & Train
        print("\n📤 Phase 2: Upload & Training")
        training_file_id = self.upload_file(training_file)

        validation_file_id = None
        if validation_file:
            validation_file_id = self.upload_file(validation_file)

        job_id = self.create_training_job(training_file_id, config, validation_file_id)

        # Save job ID
        job_file = Path("finetune_job_id.txt")
        job_file.write_text(job_id)
        self.log(f"Job ID saved to: {job_file}", "info")

        # Monitor
        success, model_id = self.monitor_job(job_id, check_interval=60)

        if not success:
            self.log("Training failed", "error")
            return None

        # Save model ID
        model_file = Path("finetune_model_id.txt")
        model_file.write_text(model_id)
        self.log(f"Model ID saved to: {model_file}", "success")

        # Phase 3: Evaluate (if test file provided)
        if test_file:
            print("\n📊 Phase 3: Evaluation")
            eval_results = self.evaluate_model(model_id, test_file, max_examples=10)
            self.print_evaluation_report(eval_results)

        print("\n✅ Workflow Complete!")
        print(f"🎉 Your fine-tuned model is ready: {model_id}")
        print("\n📝 Next Steps:")
        print(f"  1. Test the model with: python scripts/test_finetune.py --model {model_id}")
        print(f"  2. Deploy to production")
        print(f"  3. Monitor performance and collect feedback")

        return model_id


def main():
    """CLI entry point"""
    parser = argparse.ArgumentParser(description="Fine-Tuning Workflow Automation")

    parser.add_argument(
        "--mode",
        choices=["validate", "train", "evaluate", "complete"],
        default="complete",
        help="Workflow mode"
    )

    parser.add_argument("--data", required=True, help="Training data file (JSONL)")
    parser.add_argument("--validation", help="Validation data file (JSONL)")
    parser.add_argument("--test", help="Test data file for evaluation (JSONL)")

    parser.add_argument("--model", default="gpt-4o-mini-2024-07-18", help="Base model")
    parser.add_argument("--epochs", type=int, default=3, help="Number of epochs")
    parser.add_argument("--batch-size", type=int, help="Batch size (default: auto)")
    parser.add_argument("--lr", type=float, default=1.0, help="Learning rate multiplier")
    parser.add_argument("--suffix", default="custom-model", help="Model suffix")

    parser.add_argument("--model-id", help="Fine-tuned model ID (for evaluate mode)")
    parser.add_argument("--api-key", help="OpenAI API key (or set OPENAI_API_KEY env)")

    args = parser.parse_args()

    # Initialize workflow
    workflow = FineTuneWorkflow(api_key=args.api_key)

    # Execute based on mode
    if args.mode == "validate":
        result = workflow.validate_dataset(args.data)
        workflow.print_validation_report(result)
        sys.exit(0 if result.valid else 1)

    elif args.mode == "train":
        config = TrainingConfig(
            model=args.model,
            n_epochs=args.epochs,
            batch_size=args.batch_size,
            learning_rate_multiplier=args.lr,
            suffix=args.suffix
        )

        result = workflow.validate_dataset(args.data)
        if not result.valid:
            workflow.print_validation_report(result)
            sys.exit(1)

        training_file_id = workflow.upload_file(args.data)
        validation_file_id = workflow.upload_file(args.validation) if args.validation else None

        job_id = workflow.create_training_job(training_file_id, config, validation_file_id)
        success, model_id = workflow.monitor_job(job_id)

        if success:
            print(f"\n✅ Model ready: {model_id}")
        sys.exit(0 if success else 1)

    elif args.mode == "evaluate":
        if not args.model_id:
            print("❌ --model-id required for evaluate mode")
            sys.exit(1)

        if not args.test:
            print("❌ --test required for evaluate mode")
            sys.exit(1)

        eval_results = workflow.evaluate_model(args.model_id, args.test)
        workflow.print_evaluation_report(eval_results)

    elif args.mode == "complete":
        config = TrainingConfig(
            model=args.model,
            n_epochs=args.epochs,
            batch_size=args.batch_size,
            learning_rate_multiplier=args.lr,
            suffix=args.suffix
        )

        model_id = workflow.run_complete_workflow(
            training_file=args.data,
            config=config,
            validation_file=args.validation,
            test_file=args.test
        )

        sys.exit(0 if model_id else 1)


if __name__ == "__main__":
    main()
