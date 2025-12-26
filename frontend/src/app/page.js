'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { Search, Filter, Box, FileText, ArrowRight, Layers, Activity } from 'lucide-react';

export default function Home() {
    const [stats, setStats] = useState(null);
    const [latestBlocks, setLatestBlocks] = useState([]);
    const [latestTransactions, setLatestTransactions] = useState([]);
    const [search, setSearch] = useState('');

    const API_URL = 'http://localhost:3001/api';

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, blocksRes, txRes] = await Promise.all([
                axios.get(`${API_URL}/stats`),
                axios.get(`${API_URL}/blocks?limit=5`),
                axios.get(`${API_URL}/transactions?limit=5`)
            ]);
            setStats(statsRes.data);
            setLatestBlocks(blocksRes.data.blocks);
            setLatestTransactions(txRes.data.transactions);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.length === 64) {
            window.location.href = `/blocks/${search}`;
        } else {
            window.location.href = `/address/${search}`;
        }
    };

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header & Search */}
            <div style={{ textAlign: 'center', marginBottom: '3rem', paddingTop: '2rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 'bold', color: '#4ade80' }}>Lemon Blockchain Explorer</h1>

                <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', display: 'flex' }}>
                    <div style={{
                        background: '#1a1b23',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px 0 0 8px',
                        border: '1px solid #333',
                        borderRight: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        color: '#fff'
                    }}>
                        <Filter size={18} /> Filters
                    </div>
                    <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex' }}>
                        <input
                            type="text"
                            placeholder="Search by address / Txn hash / Block / Token / Domain"
                            style={{
                                flex: 1,
                                background: '#111',
                                border: '1px solid #333',
                                color: '#fff',
                                padding: '1rem',
                                outline: 'none'
                            }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit" style={{
                            background: '#2563eb',
                            color: '#fff',
                            padding: '0 1.5rem',
                            borderRadius: '0 8px 8px 0',
                            border: 'none',
                            cursor: 'pointer'
                        }}>
                            <Search size={20} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Stats Dashboard */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Left Stats Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111218', border: '1px solid #333' }}>
                        <div>
                            <div className="text-secondary" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Transactions</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>{stats?.totalTransactions || 0}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div className="text-secondary" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>MED GAS PRICE</div>
                            <div style={{ fontSize: '0.9rem', color: '#fff' }}>0.00000 $LEMON</div>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111218', border: '1px solid #333' }}>
                        <div>
                            <div className="text-secondary" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>LAST FINALIZED BLOCK</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>{stats?.latestBlockHash ? '#' + stats.totalBlocks : '0'}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div className="text-secondary" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>LAST SAFE BLOCK</div>
                            <div style={{ fontSize: '0.9rem', color: '#fff' }}>{stats?.totalBlocks || 0}</div>
                        </div>
                    </div>
                </div>

                {/* Right Chart Column */}
                <div className="card" style={{ background: '#111218', border: '1px solid #333', padding: '1.5rem', position: 'relative', minHeight: '200px' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#fff', marginBottom: '1rem' }}>TRANSACTION HISTORY IN 14 DAYS</div>
                    {/* Mock Chart SVG */}
                    <div style={{ height: '120px', display: 'flex', alignItems: 'flex-end', gap: '5px', opacity: 0.8 }}>
                        <svg viewBox="0 0 500 150" style={{ width: '100%', height: '100%' }}>
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#4ade80" stopOpacity="0.6" />
                                    <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path d="M0,150 Q125,50 250,150 T500,150" fill="url(#gradient)" stroke="none" />
                            <path d="M0,150 Q125,50 250,150 T500,150" fill="none" stroke="#4ade80" strokeWidth="2" />
                        </svg>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
                        <span>Dec 25</span>
                        <span>Dec 21</span>
                        <span>Dec 17</span>
                    </div>
                </div>
            </div>

            {/* Two Column Layout: Latest Transactions & Latest Blocks */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem' }}>

                {/* Latest Transactions Panel */}
                <div className="card" style={{ background: '#111218', border: '1px solid #333', padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid #333' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff' }}>Latest Transactions</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {latestTransactions.map((tx, i) => (
                            <div key={tx.hash} style={{
                                padding: '1rem',
                                borderBottom: i !== latestTransactions.length - 1 ? '1px solid #222' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <div style={{
                                    width: '40px', height: '40px',
                                    background: '#1e2025',
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff',
                                    flexShrink: 0
                                }}>
                                    <FileText size={20} />
                                </div>
                                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ minWidth: 0 }}>
                                        <Link href={`/transactions/${tx.hash}`} style={{ color: '#4ade80', display: 'block', fontSize: '0.9rem', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {tx.hash.substring(0, 14)}...
                                        </Link>
                                        <div className="text-secondary" style={{ fontSize: '0.75rem' }}>
                                            {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.85rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <span className="text-secondary">From</span>
                                            <Link href={`/address/${tx.fromAddress}`} style={{ color: '#4ade80' }}>
                                                {tx.fromAddress ? tx.fromAddress.substring(0, 8) + '...' : 'System'}
                                            </Link>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <span className="text-secondary">To</span>
                                            <Link href={`/address/${tx.toAddress}`} style={{ color: '#4ade80' }}>
                                                {tx.toAddress.substring(0, 8)}...
                                            </Link>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', background: '#1e2025', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid #333', whiteSpace: 'nowrap' }}>
                                        {tx.amount} LEMON
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ padding: '1rem', borderTop: '1px solid #333', textAlign: 'center', background: '#16171d' }}>
                        <Link href="/transactions" className="text-secondary hover:text-primary" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            View All Transactions <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>

                {/* Latest Blocks Panel */}
                <div className="card" style={{ background: '#111218', border: '1px solid #333', padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid #333' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff' }}>Latest Blocks</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {latestBlocks.map((block, i) => (
                            <div key={block.hash} style={{
                                padding: '1rem',
                                borderBottom: i !== latestBlocks.length - 1 ? '1px solid #222' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <div style={{
                                    width: '40px', height: '40px',
                                    background: '#1e2025',
                                    borderRadius: '8px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff',
                                    flexShrink: 0
                                }}>
                                    <Box size={20} />
                                </div>
                                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ minWidth: 0 }}>
                                        <Link href={`/blocks/${block.hash}`} style={{ color: '#4ade80', display: 'block', fontSize: '0.9rem', marginBottom: '2px' }}>
                                            #{block.nonce}
                                        </Link>
                                        <div className="text-secondary" style={{ fontSize: '0.75rem' }}>
                                            {formatDistanceToNow(new Date(block.timestamp), { addSuffix: true })}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.85rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <span className="text-secondary">Miner</span>
                                            <Link href={`/address/${block.miner}`} style={{ color: '#4ade80' }}>
                                                {block.miner.substring(0, 10)}...
                                            </Link>
                                        </div>
                                        <div className="text-secondary" style={{ fontSize: '0.8rem' }}>
                                            {block.transactionCount} Txns
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid #333', whiteSpace: 'nowrap' }}>
                                        0.00 LEMON
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ padding: '1rem', borderTop: '1px solid #333', textAlign: 'center', background: '#16171d' }}>
                        <Link href="/blocks" className="text-secondary hover:text-primary" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            View All Blocks <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
