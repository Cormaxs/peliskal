import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Privacy() {
    return (
        <div className="legal-page">
            <Head><title>Política de Privacidad - Peliskal</title></Head>
            <Header />
            <main className="content-wrapper">
                <h1>Política de Privacidad</h1>
                <p className="last-update">Última actualización: Mayo 2026</p>
                
                <section>
                    <h2>1. Información que recopilamos</h2>
                    <p>En Peliskal, la privacidad de nuestros visitantes es de extrema importancia. Recopilamos información estándar de registro web para analizar tendencias y administrar el sitio.</p>
                </section>

                <section>
                    <h2>2. Cookies y Web Beacons</h2>
                    <p>Utilizamos cookies para almacenar información sobre las preferencias de los visitantes y personalizar el contenido de la página web según el tipo de navegador.</p>
                </section>

                <section>
                    <h2>3. Publicidad de Terceros (Google AdSense)</h2>
                    <p>Google, como proveedor asociado, utiliza cookies para publicar anuncios en este sitio. Los usuarios pueden inhabilitar el uso de la cookie de DART a través del anuncio de Google y de la política de privacidad de la red de contenido.</p>
                </section>
            </main>
            <Footer />
            <style jsx>{`
                .legal-page { background: #040714; color: white; min-height: 100vh; }
                .content-wrapper { max-width: 800px; margin: 0 auto; padding: 120px 20px 60px; line-height: 1.6; }
                h1 { font-size: 2.5rem; margin-bottom: 10px; color: #0071e3; }
                h2 { font-size: 1.5rem; margin-top: 30px; color: #f5f5f7; }
                p { color: #86868b; margin-bottom: 15px; }
                .last-update { font-style: italic; font-size: 0.9rem; }
            `}</style>
        </div>
    );
}