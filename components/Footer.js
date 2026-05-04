import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="main-footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <img src="/peliskal-logo.webp" alt="Peliskal" className="footer-logo" />
                    <p className="brand-tagline">Tu portal de streaming favorito.</p>
                </div>

                <div className="footer-grid">
                    <div className="footer-group">
                        <h4>Legal</h4>
                        <Link href="/privacy" className="footer-link">Política de Privacidad</Link>
                        <Link href="/terms" className="footer-link">Términos de Servicio</Link>
                        <Link href="/dmca" className="footer-link">DMCA / Copyright</Link>
                    </div>
                    
                    <div className="footer-group">
                        <h4>Soporte</h4>
                        <Link href="/contacto" className="footer-link">Contacto</Link>
                        <Link href="/explorar" className="footer-link">Explorar contenido</Link>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {currentYear} **Peliskal**. Todos los derechos reservados.</p>
                <p className="disclaimer">Esta plataforma no almacena archivos en sus servidores, solo facilita enlaces de libre distribución.</p>
            </div>

            <style jsx>{`
                .main-footer {
                    background-color: #040714;
                    color: #86868b;
                    padding: 60px 5% 30px;
                    margin-top: 80px;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    position: relative;
                    z-index: 10;
                }

                .footer-content {
                    max-width: 1300px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    gap: 40px;
                    flex-wrap: wrap;
                }

                .footer-brand {
                    flex: 1;
                    min-width: 250px;
                }

                .footer-logo {
                    height: 35px;
                    width: auto;
                    margin-bottom: 15px;
                    opacity: 0.8;
                }

                .brand-tagline {
                    font-size: 0.9rem;
                    line-height: 1.5;
                    max-width: 300px;
                }

                .footer-grid {
                    display: flex;
                    gap: 60px;
                }

                .footer-group {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .footer-group h4 {
                    color: #f5f5f7;
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 10px;
                }

                .footer-link {
                    color: #86868b;
                    text-decoration: none;
                    font-size: 0.9rem;
                    transition: color 0.3s ease;
                }

                .footer-link:hover {
                    color: #0071e3;
                }

                .footer-bottom {
                    max-width: 1300px;
                    margin: 40px auto 0;
                    padding-top: 30px;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    text-align: center;
                }

                .footer-bottom p {
                    font-size: 0.8rem;
                    margin: 5px 0;
                }

                .disclaimer {
                    color: #424245;
                    font-style: italic;
                    max-width: 600px;
                    margin: 10px auto !important;
                }

                @media (max-width: 768px) {
                    .footer-content {
                        flex-direction: column;
                        text-align: center;
                    }
                    .footer-brand {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .footer-grid {
                        justify-content: center;
                        gap: 30px;
                    }
                    .footer-group {
                        align-items: center;
                    }
                }
            `}</style>
        </footer>
    );
}