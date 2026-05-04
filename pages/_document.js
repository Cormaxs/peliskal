// pages/_document.js

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="es"> {/* Sugiero cambiar 'en' a 'es' si tu contenido está en español */}
      <Head>
        {/*
          =====================================
          MEJORAS DE SEO GLOBALES Y RENDIMIENTO
          =====================================
        */}

        {/* 1. Viewport Meta Tag (CRUCIAL para Mobile SEO y Experiencia de Usuario) */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* 2. Preconexión (Mejora el rendimiento de carga de recursos externos como Google Fonts) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        
        {/* 3. Enlace a Fuentes (Ejemplo: Inter, una fuente moderna y legible) */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" 
          rel="stylesheet" 
        />
        
        {/* 4. Favicon y Iconos (Mejora la imagen de marca en pestañas y dispositivos) */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link 
          rel="apple-touch-icon" 
          href="/apple-touch-icon.png" 
          sizes="180x180" 
        />
        
        {/* NOTA: Las etiquetas Title, Description y Canonical, que cambian por página, 
           DEBEN ir en el componente <Head> de cada página o en _app.js.
        */}

      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
