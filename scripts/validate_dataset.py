"""
Dataset Quality Validation Tool

Comprehensive quality checks for fine-tuning datasets:
- Format validation (JSON/JSONL structure)
- Content quality (length, diversity, balance)
- Token analysis (distribution, cost estimation)
- Duplicate detection
- Bias detection
- Readability metrics

Usage:
    python scripts/validate_dataset.py training.jsonl
    python scripts/validate_dataset.py training.jsonl --verbose
    python scripts/validate_dataset.py training.jsonl --fix --output cleaned.jsonl
"""

import json
import argparse
import sys
from pathlib import Path
from typing import Dict, List, Set, Tuple
from collections import Counter, defaultdict
from dataclasses import dataclass, field
import hashlib
import re


@dataclass
class QualityMetrics:
    """Dataset quality metrics"""
    total_examples: int = 0
    valid_examples: int = 0
    duplicates: int = 0

    # Token statistics
    token_counts: List[int] = field(default_factory=list)
    min_tokens: int = 0
    max_tokens: int = 0
    avg_tokens: float = 0.0
    total_tokens: int = 0

    # Content statistics
    unique_prompts: int = 0
    unique_responses: int = 0
    avg_prompt_length: float = 0.0
    avg_response_length: float = 0.0

    # Quality issues
    format_errors: List[str] = field(default_factory=list)
    content_warnings: List[str] = field(default_factory=list)

    # Category balance
    category_distribution: Dict[str, int] = field(default_factory=dict)
    role_distribution: Dict[str, int] = field(default_factory=dict)


class DatasetValidator:
    """Comprehensive dataset validation"""

    def __init__(self, verbose: bool = False):
        self.verbose = verbose
        self.metrics = QualityMetrics()

    def log(self, message: str, level: str = "info"):
        """Conditional logging"""
        if not self.verbose:
            return

        emoji_map = {
            "info": "ℹ️",
            "success": "✅",
            "warning": "⚠️",
            "error": "❌"
        }
        print(f"{emoji_map.get(level, 'ℹ️')} {message}")

    # ========================================
    # Core Validation Functions
    # ========================================

    def validate_format(self, file_path: str) -> Tuple[List[Dict], List[str]]:
        """
        Validate JSON/JSONL format

        Returns:
            (valid_examples, errors)
        """
        self.log(f"Validating format: {file_path}", "info")

        valid_examples = []
        errors = []

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                for i, line in enumerate(f, 1):
                    line = line.strip()
                    if not line:
                        continue

                    try:
                        data = json.loads(line)

                        # Check required structure
                        if 'messages' not in data:
                            errors.append(f"Line {i}: Missing 'messages' field")
                            continue

                        messages = data['messages']
                        if not isinstance(messages, list):
                            errors.append(f"Line {i}: 'messages' must be a list")
                            continue

                        if len(messages) == 0:
                            errors.append(f"Line {i}: 'messages' is empty")
                            continue

                        # Validate each message
                        valid_message = True
                        for j, msg in enumerate(messages):
                            if not isinstance(msg, dict):
                                errors.append(f"Line {i}, Message {j}: Must be an object")
                                valid_message = False
                                break

                            if 'role' not in msg:
                                errors.append(f"Line {i}, Message {j}: Missing 'role'")
                                valid_message = False
                                break

                            if 'content' not in msg:
                                errors.append(f"Line {i}, Message {j}: Missing 'content'")
                                valid_message = False
                                break

                            if msg['role'] not in ['system', 'user', 'assistant']:
                                errors.append(f"Line {i}, Message {j}: Invalid role '{msg['role']}'")
                                valid_message = False
                                break

                        if valid_message:
                            valid_examples.append(data)

                    except json.JSONDecodeError as e:
                        errors.append(f"Line {i}: Invalid JSON - {e}")

        except FileNotFoundError:
            errors.append(f"File not found: {file_path}")
            return [], errors

        self.metrics.total_examples = len(valid_examples) + len(errors)
        self.metrics.valid_examples = len(valid_examples)
        self.metrics.format_errors = errors

        return valid_examples, errors

    def analyze_tokens(self, examples: List[Dict]):
        """Analyze token distribution"""
        self.log("Analyzing token distribution...", "info")

        token_counts = []
        for example in examples:
            # Rough token estimation: 1 token ≈ 4 characters
            text = json.dumps(example, ensure_ascii=False)
            tokens = len(text) // 4
            token_counts.append(tokens)

        if token_counts:
            self.metrics.token_counts = token_counts
            self.metrics.min_tokens = min(token_counts)
            self.metrics.max_tokens = max(token_counts)
            self.metrics.avg_tokens = sum(token_counts) / len(token_counts)
            self.metrics.total_tokens = sum(token_counts)

            # Warnings for extreme values
            if self.metrics.max_tokens > 4000:
                self.metrics.content_warnings.append(
                    f"⚠️ Some examples exceed 4000 tokens (max: {self.metrics.max_tokens})"
                )

            if self.metrics.min_tokens < 10:
                self.metrics.content_warnings.append(
                    f"⚠️ Some examples are very short (min: {self.metrics.min_tokens} tokens)"
                )

    def detect_duplicates(self, examples: List[Dict]) -> Set[str]:
        """Detect duplicate examples"""
        self.log("Detecting duplicates...", "info")

        seen = set()
        duplicates = set()

        for example in examples:
            # Create hash from messages content
            content = json.dumps(example['messages'], sort_keys=True)
            content_hash = hashlib.md5(content.encode()).hexdigest()

            if content_hash in seen:
                duplicates.add(content_hash)
            seen.add(content_hash)

        self.metrics.duplicates = len(duplicates)

        if self.metrics.duplicates > 0:
            self.metrics.content_warnings.append(
                f"⚠️ Found {self.metrics.duplicates} duplicate examples"
            )

        return duplicates

    def analyze_diversity(self, examples: List[Dict]):
        """Analyze content diversity"""
        self.log("Analyzing content diversity...", "info")

        prompts = []
        responses = []

        for example in examples:
            messages = example['messages']

            # Extract user prompts and assistant responses
            for msg in messages:
                if msg['role'] == 'user':
                    prompts.append(msg['content'])
                elif msg['role'] == 'assistant':
                    responses.append(msg['content'])

        # Unique prompts/responses
        self.metrics.unique_prompts = len(set(prompts))
        self.metrics.unique_responses = len(set(responses))

        # Average lengths
        if prompts:
            self.metrics.avg_prompt_length = sum(len(p) for p in prompts) / len(prompts)
        if responses:
            self.metrics.avg_response_length = sum(len(r) for r in responses) / len(responses)

        # Diversity ratio
        prompt_diversity = self.metrics.unique_prompts / len(prompts) if prompts else 0
        response_diversity = self.metrics.unique_responses / len(responses) if responses else 0

        if prompt_diversity < 0.5:
            self.metrics.content_warnings.append(
                f"⚠️ Low prompt diversity: {prompt_diversity:.1%} unique prompts"
            )

        if response_diversity < 0.5:
            self.metrics.content_warnings.append(
                f"⚠️ Low response diversity: {response_diversity:.1%} unique responses"
            )

    def analyze_balance(self, examples: List[Dict]):
        """Analyze category and role balance"""
        self.log("Analyzing balance...", "info")

        # Role distribution
        role_counts = Counter()
        for example in examples:
            for msg in example['messages']:
                role_counts[msg['role']] += 1

        self.metrics.role_distribution = dict(role_counts)

        # Check for imbalance (if classification task)
        # This is a heuristic - adjust based on your use case
        if 'assistant' in role_counts:
            # Check if responses are too similar (potential class imbalance)
            responses = [
                msg['content']
                for example in examples
                for msg in example['messages']
                if msg['role'] == 'assistant'
            ]

            if responses:
                # Count unique response patterns
                response_counter = Counter(responses)
                most_common = response_counter.most_common(1)[0]
                most_common_ratio = most_common[1] / len(responses)

                if most_common_ratio > 0.7:
                    self.metrics.content_warnings.append(
                        f"⚠️ Potential class imbalance: {most_common_ratio:.1%} responses are identical"
                    )

    def detect_bias(self, examples: List[Dict]):
        """Detect potential bias patterns"""
        self.log("Detecting bias patterns...", "info")

        # Check for repeated phrases (potential bias)
        all_text = []
        for example in examples:
            for msg in example['messages']:
                all_text.append(msg['content'])

        combined_text = ' '.join(all_text)

        # Common bias indicators (extend as needed)
        bias_patterns = [
            (r'\b(always|never|everyone|no one)\b', 'absolute statements'),
            (r'\b(should|must|ought to)\b', 'prescriptive language'),
            (r'\b(obviously|clearly|of course)\b', 'assumptive language')
        ]

        for pattern, description in bias_patterns:
            matches = re.findall(pattern, combined_text, re.IGNORECASE)
            if len(matches) > len(examples) * 0.5:  # More than 50% of examples
                self.metrics.content_warnings.append(
                    f"⚠️ High frequency of {description}: {len(matches)} occurrences"
                )

    # ========================================
    # Reporting
    # ========================================

    def print_report(self):
        """Print comprehensive quality report"""
        print("\n" + "=" * 60)
        print("📊 DATASET QUALITY REPORT")
        print("=" * 60)

        # Overall statistics
        print(f"\n📝 Overall Statistics:")
        print(f"  Total Examples: {self.metrics.total_examples}")
        print(f"  Valid Examples: {self.metrics.valid_examples}")
        print(f"  Duplicates: {self.metrics.duplicates}")

        if self.metrics.valid_examples > 0:
            validity_rate = self.metrics.valid_examples / self.metrics.total_examples
            print(f"  Validity Rate: {validity_rate:.1%}")

        # Token statistics
        if self.metrics.token_counts:
            print(f"\n🔢 Token Statistics:")
            print(f"  Min Tokens: {self.metrics.min_tokens}")
            print(f"  Max Tokens: {self.metrics.max_tokens}")
            print(f"  Avg Tokens: {self.metrics.avg_tokens:.0f}")
            print(f"  Total Tokens: {self.metrics.total_tokens}")

            # Cost estimate
            training_cost_per_million = 3.00  # gpt-4o-mini rate
            epochs = 3  # default
            total_training_tokens = self.metrics.total_tokens * epochs
            estimated_cost = (total_training_tokens / 1_000_000) * training_cost_per_million

            print(f"\n💰 Cost Estimate (gpt-4o-mini, {epochs} epochs):")
            print(f"  Training Tokens: {total_training_tokens:,}")
            print(f"  Estimated Cost: ${estimated_cost:.2f}")

        # Content statistics
        print(f"\n📊 Content Statistics:")
        print(f"  Unique Prompts: {self.metrics.unique_prompts}")
        print(f"  Unique Responses: {self.metrics.unique_responses}")
        print(f"  Avg Prompt Length: {self.metrics.avg_prompt_length:.0f} chars")
        print(f"  Avg Response Length: {self.metrics.avg_response_length:.0f} chars")

        # Role distribution
        if self.metrics.role_distribution:
            print(f"\n👥 Role Distribution:")
            for role, count in self.metrics.role_distribution.items():
                print(f"  {role}: {count}")

        # Errors
        if self.metrics.format_errors:
            print(f"\n❌ Format Errors ({len(self.metrics.format_errors)}):")
            for error in self.metrics.format_errors[:10]:
                print(f"  - {error}")
            if len(self.metrics.format_errors) > 10:
                print(f"  ... and {len(self.metrics.format_errors) - 10} more")

        # Warnings
        if self.metrics.content_warnings:
            print(f"\n⚠️ Content Warnings:")
            for warning in self.metrics.content_warnings:
                print(f"  - {warning}")

        # Overall assessment
        print(f"\n🎯 Overall Assessment:")

        if len(self.metrics.format_errors) == 0 and len(self.metrics.content_warnings) == 0:
            print("  ✅ Excellent quality! Ready for fine-tuning.")
        elif len(self.metrics.format_errors) == 0 and len(self.metrics.content_warnings) < 3:
            print("  ✅ Good quality with minor warnings. Proceed with caution.")
        elif len(self.metrics.format_errors) > 0:
            print("  ❌ Format errors detected. Fix before training.")
        else:
            print("  ⚠️ Multiple quality issues. Review and improve dataset.")

        print("\n" + "=" * 60)

    def generate_recommendations(self) -> List[str]:
        """Generate improvement recommendations"""
        recommendations = []

        if self.metrics.duplicates > 0:
            recommendations.append("🔧 Remove duplicate examples to improve training efficiency")

        if self.metrics.valid_examples < 50:
            recommendations.append("🔧 Collect more data (target: 50-100+ examples)")

        if self.metrics.max_tokens > 4000:
            recommendations.append("🔧 Split or shorten long examples (target: < 4000 tokens)")

        if self.metrics.unique_prompts < self.metrics.valid_examples * 0.5:
            recommendations.append("🔧 Increase prompt diversity for better generalization")

        if self.metrics.unique_responses < self.metrics.valid_examples * 0.5:
            recommendations.append("🔧 Increase response diversity to avoid memorization")

        return recommendations

    # ========================================
    # Data Cleaning
    # ========================================

    def clean_dataset(self, examples: List[Dict]) -> List[Dict]:
        """Clean dataset by removing duplicates and invalid examples"""
        self.log("Cleaning dataset...", "info")

        cleaned = []
        seen_hashes = set()

        for example in examples:
            # Skip if duplicate
            content = json.dumps(example['messages'], sort_keys=True)
            content_hash = hashlib.md5(content.encode()).hexdigest()

            if content_hash in seen_hashes:
                continue

            # Skip if too long (>4000 tokens)
            text = json.dumps(example, ensure_ascii=False)
            tokens = len(text) // 4

            if tokens > 4000:
                continue

            # Skip if too short (<10 tokens)
            if tokens < 10:
                continue

            cleaned.append(example)
            seen_hashes.add(content_hash)

        self.log(f"Cleaned: {len(examples)} → {len(cleaned)} examples", "success")
        return cleaned

    def save_cleaned(self, examples: List[Dict], output_path: str):
        """Save cleaned dataset"""
        with open(output_path, 'w', encoding='utf-8') as f:
            for example in examples:
                f.write(json.dumps(example, ensure_ascii=False) + '\n')

        self.log(f"Saved cleaned dataset to: {output_path}", "success")

    # ========================================
    # Main Validation Pipeline
    # ========================================

    def validate(self, file_path: str) -> bool:
        """
        Run complete validation pipeline

        Returns:
            True if dataset is ready for training
        """
        # 1. Format validation
        valid_examples, errors = self.validate_format(file_path)

        if not valid_examples:
            self.print_report()
            return False

        # 2. Token analysis
        self.analyze_tokens(valid_examples)

        # 3. Duplicate detection
        self.detect_duplicates(valid_examples)

        # 4. Diversity analysis
        self.analyze_diversity(valid_examples)

        # 5. Balance analysis
        self.analyze_balance(valid_examples)

        # 6. Bias detection
        self.detect_bias(valid_examples)

        # 7. Print report
        self.print_report()

        # 8. Recommendations
        recommendations = self.generate_recommendations()
        if recommendations:
            print("\n💡 Recommendations:")
            for rec in recommendations:
                print(f"  {rec}")

        # Decision criteria
        ready = (
            len(self.metrics.format_errors) == 0 and
            self.metrics.valid_examples >= 10 and
            len(self.metrics.content_warnings) < 5
        )

        return ready


def main():
    """CLI entry point"""
    parser = argparse.ArgumentParser(description="Dataset Quality Validation")
    parser.add_argument("file", help="Dataset file (JSONL)")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    parser.add_argument("--fix", action="store_true", help="Clean dataset (remove duplicates, etc.)")
    parser.add_argument("--output", "-o", help="Output file for cleaned dataset")

    args = parser.parse_args()

    # Validate
    validator = DatasetValidator(verbose=args.verbose)
    ready = validator.validate(args.file)

    # Clean if requested
    if args.fix:
        valid_examples, _ = validator.validate_format(args.file)
        cleaned = validator.clean_dataset(valid_examples)

        output_path = args.output or args.file.replace('.jsonl', '_cleaned.jsonl')
        validator.save_cleaned(cleaned, output_path)

        print(f"\n✅ Cleaned dataset saved to: {output_path}")
        print(f"   Original: {len(valid_examples)} examples")
        print(f"   Cleaned: {len(cleaned)} examples")
        print(f"   Removed: {len(valid_examples) - len(cleaned)} examples")

    # Exit code
    sys.exit(0 if ready else 1)


if __name__ == "__main__":
    main()
