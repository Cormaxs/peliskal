import { fetchContent } from '../lib/api';
import Head from 'next/head';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import Link from 'next/link';
import Image from 'next/image'; // Importación añadida

export default function Home({ contentData, currentQuery }) {
    const { setActiveItem } = useContent();
    const [currentHeroIdx, setCurrentHeroIdx] = useState(0);
    const moviesDB = contentData?.movies || [];
    const heroList = moviesDB.slice(0, 10);

    const GENRES = { action: 28, animation: 16, horror: 27, scifi: 878, documentary: 99 };
    const filterByGenre = (id) => moviesDB.filter(m => m.genres?.includes(id)).slice(0, 20);

    const sections = [
        { title: "Tendencias Populares", data: moviesDB.slice(0, 20) },
        { title: "Series de TV Destacadas", data: moviesDB.filter(m => m.type === 'tv').slice(0, 20) },
        { title: "Acción y Aventura", data: filterByGenre(GENRES.action) },
        { title: "Animación", data: filterByGenre(GENRES.animation) },
    ];

    useEffect(() => {
        if (heroList.length > 0) {
            const timer = setInterval(() => {
                setCurrentHeroIdx((prev) => (prev + 1) % heroList.length);
            }, 8000);
            return () => clearInterval(timer);
        }
    }, [heroList.length]);

    const scrollTrack = (id, amount) => {
        const element = document.getElementById(id);
        if (element) element.scrollBy({ left: amount, behavior: 'smooth' });
    };

    const createSlug = (item) => `${item.title?.toLowerCase().replace(/\s+/g, '-')}-${item.id_tmdb}`;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Peliskal",
        "url": "https://peliskal.com",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://peliskal.com/explorar?search={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    return (
        <div className="peliskal-theme">
            <Head>
                <title>Peliskal | Ver Películas y Series Online en HD</title>
                <meta name="description" content="Disfruta de las mejores películas y series de TV en alta definición. Tendencias, estrenos y clásicos en Peliskal, tu plataforma de streaming premium." />
                <meta name="keywords" content="películas online, ver series gratis, estrenos de cine, Peliskal, streaming HD, series de tv" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="canonical" href="https://peliskal.com" />
                <meta charSet="utf-8" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://peliskal.com" />
                <meta property="og:title" content="Peliskal | Premium Streaming de Películas y Series" />
                <meta property="og:description" content="La mejor experiencia visual. Cientos de títulos disponibles para ver ahora mismo en HD." />
                <meta property="og:image" content="https://peliskal.com/og-image.jpg" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Peliskal | Premium Streaming" />
                <meta name="twitter:description" content="Mira tus películas y series favoritas en la mejor calidad." />
                <meta name="twitter:image" content="https://peliskal.com/og-image.jpg" />
                <script 
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
            </Head>

            <Header />

            {!currentQuery && heroList.length > 0 && (
                <section className="hero" aria-label="Contenido Destacado" style={{ 
                    backgroundImage: `linear-gradient(to right, #040714 20%, transparent 80%), url(https://image.tmdb.org/t/p/original${heroList[currentHeroIdx]?.backdrop})` 
                }}>
                    <div className="hero-content">
                        <div className="hero-badge">
                            <span>{heroList[currentHeroIdx].type === 'tv' ? 'SERIE' : 'PELÍCULA'}</span>
                            <span className="year">{heroList[currentHeroIdx].release_year}</span>
                        </div>
                        <h1 className="hero-title">{heroList[currentHeroIdx].title}</h1>
                        <p className="hero-overview">{heroList[currentHeroIdx].overview?.substring(0, 160)}...</p>
                        <Link href={`/seeContent/${createSlug(heroList[currentHeroIdx])}`} passHref legacyBehavior>
                            <a className="btn-watch" onClick={() => setActiveItem(heroList[currentHeroIdx])}>▶ Ver Ahora</a>
                        </Link>
                    </div>
                </section>
            )}

            <main className="content-rows">
                {sections.map((sec, idx) => (
                    sec.data.length > 0 && (
                        <section className="row" key={idx}>
                            <h2 className="row-title">{sec.title}</h2>
                            <div className="carousel-container">
                                <button className="nav-btn prev" aria-label="Anterior" onClick={() => scrollTrack(`track-${idx}`, -600)}>❮</button>
                                <div className="carousel-track" id={`track-${idx}`}>
                                    {sec.data.map(item => (
                                        <Link key={item._id} href={`/seeContent/${createSlug(item)}`} passHref legacyBehavior>
                                            <a className="card" onClick={() => setActiveItem(item)}>
                                                <div className="type-badge">{item.type === 'tv' ? 'Serie' : 'Peli'}</div>
                                                <div className="card-image-wrapper">
                                                    <Image 
                                                        src={`https://image.tmdb.org/t/p/w342${item.poster}`} 
                                                        alt={`Ver ${item.title} online`} 
                                                        fill
                                                        sizes="(max-width: 768px) 130px, 180px"
                                                        className="card-img"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div className="card-overlay">
                                                    <span className="card-title">{item.title}</span>
                                                </div>
                                            </a>
                                        </Link>
                                    ))}
                                </div>
                                <button className="nav-btn next" aria-label="Siguiente" onClick={() => scrollTrack(`track-${idx}`, 600)}>❯</button>
                            </div>
                        </section>
                    )
                ))}
            </main>

            <style jsx global>{`
                :root {
                    --bg: #040714;
                    --accent: #0071e3;
                    --text: #f5f5f7;
                }
                body {
                    background-color: var(--bg);
                    color: var(--text);
                    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
                    margin: 0;
                }
                .hero {
                    height: 85vh;
                    display: flex;
                    align-items: center;
                    padding: 0 5%;
                    background-size: cover;
                    background-position: center;
                    transition: background-image 0.8s ease-in-out;
                    position: relative;
                }
                .hero::after {
                    content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 50%;
                    background: linear-gradient(to top, var(--bg), transparent);
                }
                .hero-content { z-index: 10; max-width: 600px; }
                .hero-title { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; margin: 15px 0; }
                .hero-badge { display: flex; gap: 10px; align-items: center; }
                .hero-badge span { background: var(--accent); padding: 4px 10px; border-radius: 5px; font-size: 0.7rem; font-weight: bold; }
                .btn-watch {
                    display: inline-block; background: #fff; color: #000; padding: 12px 30px;
                    border-radius: 10px; font-weight: bold; text-decoration: none; margin-top: 20px;
                    transition: 0.3s;
                }
                .btn-watch:hover { transform: scale(1.05); background: var(--accent); color: #fff; }
                .row { padding: 20px 0 20px 5%; overflow: hidden; }
                .row-title { font-size: 1.4rem; margin-bottom: 15px; font-weight: 600; opacity: 0.9; }
                .carousel-container { position: relative; display: flex; align-items: center; }
                .carousel-track {
                    display: flex; gap: 15px; overflow-x: auto; scroll-behavior: smooth;
                    padding: 10px 0; scrollbar-width: none;
                }
                .carousel-track::-webkit-scrollbar { display: none; }
                .card {
                    flex: 0 0 auto; width: 180px; aspect-ratio: 2/3; border-radius: 12px;
                    position: relative; overflow: hidden; transition: 0.4s;
                }
                .card:hover { transform: scale(1.05); z-index: 10; box-shadow: 0 10px 20px rgba(0,0,0,0.5); }
                
                /* Estilos para el nuevo contenedor de Image */
                .card-image-wrapper {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }
                :global(.card-img) {
                    object-fit: cover;
                }

                .type-badge {
                    position: absolute; top: 8px; right: 8px;
                    background: rgba(0,0,0,0.6); backdrop-filter: blur(5px);
                    color: #fff; font-size: 0.6rem; padding: 3px 7px; border-radius: 5px;
                    text-transform: uppercase; border: 1px solid rgba(255,255,255,0.2);
                    z-index: 5;
                }
                .card-overlay {
                    position: absolute; bottom: 0; width: 100%; padding: 15px 5px;
                    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
                    text-align: center;
                    z-index: 4;
                }
                .card-title { font-size: 0.75rem; font-weight: 500; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: white; }
                .nav-btn {
                    position: absolute; top: 50%; transform: translateY(-50%);
                    background: rgba(0,0,0,0.5); border: none; color: white;
                    width: 40px; height: 40px; border-radius: 50%; cursor: pointer;
                    z-index: 20; backdrop-filter: blur(10px); opacity: 0; transition: 0.3s;
                }
                .row:hover .nav-btn { opacity: 1; }
                .nav-btn.prev { left: 10px; }
                .nav-btn.next { right: 20px; }
                @media (max-width: 768px) {
                    .hero { height: 60vh; padding-top: 80px; }
                    .card { width: 130px; }
                    .nav-btn { display: none; }
                }
            `}</style>
            <Footer />
        </div>
    );
}

export async function getServerSideProps({ query }) {
    const search = query.q || '';
    const contentData = await fetchContent({ query: search, page: 1, limit: 100 });
    return { props: { contentData, currentQuery: search } };
}