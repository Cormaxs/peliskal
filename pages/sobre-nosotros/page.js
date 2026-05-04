// pages/about.js

import Head from 'next/head';

export default function About() {
  return (
    <>
      <Head>
        <title>Acerca de Nosotros - Biblioteca Digital</title>
        <meta name="description" content="Nuestra historia: la pasión por los libros y la creación de la Biblioteca Digital." />
      </Head>

      <div className="about-container">
        <h1 className="title">Nuestra Historia y Misión</h1>
        
        <section className="mission-section">
          <p className="lead-paragraph">
            En un mundo que evoluciona rápidamente, creemos que el acceso al conocimiento y a las grandes historias debe ser universal y sencillo. Esta Biblioteca Digital nació de una pasión sencilla pero profunda: el **amor incondicional por los libros**.
          </p>
          <p>
            Somos un pequeño equipo de entusiastas y desarrolladores que un día decidimos tomar acción. Nuestro objetivo es ambicioso: crear una biblioteca digital con la **mayor cantidad de libros que podamos recopilar** y poner a disposición, ofreciendo un catálogo vasto y de fácil acceso para cualquier lector, sin importar dónde se encuentre.
          </p>
          <p>
            Buscamos ser el puente que conecta a los lectores con las obras que han cambiado el mundo y con los nuevos talentos literarios. Cada libro añadido es un paso más cerca de hacer realidad nuestra visión de una biblioteca sin límites físicos.
          </p>
        </section>

        <hr className="divider" />
        
        <section className="peers-section">
          <h2 className="subtitle">Otras Comunidades y Plataformas Similares</h2>
          <p>
            Reconocemos y admiramos el esfuerzo de otras plataformas que comparten esta misión de democratizar la lectura. Creemos en un ecosistema digital colaborativo.
          </p>
          <p>
            Algunos sitios web que comparten el objetivo de ofrecer amplios catálogos y recursos digitales incluyen:
          </p>
          <ul className="link-list">
            <li>
              <a href="http://dundermifflin.com" target="_blank" rel="noopener noreferrer" className="external-link">
                DunderMifflin.com
              </a>
            </li>
            <li>
              <a href="http://lectulandia.com" target="_blank" rel="noopener noreferrer" className="external-link">
                Lectulandia.com
              </a>
            </li>
            <li>
              <a href="http://lectulandia.dev" target="_blank" rel="noopener noreferrer" className="external-link">
                Lectulandia.dev
              </a>
            </li>
          </ul>
        </section>

      </div>

      <style jsx>{`
        .about-container {
          max-width: 900px;
          margin: 50px auto;
          padding: 50px 3vw;
          background-color: #1c1c1c; /* Fondo ligeramente más claro que el body */
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
          color: #e5e5e5;
          min-height: 60vh;
        }

        .title {
          font-size: 3rem;
          color: #e50914; /* Rojo de acento */
          text-align: center;
          margin-bottom: 40px;
          font-weight: 700;
        }
        
        .subtitle {
          font-size: 1.8rem;
          color: #fff;
          margin-top: 40px;
          margin-bottom: 20px;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
        }

        .lead-paragraph {
          font-size: 1.25rem;
          font-weight: 400;
          margin-bottom: 30px;
          color: #fff;
          line-height: 1.6;
        }
        
        p {
          font-size: 1.1rem;
          line-height: 1.7;
          margin-bottom: 20px;
        }
        
        .divider {
          border: 0;
          height: 1px;
          background-image: linear-gradient(to right, #333, #555, #333);
          margin: 50px 0;
        }

        .link-list {
          list-style: disc;
          margin-left: 20px;
          padding-left: 0;
          font-size: 1.1rem;
          line-height: 2;
        }

        .external-link {
          color: #0070f3; /* Azul típico de enlaces */
          text-decoration: none;
          transition: color 0.2s;
        }

        .external-link:hover {
          color: #ff3847; /* Rojo de acento al hacer hover */
          text-decoration: underline;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .about-container {
            padding: 30px 15px;
            margin: 30px auto;
          }
          .title {
            font-size: 2.2rem;
          }
          .lead-paragraph {
            font-size: 1.1rem;
          }
          .subtitle {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}