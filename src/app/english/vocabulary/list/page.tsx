'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Vocabulary {
    id: string;
    phrase: string;
    type: string;
    meaning: string;
    note: string | null;
    mastery_level: number;
    created_at: string;
}

export default function VocabularyListPage() {
    const [items, setItems] = useState<Vocabulary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'phrase' | 'mastery'>('date');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await fetch('/api/user-phrases');
            const data = await res.json();
            if (data.success) setItems(data.phrases || []);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSort = (field: 'date' | 'phrase' | 'mastery') => {
        if (sortBy === field) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortDir(field === 'date' ? 'desc' : 'asc');
        }
    };

    // Filter
    const filtered = items.filter(item => {
        if (!search) return true;
        const q = search.toLowerCase();
        return item.phrase.toLowerCase().includes(q) ||
               item.meaning.toLowerCase().includes(q) ||
               item.type.toLowerCase().includes(q);
    });

    // Sort
    const sorted = [...filtered].sort((a, b) => {
        let cmp = 0;
        if (sortBy === 'date') {
            cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        } else if (sortBy === 'phrase') {
            cmp = a.phrase.localeCompare(b.phrase);
        } else if (sortBy === 'mastery') {
            cmp = a.mastery_level - b.mastery_level;
        }
        return sortDir === 'asc' ? cmp : -cmp;
    });

    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                Loading...
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fafafa', color: '#1a1a1a' }}>
            {/* Header */}
            <div style={{
                padding: '12px 20px',
                borderBottom: '1px solid #e5e5e5',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#fff',
                position: 'sticky',
                top: 0,
                zIndex: 10,
            }}>
                <Link href="/english/vocabulary" style={{ color: '#666', textDecoration: 'none', fontSize: '13px' }}>
                    ← Calendar
                </Link>
                <span style={{ fontWeight: '600', fontSize: '14px' }}>All Vocabulary ({items.length})</span>
                <div style={{ width: '60px' }} />
            </div>

            {/* Search */}
            <div style={{ padding: '12px 20px', backgroundColor: '#fff', borderBottom: '1px solid #e5e5e5' }}>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #e5e5e5',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                    }}
                />
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '13px',
                    backgroundColor: '#fff',
                }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e5e5e5' }}>
                            <th
                                onClick={() => handleSort('phrase')}
                                style={{
                                    padding: '12px 16px',
                                    textAlign: 'left',
                                    fontWeight: '600',
                                    color: '#666',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    backgroundColor: '#fafafa',
                                }}
                            >
                                Phrase {sortBy === 'phrase' && (sortDir === 'asc' ? '↑' : '↓')}
                            </th>
                            <th style={{
                                padding: '12px 16px',
                                textAlign: 'left',
                                fontWeight: '600',
                                color: '#666',
                                backgroundColor: '#fafafa',
                            }}>
                                Type
                            </th>
                            <th style={{
                                padding: '12px 16px',
                                textAlign: 'left',
                                fontWeight: '600',
                                color: '#666',
                                backgroundColor: '#fafafa',
                            }}>
                                Meaning
                            </th>
                            <th
                                onClick={() => handleSort('mastery')}
                                style={{
                                    padding: '12px 16px',
                                    textAlign: 'center',
                                    fontWeight: '600',
                                    color: '#666',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    backgroundColor: '#fafafa',
                                    width: '80px',
                                }}
                            >
                                Lv {sortBy === 'mastery' && (sortDir === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                onClick={() => handleSort('date')}
                                style={{
                                    padding: '12px 16px',
                                    textAlign: 'right',
                                    fontWeight: '600',
                                    color: '#666',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    backgroundColor: '#fafafa',
                                    width: '90px',
                                }}
                            >
                                Date {sortBy === 'date' && (sortDir === 'asc' ? '↑' : '↓')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((item, i) => (
                            <tr
                                key={item.id}
                                style={{
                                    borderBottom: '1px solid #f0f0f0',
                                    backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa',
                                }}
                            >
                                <td style={{
                                    padding: '10px 16px',
                                    fontWeight: '500',
                                    color: '#333',
                                }}>
                                    {item.phrase}
                                </td>
                                <td style={{
                                    padding: '10px 16px',
                                    color: '#888',
                                    fontSize: '11px',
                                }}>
                                    {item.type}
                                </td>
                                <td style={{
                                    padding: '10px 16px',
                                    color: '#555',
                                    maxWidth: '300px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}>
                                    {item.meaning}
                                </td>
                                <td style={{
                                    padding: '10px 16px',
                                    textAlign: 'center',
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2px' }}>
                                        {[0, 1, 2, 3, 4].map(level => (
                                            <div
                                                key={level}
                                                style={{
                                                    width: '8px',
                                                    height: '8px',
                                                    borderRadius: '2px',
                                                    backgroundColor: item.mastery_level >= level ? '#10B981' : '#e5e5e5',
                                                }}
                                            />
                                        ))}
                                    </div>
                                </td>
                                <td style={{
                                    padding: '10px 16px',
                                    color: '#999',
                                    fontSize: '11px',
                                    textAlign: 'right',
                                    whiteSpace: 'nowrap',
                                }}>
                                    {item.created_at.split('T')[0].slice(5)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {sorted.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                    {search ? 'No matches found.' : 'No vocabulary yet.'}
                </div>
            )}

            {/* Stats footer */}
            <div style={{
                padding: '16px 20px',
                borderTop: '1px solid #e5e5e5',
                backgroundColor: '#fff',
                fontSize: '12px',
                color: '#888',
                display: 'flex',
                justifyContent: 'space-between',
            }}>
                <span>Showing {sorted.length} of {items.length}</span>
                <span>Mastered: {items.filter(i => i.mastery_level >= 4).length}</span>
            </div>
        </div>
    );
}
