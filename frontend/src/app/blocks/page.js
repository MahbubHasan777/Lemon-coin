'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

export default function Blocks() {
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchBlocks();
    }, [page]);

    const fetchBlocks = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/blocks?page=${page}&limit=20`);
            setBlocks(res.data.blocks);
            setTotal(res.data.total);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Blocks</h1>

            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Block</th>
                                <th>Hash</th>
                                <th>Age</th>
                                <th>Txns</th>
                                <th>Miner</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blocks.map(block => (
                                <tr key={block.hash}>
                                    <td>
                                        <Link href={`/blocks/${block.hash}`} className="text-primary hover:underline">
                                            #{block.hash.substring(0, 8)}...
                                        </Link>
                                    </td>
                                    <td>{block.hash.substring(0, 16)}...</td>
                                    <td>{formatDistanceToNow(new Date(block.timestamp), { addSuffix: true })}</td>
                                    <td>{block.transactionCount}</td>
                                    <td>
                                        <Link href={`/address/${block.miner}`} className="text-primary hover:underline">
                                            {block.miner.substring(0, 12)}...
                                        </Link>
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
