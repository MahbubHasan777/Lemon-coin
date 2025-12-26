import Link from 'next/link';
import './globals.css';

export const metadata = {
    title: 'Lemon Blockchain Explorer',
    description: 'Explorer for Lemon Blockchain Clone',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <nav className="border-b bg-card">
                    <div className="container" style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Link href="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '50%' }}></div>
                            Lemon Explorer
                        </Link>

                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <Link href="/" className="text-secondary hover:text-primary">Home</Link>
                            <Link href="/blocks" className="text-secondary hover:text-primary">Blocks</Link>
                            <Link href="/transactions" className="text-secondary hover:text-primary">Transactions</Link>
                            <Link href="/trade" className="text-primary hover:text-primary">Trade</Link>
                        </div>
                    </div>
                </nav>

                <main className="container" style={{ padding: '2rem 1rem' }}>
                    {children}
                </main>

                <footer className="border-t bg-card" style={{ marginTop: 'auto', padding: '3rem 0', backgroundColor: '#0b0b0b' }}>
                    <div className="container">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                    <div style={{ width: '24px', height: '24px', background: 'var(--primary)', borderRadius: '50%' }}></div>
                                    LEMON NETWORK
                                </div>
                                <p className="text-secondary" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    Lemon Network is the world's largest and most rewarding Layer 1 Blockchain & Crypto Ecosystem.
                                    With cutting-edge products like the Lemon Blockchain, Lemon Coin, and an unmatched rewards program,
                                    we empower users and investors globally.
                                </p>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <div>
                                    <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#fff' }}>Sitemap</h4>
                                    <ul className="text-secondary" style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <li><a href="#" className="hover:text-primary">Lemon paper</a></li>
                                        <li><a href="#" className="hover:text-primary">Verifications</a></li>
                                        <li><a href="#" className="hover:text-primary">Tokenomics</a></li>
                                        <li><a href="#" className="hover:text-primary">Press Kit</a></li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#fff' }}>&nbsp;</h4>
                                    <ul className="text-secondary" style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <li><a href="#" className="hover:text-primary">Wiki</a></li>
                                        <li><a href="#" className="hover:text-primary">Dev Releases</a></li>
                                        <li><a href="#" className="hover:text-primary">Blog</a></li>
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#fff' }}>Quick Links</h4>
                                <ul className="text-secondary" style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <li><a href="#" className="hover:text-primary">Terms of use</a></li>
                                    <li><a href="#" className="hover:text-primary">Cookies Policy</a></li>
                                    <li><a href="#" className="hover:text-primary">Disclaimer</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-gray-800" style={{ paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <p className="text-secondary" style={{ fontSize: '0.875rem' }}>© LEMON TECHNOLOGIES LTD. - 2025 - All Rights Reserved</p>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <a href="#" className="social-icon">Twitter</a>
                                <a href="#" className="social-icon">Telegram</a>
                                <a href="#" className="social-icon">Instagram</a>
                                <a href="#" className="social-icon">Github</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </body>
        </html>
    );
}
