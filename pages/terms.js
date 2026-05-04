import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Terms() {
    return (
        <div className="legal-page">
            <Head><title>Términos de Servicio - Peliskal</title></Head>
            <Header />
            <main className="content-wrapper">
                <h1>Términos de Servicio</h1>
                <section>
                    <h2>Uso del Sitio</h2>
                    <p>Al acceder a Peliskal, usted acepta cumplir con estos términos. El contenido se proporciona "tal cual" para uso personal y no comercial.</p>
                    <h2>Responsabilidad</h2>
                    <p>Peliskal no se hace responsable del contenido de los enlaces externos o servidores de terceros. Nuestra plataforma funciona únicamente como un índice de contenido disponible en la web.</p>
                </section>
            </main>
            <Footer />
            <style jsx>{`
                .legal-page { background: #040714; color: white; min-height: 100vh; }
                .content-wrapper { max-width: 800px; margin: 0 auto; padding: 120px 20px 60px; }
                h1 { color: #0071e3; }
                p { color: #86868b; line-height: 1.6; }
            `}</style>
        </div>
    );
}