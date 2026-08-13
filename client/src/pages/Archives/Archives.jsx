import React, { useState } from 'react';
import { BookOpen, Scroll, Image as ImageIcon, Box, Lock, Search, Landmark, Palette, Layers } from 'lucide-react';
import '../pages.css';

const ARCHIVE_ITEMS = [
    {
        id: 1,
        title: 'Kangyur & Tengyur Sacred Manuscripts',
        category: 'Ancient Manuscripts',
        monastery: 'Rumtek Monastery',
        period: '17th Century',
        emoji: <Scroll size={40} style={{ color: 'var(--color-primary)' }} />,
        desc: 'Hand-written gold and silver ink Buddhist canonical texts preserved in silk wrappers.',
    },
    {
        id: 2,
        title: 'Sangay Lhadhat Wooden Palace Model',
        category: 'Architectural Artifacts',
        monastery: 'Pemayangtse Monastery',
        period: '18th Century',
        emoji: <Landmark size={40} style={{ color: 'var(--color-primary)' }} />,
        desc: 'Seven-tiered carved wooden structure depicting Zangdok Palri (Guru Rinpoche\'s heavenly palace).',
    },
    {
        id: 3,
        title: 'Ancient Wall Murals & Frescoes',
        category: 'Murals & Thangkas',
        monastery: 'Phodong Monastery',
        period: '18th Century',
        emoji: <Palette size={40} style={{ color: 'var(--color-primary)' }} />,
        desc: 'High-resolution digitized wall paintings depicting Wheel of Life and deity mandalas.',
    },
    {
        id: 4,
        title: 'Wooden Xylograph Printing Blocks',
        category: 'Ancient Manuscripts',
        monastery: 'Tashiding Monastery',
        period: '17th - 19th Century',
        emoji: <Layers size={40} style={{ color: 'var(--color-primary)' }} />,
        desc: 'Carved wooden blocks used for printing Tibetan prayer flags and holy mantras.',
    },
];

export default function Archives() {
    const [selectedCat, setSelectedCat] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['All', 'Ancient Manuscripts', 'Murals & Thangkas', 'Architectural Artifacts'];

    const filtered = ARCHIVE_ITEMS.filter((item) => {
        const matchCat = selectedCat === 'All' || item.category === selectedCat;
        const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.monastery.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <div className="container" style={{ padding: '3rem 1.5rem' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <span className="home-hero-eyebrow" style={{ marginBottom: '1rem' }}>
                    <Scroll size={14} /> Sikkim Heritage Vault
                </span>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', color: 'var(--text-primary)' }}>
                    Digital Cultural <span className="gradient-text">Archives</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.75rem auto 0', fontSize: '1rem', lineHeight: '1.6' }}>
                    Digitally preserving rare manuscripts, ancient Thangka paintings, and sacred relics of Sikkimese monastic history.
                </p>
            </div>

            {/* Controls */}
            <div style={{ maxWidth: '600px', margin: '0 auto 2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-full)',
                    padding: '6px 16px',
                }}>
                    <Search size={16} style={{ color: 'var(--color-primary)', marginRight: '8px' }} />
                    <input
                        type="text"
                        placeholder="Search manuscripts, murals..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            border: 'none',
                            background: 'transparent',
                            outline: 'none',
                            color: 'var(--text-primary)',
                            fontSize: '0.875rem',
                            width: '100%',
                        }}
                    />
                </div>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                {categories.map((c) => (
                    <button
                        key={c}
                        onClick={() => setSelectedCat(c)}
                        style={{
                            padding: '6px 16px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.8125rem',
                            border: selectedCat === c ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                            background: selectedCat === c ? 'var(--color-primary)' : 'var(--bg-card)',
                            color: selectedCat === c ? 'var(--text-inverse)' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)',
                        }}
                    >
                        {c}
                    </button>
                ))}
            </div>

            {/* Archives Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {filtered.map((item) => (
                    <div key={item.id} className="card card--hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{
                            height: '130px',
                            background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.18) 0%, var(--bg-elevated) 100%)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1rem',
                        }}>
                            {item.emoji}
                        </div>

                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>{item.category}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.period}</span>
                            </div>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                                {item.title}
                            </h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Landmark size={13} style={{ color: 'var(--color-primary)' }} /> {item.monastery}
                            </p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                                {item.desc}
                            </p>
                        </div>

                        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Lock size={12} /> High-Res Archive
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>Part 5 Repository</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
