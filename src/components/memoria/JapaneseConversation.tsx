'use client';

import { useState } from 'react';

interface DialogueLine {
    speaker: 'male' | 'female';
    text: string;
}

interface JapaneseConversationProps {
    conversation: DialogueLine[];
}

export default function JapaneseConversation({ conversation }: JapaneseConversationProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!conversation || conversation.length === 0) return null;

    const displayLines = isExpanded ? conversation : conversation.slice(0, 4);

    return (
        <div className="bg-white rounded-2xl p-6 border border-stone-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Japanese Conversation
                </h3>
                <span className="text-xs text-stone-400">
                    {conversation.length} lines
                </span>
            </div>

            <div className="space-y-3">
                {displayLines.map((line, i) => {
                    const isMale = line.speaker === 'male';
                    return (
                        <div
                            key={i}
                            className={`flex gap-3 ${isMale ? '' : 'flex-row-reverse'}`}
                        >
                            <img
                                src={isMale ? '/icons/takumi.png' : '/icons/anya.png'}
                                alt=""
                                className="w-8 h-8 rounded-full flex-shrink-0"
                            />
                            <div
                                className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                                    isMale
                                        ? 'bg-blue-50 text-blue-900'
                                        : 'bg-pink-50 text-pink-900'
                                }`}
                            >
                                <p className="text-sm leading-relaxed">{line.text}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {conversation.length > 4 && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-4 w-full py-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
                >
                    {isExpanded ? 'Show less' : `Show all ${conversation.length} lines`}
                </button>
            )}
        </div>
    );
}
