import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Contacto() {
    return (
        <div className="legal-page">
            <Head><title>Contacto - Peliskal</title></Head>
            <Header />
            <main className="content-wrapper">
                <div className="contact-card">
                    <h1>Contacto</h1>
                    <p>¿Tienes dudas o sugerencias? Escríbenos.</p>
                    <form className="contact-form">
                        <input type="text" placeholder="Nombre" required />
                        <input type="email" placeholder="Correo electrónico" required />
                        <textarea placeholder="Tu mensaje..." rows="5" required></textarea>
                        <button type="submit">Enviar Mensaje</button>
                    </form>
                </div>
            </main>
            <Footer />
            <style jsx>{`
                .legal-page { background: #040714; color: white; min-height: 100vh; }
                .content-wrapper { max-width: 600px; margin: 0 auto; padding: 150px 20px 60px; }
                .contact-card { background: rgba(255,255,255,0.03); padding: 40px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); }
                h1 { margin-bottom: 10px; }
                p { color: #86868b; margin-bottom: 30px; }
                .contact-form { display: flex; flex-direction: column; gap: 15px; }
                input, textarea { 
                    background: #1c1c1e; border: 1px solid #333; color: white; 
                    padding: 12px; border-radius: 10px; outline: none;
                }
                input:focus, textarea:focus { border-color: #0071e3; }
                button { 
                    background: #0071e3; color: white; border: none; padding: 15px; 
                    border-radius: 10px; font-weight: bold; cursor: pointer; transition: 0.3s;
                }
                button:hover { background: #0077ed; transform: translateY(-2px); }
            `}</style>
        </div>
    );
}