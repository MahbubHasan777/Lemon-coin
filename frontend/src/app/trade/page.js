'use client';
import { useState } from 'react';
import axios from 'axios';

export default function Trade() {
    const [formData, setFormData] = useState({
        fromAddress: '',
        privateKey: '',
        toAddress: '',
        amount: ''
    });
    const [wallet, setWallet] = useState(null);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const generateWallet = async () => {
        try {
            const res = await axios.post('http://localhost:3001/api/addresses/generate');
            setWallet(res.data);
            setFormData(prev => ({
                ...prev,
                fromAddress: res.data.address,
                privateKey: res.data.privateKey
            }));
        } catch (error) {
            console.error(error);
        }
    };

    const checkBalance = async (e) => {
        e.preventDefault();
        const address = e.target.balanceAddress.value;
        try {
            const res = await axios.get(`http://localhost:3001/api/addresses/${address}/balance`);
            alert(`Balance: ${res.data.balance} LEMON`);
        } catch (error) {
            alert('Error fetching balance');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const res = await axios.post('http://localhost:3001/api/transactions', formData);
            setStatus({ type: 'success', message: 'Transaction submitted successfully! Waiting for mining...' });

            // Auto-mine for demo purposes
            await axios.post('http://localhost:3001/api/mining/mine', {
                minerAddress: '04c35e9f85494c256372109867540217983694021' // Default miner
            });

            setStatus({ type: 'success', message: 'Transaction mined and confirmed!' });
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.error || error.message });
        }
        setLoading(false);
    };

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Trade & Wallet</h1>

            <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>

                {/* Generate Wallet */}
                <div className="card">
                    <h3 className="border-b" style={{ paddingBottom: '1rem', marginBottom: '1rem' }}>New Wallet</h3>
                    <p className="text-secondary" style={{ marginBottom: '1rem' }}>
                        Need a wallet? Generate a new key pair here. <br />
                        <span style={{ color: '#4ade80' }}>Bonus: New accounts get 1000 LEMON!</span>
                    </p>

                    <button onClick={generateWallet} className="btn btn-primary" style={{ marginBottom: '1rem' }}>
                        Generate Wallet
                    </button>

                    {wallet && (
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <div className="text-secondary" style={{ fontSize: '0.875rem' }}>Public Key (Address)</div>
                                <div style={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>{wallet.publicKey}</div>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <div className="text-secondary" style={{ fontSize: '0.875rem' }}>Private Key (SAVE THIS!)</div>
                                <div style={{ wordBreak: 'break-all', fontFamily: 'monospace', color: '#da3633' }}>{wallet.privateKey}</div>
                            </div>
                            <div>
                                <div className="text-secondary" style={{ fontSize: '0.875rem' }}>Initial Balance</div>
                                <div style={{ fontWeight: 'bold', color: '#4ade80' }}>{wallet.balance} LEMON</div>
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '2rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
                        <h4 style={{ marginBottom: '0.5rem' }}>Check Balance</h4>
                        <form onSubmit={checkBalance} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input name="balanceAddress" type="text" placeholder="Wallet Address" className="search-input" style={{ margin: 0 }} required />
                            <button type="submit" className="btn" style={{ background: '#333' }}>Check</button>
                        </form>
                    </div>
                </div>

                {/* Transaction Form */}
                <div className="card">
                    <h3 className="border-b" style={{ paddingBottom: '1rem', marginBottom: '1rem' }}>Create Transaction</h3>

                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <label className="text-secondary" style={{ display: 'block', marginBottom: '0.5rem' }}>From Address (Public Key)</label>
                            <input
                                type="text"
                                className="search-input"
                                value={formData.fromAddress}
                                onChange={e => setFormData({ ...formData, fromAddress: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-secondary" style={{ display: 'block', marginBottom: '0.5rem' }}>Private Key (to sign)</label>
                            <input
                                type="password"
                                className="search-input"
                                value={formData.privateKey}
                                onChange={e => setFormData({ ...formData, privateKey: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-secondary" style={{ display: 'block', marginBottom: '0.5rem' }}>To Address</label>
                            <input
                                type="text"
                                className="search-input"
                                value={formData.toAddress}
                                onChange={e => setFormData({ ...formData, toAddress: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-secondary" style={{ display: 'block', marginBottom: '0.5rem' }}>Amount</label>
                            <input
                                type="number"
                                className="search-input"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Processing...' : 'Send Coins'}
                        </button>

                        {status && (
                            <div className={`badge ${status.type === 'success' ? 'badge-success' : 'badge-warning'}`}
                                style={{ padding: '1rem', marginTop: '1rem' }}>
                                {status.message}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
