'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchTransactions();
    }, [page]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:3001/api/transactions?page=${page}&limit=20`);
            setTransactions(res.data.transactions);
            setTotal(res.data.total);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Transactions</h1>

            <div className="card">
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
                            {transactions.map(tx => (
                                <tr key={tx.hash}>
                                    <td>
                                        <Link href={`/transactions/${tx.hash}`} className="text-primary hover:underline">
                                            {tx.hash.substring(0, 16)}...
                                        </Link>
                                    </td>
                                    <td>
                                        {tx.fromAddress ? (
                                            <Link href={`/address/${tx.fromAddress}`} className="text-primary hover:underline">
                                                {tx.fromAddress.substring(0, 12)}...
                                            </Link>
                                        ) : (
                                            <span className="badge badge-warning">System (Reward)</span>
                                        )}
                                    </td>
                                    <td>
                                        <Link href={`/address/${tx.toAddress}`} className="text-primary hover:underline">
                                            {tx.toAddress.substring(0, 12)}...
                                        </Link>
                                    </td>
                                    <td>{tx.amount}</td>
                                    <td>{formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}</td>
                                    <td>
                                        <span className={`badge ${tx.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <button
                        className="btn btn-primary"
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                        Previous
                    </button>
                    <span style={{ display: 'flex', alignItems: 'center' }}>Page {page}</span>
                    <button
                        className="btn btn-primary"
                        disabled={page * 20 >= total}
                        onClick={() => setPage(p => p + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
