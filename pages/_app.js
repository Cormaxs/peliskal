// pages/_app.js

import Script from 'next/script';
import Layout from '../components/Layout';
import { ContentProvider } from '../context/ContentContext';
// Si tienes estilos globales (como Tailwind, Bootstrap o un global.css), impórtalos aquí

// Tu ID de seguimiento de Google Analytics
const GA_TRACKING_ID = 'G-5GHP328QNM';

// Tu ID de Google AdSense
const ADSENSE_PUB_ID = 'ca-pub-5933305559914134';

export default function MyApp({ Component, pageProps }) {

  return (
    <>
    <ContentProvider>
      {/* ¡IMPORTANTE! Eliminamos la etiqueta <head> que causaba el error.
        Los scripts de terceros se inyectan correctamente usando <Script>.
        
        Si necesitas la meta tag de verificación de AdSense (meta name="google-adsense-account"), 
        deberías colocarla en un componente <Head> de 'next/head' dentro de tu Layout.
      */}

      {/* ====================================================
        1. SCRIPT DE GOOGLE ADSENSE (Cargador Principal) 🚀
        ====================================================
        Estrategia "afterInteractive" (o "lazyOnload"): Carga el script después de que la 
        página se vuelve interactiva, minimizando el impacto en el rendimiento inicial (LCP).
      */}
      <Script
        async 
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUB_ID}`}
        strategy="afterInteractive" 
        crossOrigin="anonymous"
      />
      
      {/* ====================================================
        2. SCRIPT PRINCIPAL DE ANALYTICS (Cargador de gtag.js)
        ====================================================
      */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />

      {/* ====================================================
        3. SCRIPT DE CONFIGURACIÓN DE ANALYTICS (Inicialización)
        ====================================================
      */}
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />

      {/* Tu estructura de aplicación original */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
      </ContentProvider>
    </>
  );
}