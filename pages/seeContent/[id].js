import { useState, useEffect, useMemo } from 'react';
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
    const [currentServer, setCurrentServer] = useState('vidapi');

    // Sincronización para renderizar nuevo contenido sin recargar la página
    useEffect(() => {
        const newItem = activeItem || serverItem;
        if (newItem && newItem._id !== item?._id) {
            setItem(newItem);
            setCurrentS(1);
            setCurrentE(1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [serverItem, activeItem, item?._id]);

    if (!item) return (
        <div className="loading-screen">
            <div className="spinner"></div>
            <p>Cargando contenido...</p>
        </div>
    );

    const currentSeasonData = item.seasons_details?.find(s => s.season_number === parseInt(currentS)) || item.seasons_details?.[0];
    const episodes = currentSeasonData?.episodes || [];
    
    const handleNextEpisode = () => {
        const nextEp = currentE + 1;
        const exists = episodes.find(ep => ep.episode_number === nextEp);
        if (exists) {
            setCurrentE(nextEp);
        }
    };

    const handlePrevEpisode = () => {
        const prevEp = currentE - 1;
        if (prevEp >= 1) {
            setCurrentE(prevEp);
        }
    };

    const seoTitle = `${item.title} (${item.release_year}) | Ver Online en Peliskal`;
    const seoDescription = item.overview?.substring(0, 160) || `Ver ${item.title} online en HD en Peliskal.`;
    const seoImage = `https://image.tmdb.org/t/p/w780${item.poster}`;
    const siteUrl = "https://peliskal.com";

    // Memorizamos la URL para que el iframe no parpadee innecesariamente
    const videoUrl = useMemo(() => {
        const settings = "sub=es&lang=es&audio=es&muted=0&autoplay=1";
        const idTMDB = item.id_tmdb;
        let idIMDB = item.id_imdb;
        
        if (idIMDB && !idIMDB.startsWith('tt')) idIMDB = `tt${idIMDB}`;

        if (currentServer === 'unlimplay') {
            return item.type === 'movie' 
                ? `https://unlimplay.com/play/embed/movie/${idTMDB}?${settings}` 
                : `https://unlimplay.com/play/embed/tv/${idTMDB}/${currentS}/${currentE}?${settings}`;
        }

        const idParaVidapi = idIMDB || idTMDB;
        const typePath = item.type === 'movie' ? 'movie' : 'tv';
        const epPath = item.type === 'movie' ? '' : `/${currentS}/${currentE}`;
        
        return `https://vidapi.ru/embed/${typePath}/${idParaVidapi}${epPath}?${settings}`;
    }, [item, currentS, currentE, currentServer]);

    return (
        <div className="apple-page">
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

            <div className="ambient-bg">
                <div className="blur-img" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${item.backdrop || item.poster})` }}></div>
            </div>

            <main className="container">
                <button onClick={() => router.back()} className="back-btn">❮ Atrás</button>

                <div className="layout">
                    <div className="left-side">
                        <div className="player-wrapper shadow-2xl">
                            <iframe 
                                key={item._id + currentServer + currentS + currentE} 
                                src={videoUrl} 
                                allowFullScreen 
                                allow="autoplay; encrypted-media"
                                referrerPolicy="origin"
                                sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation"
                            ></iframe>
                        </div>

                        <div className="controls-bar glass">
                            <div className="server-selector">
                                <button className={currentServer === 'vidapi' ? 'active' : ''} onClick={() => setCurrentServer('vidapi')}>Servidor 1</button>
                                <button className={currentServer === 'unlimplay' ? 'active' : ''} onClick={() => setCurrentServer('unlimplay')}>Servidor 2</button>
                            </div>
                            
                            {item.type === 'tv' && (
                                <div className="episode-nav">
                                    <button onClick={handlePrevEpisode} disabled={currentE <= 1} className="nav-btn">
                                        Anterior
                                    </button>
                                    <span className="current-indicator">T{currentS} : E{currentE}</span>
                                    <button onClick={handleNextEpisode} disabled={currentE >= episodes.length} className="nav-btn">
                                        Siguiente
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="right-side">
                        <div className="content-header">
                            <span className="premium-label">PELISKAL PREMIUM</span>
                            <h1>{item.title}</h1>
                            <div className="tags">
                                <span className="tag-star">⭐ {item.rating?.toFixed(1)}</span>
                                <span className="tag">{item.release_year}</span>
                                <span className="tag">{item.type === 'tv' ? 'Serie' : 'Película'}</span>
                            </div>
                        </div>

                        <div className="synopsis-section">
                            <h3>Sinopsis</h3>
                            <p>{item.overview || "No hay una descripción disponible para este título."}</p>
                        </div>

                        <div className="extra-info grid grid-cols-2 gap-4">
                            <div>
                                <h4>Géneros</h4>
                                <p>{item.genres?.map(g => g.name || g).join(', ') || 'N/A'}</p>
                            </div>
                            <div>
                                <h4>Duración</h4>
                                <p>{item.runtime ? `${item.runtime} min` : 'N/A'}</p>
                            </div>
                        </div>

                        {item.type === 'tv' && (
                            <div className="episodes-box glass">
                                <div className="box-header">
                                    <h3>Episodios</h3>
                                    <select value={currentS} onChange={(e) => {setCurrentS(e.target.value); setCurrentE(1);}}>
                                        {item.seasons_details?.map(s => (
                                            <option key={s.season_number} value={s.season_number}>Temporada {s.season_number}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="ep-grid">
                                    {episodes.map(ep => (
                                        <button 
                                            key={ep.episode_number}
                                            className={currentE === ep.episode_number ? 'ep-btn active' : 'ep-btn'}
                                            onClick={() => setCurrentE(ep.episode_number)}
                                        >
                                            {ep.episode_number}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <style jsx>{`
                .apple-page { background: #000; min-height: 100vh; color: white; position: relative; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
                .ambient-bg { position: fixed; top: 0; width: 100%; height: 100vh; z-index: 0; overflow: hidden; }
                .blur-img { width: 100%; height: 100%; background-size: cover; background-position: center; filter: blur(80px) saturate(1.6); opacity: 0.3; transition: background-image 0.5s ease; }
                
                .container { position: relative; z-index: 1; max-width: 1400px; margin: 0 auto; padding: 100px 25px 50px; }
                .back-btn { background: none; border: none; color: #0071e3; cursor: pointer; margin-bottom: 20px; font-size: 1rem; transition: 0.2s; }
                .back-btn:hover { color: white; }

                .layout { display: grid; grid-template-columns: 1.6fr 1fr; gap: 40px; }

                .player-wrapper { aspect-ratio: 16/9; background: #000; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }
                iframe { width: 100%; height: 100%; border: none; }

                .glass { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; }
                
                .controls-bar { margin-top: 15px; padding: 15px; display: flex; justify-content: space-between; align-items: center; }
                .server-selector { display: flex; gap: 10px; }
                .server-selector button { background: rgba(255,255,255,0.1); border: none; color: white; padding: 6px 15px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; transition: 0.3s; }
                .server-selector button.active { background: #0071e3; }

                .episode-nav { display: flex; align-items: center; gap: 15px; }
                .nav-btn { background: rgba(255,255,255,0.1); border: none; color: white; padding: 5px 12px; border-radius: 6px; cursor: pointer; font-size: 0.75rem; transition: 0.2s; }
                .nav-btn:hover:not(:disabled) { background: rgba(255,255,255,0.2); }
                .nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
                .current-indicator { font-size: 0.85rem; font-weight: 600; color: #86868b; }

                .premium-label { color: #0071e3; font-weight: 800; font-size: 0.7rem; letter-spacing: 1.5px; }
                h1 { font-size: 3rem; font-weight: 700; margin: 5px 0 15px; letter-spacing: -1px; }
                .tags { display: flex; gap: 10px; margin-bottom: 25px; }
                .tag { background: rgba(255,255,255,0.1); padding: 4px 12px; border-radius: 6px; font-size: 0.8rem; }
                .tag-star { color: #f5c518; font-weight: bold; }

                .synopsis-section { margin-bottom: 30px; }
                .synopsis-section h3 { font-size: 1.2rem; margin-bottom: 10px; color: #86868b; }
                .synopsis-section p { line-height: 1.6; color: #d2d2d7; font-size: 1.05rem; }

                .extra-info h4 { font-size: 0.8rem; color: #86868b; text-transform: uppercase; margin-bottom: 4px; }
                .extra-info p { font-size: 0.95rem; margin-bottom: 20px; }

                .episodes-box { margin-top: 30px; padding: 20px; }
                .box-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                select { background: #1c1c1e; color: white; border: 1px solid #333; padding: 5px 10px; border-radius: 6px; }
                
                .ep-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(45px, 1fr)); gap: 8px; max-height: 400px; overflow-y: auto; }
                .ep-btn { background: rgba(255,255,255,0.1); border: none; color: white; padding: 10px 0; border-radius: 6px; cursor: pointer; font-size: 0.8rem; }
                .ep-btn.active { background: #0071e3; font-weight: bold; }

                @media (max-width: 1000px) {
                    .layout { grid-template-columns: 1fr; }
                    .right-side { order: 2; }
                    .left-side { order: 1; }
                    h1 { font-size: 2.2rem; }
                    .container { padding-top: 80px; }
                    .controls-bar { flex-direction: column; gap: 15px; }
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
        return { props: { item: null } };
    }
}