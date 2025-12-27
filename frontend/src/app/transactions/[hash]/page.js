'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

export default function TransactionDetail({ params }) {
    const [tx, setTx] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTx = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions/${params.hash}`);
                setTx(res.data);
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        };
        fetchTx();
    }, [params.hash]);

    if (loading) return <div>Loading...</div>;
    if (!tx) return <div>Transaction not found</div>;

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Transaction Details</h1>

            <div className="card">
                <div style={{ display: 'grid', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr' }}>
                        <div className="text-secondary">Transaction Hash:</div>
                        <div>{tx.hash}</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr' }}>
                        <div className="text-secondary">Status:</div>
                        <div>
                            <span className={`badge ${tx.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                                {tx.status}
                            </span>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr' }}>
                        <div className="text-secondary">Block:</div>
                        {tx.blockHash ? (
                            <Link href={`/blocks/${tx.blockHash}`} className="text-primary hover:underline">{tx.blockHash}</Link>
                        ) : (
                            <span className="text-secondary">Pending...</span>
                        )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr' }}>
                        <div className="text-secondary">From:</div>
                        {tx.fromAddress ? (
                            <Link href={`/address/${tx.fromAddress}`} className="text-primary hover:underline">{tx.fromAddress}</Link>
                        ) : (
                            <span>System (Mining Reward)</span>
                        )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr' }}>
                        <div className="text-secondary">To:</div>
                        <Link href={`/address/${tx.toAddress}`} className="text-primary hover:underline">{tx.toAddress}</Link>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr' }}>
                        <div className="text-secondary">Value:</div>
                        <div>{tx.amount} KROWN</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr' }}>
                        <div className="text-secondary">Timestamp:</div>
                        <div>{new Date(tx.timestamp).toLocaleString()} ({formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })})</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
