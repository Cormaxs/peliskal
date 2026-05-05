import { useState, useEffect } from 'react';
import Head from 'next/head';
import Footer from '../../components/Footer';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import { fetchContentById } from '../../lib/api'; 
import { useContent } from '../../context/ContentContext'; 

export default function SeeContentPage({ item: serverItem }) {
    const router = useRouter();
    const { activeItem } = useContent(); 
    const [item, setItem] = useState(activeItem || serverItem);

    const [currentS, setCurrentS] = useState(1);
    const [currentE, setCurrentE] = useState(1);
    const [currentServer, setCurrentServer] = useState('vidapi'); // Cambiado a vidapi por defecto

    useEffect(() => {
        if (!activeItem && serverItem) {
            setItem(serverItem);
        }
    }, [serverItem, activeItem]);

    if (!item) return (
        <div className="loading-screen">
            <div className="spinner"></div>
            <p>Cargando contenido...</p>
        </div>
    );

    const seoTitle = `${item.title} (${item.release_year}) | Peliskal`;
    const seoDescription = item.overview?.substring(0, 160) || `Ver ${item.title} online en HD con audio español en Peliskal.`;
    const seoImage = `https://image.tmdb.org/t/p/w780${item.poster}`;
    const siteUrl = "https://peliskal.com"; 

    const currentSeasonData = item.seasons_details?.find(s => s.season_number === parseInt(currentS)) || item.seasons_details?.[0];
    const episodes = currentSeasonData?.episodes || [];

    const getVideoUrl = () => {
        const settings = "?sub=es&lang=es&muted=0&autoplay=1";
        
        const engines = {
            vidapi: "https://vidapi.ru/embed",
            unlimplay: "https://unlimplay.com/play/embed"
        };

        const idTMDB = item.id_tmdb;
        let idIMDB = item.id_imdb;
        if (idIMDB && !idIMDB.startsWith('tt')) {
            idIMDB = `tt${idIMDB}`;
        }

        switch (currentServer) {
            case 'unlimplay':
                return item.type === 'movie'
                    ? `${engines.unlimplay}/movie/${idTMDB}${settings}`
                    : `${engines.unlimplay}/tv/${idTMDB}/${currentS}/${currentE}${settings}`;

            default: // 'vidapi'
                const idParaVidapi = idIMDB || idTMDB;
                return item.type === 'movie' 
                    ? `${engines.vidapi}/movie/${idParaVidapi}${settings}` 
                    : `${engines.vidapi}/tv/${idParaVidapi}/${currentS}/${currentE}${settings}`;
        }
    };

    return (
        <div className="page-wrapper">
            <Head>
                <title>{seoTitle}</title>
                <meta name="description" content={seoDescription} />
                <meta name="robots" content="index, follow" />
                <meta charSet="utf-8" />
                <meta property="og:type" content="video.movie" />
                <meta property="og:title" content={seoTitle} />
                <meta property="og:description" content={seoDescription} />
                <meta property="og:image" content={seoImage} />
                <meta property="og:url" content={`${siteUrl}${router.asPath}`} />
                <meta property="og:site_name" content="Peliskal" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={seoTitle} />
                <meta name="twitter:description" content={seoDescription} />
                <meta name="twitter:image" content={seoImage} />
            </Head>

            <Header />

            <div className="hero-bg" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${item.poster})` }}></div>

            <main className="main-content">
                <button onClick={() => router.back()} className="back-btn">
                    ❮ Volver atrás
                </button>

                <div className="player-section">
                    <div className="video-card">
                        <div className="iframe-container">
                            <iframe 
                                key={currentServer + currentS + currentE} 
                                title={item.title}
                                src={getVideoUrl()} 
                                allowFullScreen 
                                allow="autoplay; encrypted-media"
                                sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation"
                            ></iframe>
                        </div>
                    </div>

                    <div className="server-bar">
                        {[
                            { 
                                id: 'vidapi', 
                                label: 'Principal', 
                                desc: 'Ideal para Europa/Asia',
                                icon: '🇺🇸' 
                            },
                            { 
                                id: 'unlimplay', 
                                label: 'secundario', 
                                desc: 'Mejor audio en español',
                                icon: '🇪🇸 ' 
                            },
                        ].map((srv) => (
                            <button 
                                key={srv.id}
                                className={currentServer === srv.id ? 'active' : ''} 
                                onClick={() => setCurrentServer(srv.id)}
                                title={srv.desc}
                            >
                                <span className="srv-icon">{srv.icon}</span>
                                <div className="btn-text">
                                    <span className="label">{srv.label}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="details-grid">
                    <section className="info-side">
                        <div className="meta-head">
                            <h1>{item.title}</h1>
                            <div className="meta-tags">
                                <span className="year">{item.release_year}</span>
                                <span className="type-badge">{item.type === 'tv' ? 'SERIE' : 'PELÍCULA'}</span>
                                <span className="rating">⭐ {item.rating?.toFixed(1)}</span>
                            </div>
                        </div>

                        <p className="description">{item.overview || "Sinopsis no disponible en este momento."}</p>
                        
                        {item.type === 'tv' && (
                            <div className="series-picker">
                                <div className="picker-header">
                                    <h3>Temporadas</h3>
                                    <select value={currentS} onChange={(e) => {setCurrentS(e.target.value); setCurrentE(1);}}>
                                        {item.seasons_details?.map(s => (
                                            <option key={s.season_number} value={s.season_number}>Temporada {s.season_number}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="episodes-grid">
                                    {episodes.map(ep => (
                                        <button 
                                            key={ep.episode_number}
                                            className={currentE === ep.episode_number ? 'ep-card active' : 'ep-card'}
                                            onClick={() => setCurrentE(ep.episode_number)}
                                        >
                                            EP {ep.episode_number}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <style jsx>{`
                .page-wrapper { background: #040714; min-height: 100vh; color: white; position: relative; }
                
                .hero-bg {
                    position: fixed; top: 0; left: 0; width: 100%; height: 60vh;
                    background-size: cover; background-position: center 20%;
                    mask-image: linear-gradient(to bottom, rgba(0,0,0,1), transparent);
                    opacity: 0.3; z-index: 0; filter: blur(40px);
                }

                .main-content { 
                    position: relative; z-index: 10; 
                    padding: 120px 5% 50px; 
                    max-width: 1300px; margin: 0 auto;
                }

                .back-btn {
                    background: none; border: none;
                    display: inline-block; margin-bottom: 25px;
                    color: #86868b; cursor: pointer; font-size: 0.9rem;
                    transition: 0.3s; font-family: inherit;
                }
                .back-btn:hover { color: #0071e3; transform: translateX(-5px); }

                .player-section { margin-bottom: 40px; }
                .video-card { 
                    background: #000; border-radius: 16px; overflow: hidden;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.8);
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .iframe-container { position: relative; padding-bottom: 56.25%; height: 0; }
                iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }

                .server-bar { 
                    display: flex; gap: 10px; margin-top: 15px; 
                    justify-content: center;
                }
                .server-bar button {
                    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
                    color: #86868b; padding: 8px 20px; border-radius: 20px;
                    cursor: pointer; font-size: 0.8rem; transition: 0.3s;
                    display: flex; align-items: center; gap: 8px;
                }
                .server-bar button.active { background: #0071e3; color: white; border-color: #0071e3; }

                .details-grid { max-width: 900px; margin-top: 50px; }
                .meta-head h1 { font-size: 2.5rem; font-weight: 800; margin: 0; letter-spacing: -1px; }
                .meta-tags { display: flex; gap: 15px; align-items: center; margin: 15px 0; }
                .year { color: #86868b; font-size: 1.2rem; }
                .type-badge { background: #333; padding: 4px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; }
                .rating { color: #f5c518; font-weight: bold; }
                .description { color: #d2d2d7; line-height: 1.6; font-size: 1.1rem; }

                .series-picker { margin-top: 40px; background: rgba(255,255,255,0.03); padding: 25px; border-radius: 16px; }
                .picker-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                select { background: #1c1c1e; color: white; border: 1px solid #333; padding: 8px 15px; border-radius: 8px; outline: none; }

                .episodes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); gap: 10px; }
                .ep-card { 
                    background: #1c1c1e; border: 1px solid #333; color: white; 
                    padding: 10px; border-radius: 8px; cursor: pointer; transition: 0.2s; font-size: 0.8rem;
                    text-align: center;
                }
                .ep-card:hover { border-color: #0071e3; }
                .ep-card.active { background: #0071e3; border-color: #0071e3; font-weight: bold; }

                .loading-screen { 
                    height: 100vh; display: flex; flex-direction: column; 
                    align-items: center; justify-content: center; background: #040714; 
                }
                .spinner { width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.1); border-top-color: #0071e3; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px; }
                @keyframes spin { to { transform: rotate(360deg); } }

                @media (max-width: 900px) {
                    .meta-head h1 { font-size: 1.8rem; }
                }
            `}</style>
            <Footer />
        </div>
    );
}

export async function getServerSideProps(context) {
    const { id } = context.params;
    const idFromUrl = id.split('-').pop(); 
    try {
        const data = await fetchContentById(idFromUrl);
        return { props: { item: data || null } };
    } catch (e) {
        console.error("Error SSR:", e);
        return { props: { item: null } };
    }
}