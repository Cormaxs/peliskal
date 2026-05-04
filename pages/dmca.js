import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function DMCA() {
    return (
        <div className="legal-page">
            <Head><title>DMCA - Peliskal</title></Head>
            <Header />
            <main className="content-wrapper">
                <h1>DMCA / Derechos de Autor</h1>
                {/* Aquí se reemplazaron las " por &quot; */}
                <p>Peliskal cumple con la ley 17 U.S.C. § 512 y la Digital Millennium Copyright Act (&quot;DMCA&quot;).</p>
                <p>Es nuestra política responder a cualquier notificación de infracción y tomar las acciones apropiadas. Si su material con derechos de autor ha sido indexado en nuestro sitio y desea que sea removido, debe proporcionarnos una comunicación escrita que detalle la información pertinente.</p>
                <p>Por favor, envíe su solicitud de retiro a nuestro correo de contacto oficial.</p>
            </main>
            <Footer />
            <style jsx>{`
                .legal-page { background: #040714; color: white; min-height: 100vh; }
                .content-wrapper { max-width: 800px; margin: 0 auto; padding: 120px 20px 60px; }
                h1 { color: #0071e3; }
                p { color: #86868b; margin-bottom: 20px; line-height: 1.8; }
            `}</style>
        </div>
    );
}