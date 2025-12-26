'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

export default function Address({ params }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/api/addresses/${params.address}`);
                setData(res.data);
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        };
        fetchData();
    }, [params.address]);

    if (loading) return <div>Loading...</div>;
    if (!data) return <div>Address not found</div>;

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Address Details</h1>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr' }}>
                        <div className="text-secondary">Address:</div>
                        <div style={{ wordBreak: 'break-all' }}>{data.address}</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr' }}>
                        <div className="text-secondary">Balance:</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{data.balance} LEMON</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr' }}>
                        <div className="text-secondary">Total Transactions:</div>
                        <div>{data.transactionCount}</div>
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
                                <th>From</th>
                                <th>To</th>
                                <th>Amount</th>
                                <th>Age</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.transactions && data.transactions.map(tx => (
                                <tr key={tx.hash}>
                                    <td>
                                        <Link href={`/transactions/${tx.hash}`} className="text-primary hover:underline">
                                            {tx.hash.substring(0, 16)}...
                                        </Link>
                                    </td>
                                    <td>
                                        {tx.fromAddress ? (
                                            tx.fromAddress === params.address ? (
                                                <span className="text-secondary">Self</span>
                                            ) : (
                                                <Link href={`/address/${tx.fromAddress}`} className="text-primary hover:underline">
                                                    {tx.fromAddress.substring(0, 12)}...
                                                </Link>
                                            )
                                        ) : (
                                            <span className="badge badge-warning">Reward</span>
                                        )}
                                    </td>
                                    <td>
                                        {tx.toAddress === params.address ? (
                                            <span className="text-secondary">Self</span>
                                        ) : (
                                            <Link href={`/address/${tx.toAddress}`} className="text-primary hover:underline">
                                                {tx.toAddress.substring(0, 12)}...
                                            </Link>
                                        )}
                                    </td>
                                    <td>
                                        <span style={{
                                            color: tx.toAddress === params.address ? '#2ea043' : '#da3633',
                                            fontWeight: 'bold'
                                        }}>
                                            {tx.toAddress === params.address ? '+' : '-'}{tx.amount}
                                        </span>
                                    </td>
                                    <td>{formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}</td>
                                    <td>
                                        <span className={`badge ${tx.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {(!data.transactions || data.transactions.length === 0) && (
                                <tr>
                                    <td colSpan="6" className="text-center">No transactions found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
