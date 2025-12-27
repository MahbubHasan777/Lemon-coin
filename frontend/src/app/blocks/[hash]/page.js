'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

export default function BlockDetail({ params }) {
    const [block, setBlock] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlock = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/blocks/${params.hash}`);
                setBlock(res.data);
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        };
        fetchBlock();
    }, [params.hash]);

    if (loading) return <div>Loading...</div>;
    if (!block) return <div>Block not found</div>;

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Block #{params.hash.substring(0, 8)}...</h1>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 className="border-b" style={{ paddingBottom: '1rem', marginBottom: '1rem' }}>Overview</h3>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr' }}>
                        <div className="text-secondary">Hash:</div>
                        <div>{block.hash}</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr' }}>
                        <div className="text-secondary">Timestamp:</div>
                        <div>{block.timestamp ? new Date(block.timestamp).toLocaleString() : 'N/A'} ({block.timestamp ? formatDistanceToNow(new Date(block.timestamp), { addSuffix: true }) : ''})</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr' }}>
                        <div className="text-secondary">Height/Nonce:</div>
                        <div>{block.nonce}</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr' }}>
                        <div className="text-secondary">Difficulty:</div>
                        <div>{block.difficulty}</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr' }}>
                        <div className="text-secondary">Miner:</div>
                        <Link href={`/address/${block.miner}`} className="text-primary hover:underline">{block.miner}</Link>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr' }}>
                        <div className="text-secondary">Previous Block:</div>
                        <Link href={`/blocks/${block.previousHash}`} className="text-primary hover:underline">{block.previousHash}</Link>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 className="border-b" style={{ paddingBottom: '1rem', marginBottom: '1rem' }}>Transactions</h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Hash</th>
                            </tr>
                        </thead>
                        <tbody>
                            {block.transactions && block.transactions.map(txHash => (
                                <tr key={txHash}>
                                    <td>
                                        <Link href={`/transactions/${txHash}`} className="text-primary hover:underline">
                                            {txHash}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {(!block.transactions || block.transactions.length === 0) && (
                                <tr>
                                    <td colSpan="1" className="text-center">No transactions in this block</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
