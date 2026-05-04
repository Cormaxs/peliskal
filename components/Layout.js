// components/Layout.js

import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
    return (
        <>
            <Header />
            <div className="content-wrapper">
                <main>{children}</main>
            </div>
          

            <style jsx>{`
                .content-wrapper {
                    /* Esto asegura que el footer siempre esté en la parte inferior si el contenido es corto */
                    min-height: calc(100vh - 70px - 140px); /* 100vh - altura header (70px) - altura footer (aprox 140px) */
                    flex-grow: 1; /* Permite que este wrapper ocupe el espacio restante */
                }
                main {
                    /* El contenido de la página irá aquí */
                }
            `}</style>
            <style jsx global>{`
                /* Aplicar display flex al body y html para Sticky Footer */
                html, body, #__next {
                    height: 100%;
                    margin: 0;
                    padding: 0;
                }
                #__next {
                    display: flex;
                    flex-direction: column;
                }
                /* Restablecer estilos de texto que pueden haber sido alterados */
                a {
                    text-decoration: none;
                    color: inherit;
                }
            `}</style>
        </>
    );
}