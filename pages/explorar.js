import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchContent } from '../lib/api'; 
import { useContent } from '../context/ContentContext';
import Image from 'next/image';

const createSlug = (item) => `${item.title?.toLowerCase().replace(/\s+/g, '-')}-${item.id_tmdb}`;

const MOVIE_GENRES = [
    { id: 28, name: "Acción" }, { id: 12, name: "Aventura" }, { id: 16, name: "Animación" },
    { id: 35, name: "Comedia" }, { id: 80, name: "Crimen" }, { id: 99, name: "Documental" },
    { id: 18, name: "Drama" }, { id: 10751, name: "Familia" }, { id: 14, name: "Fantasía" },
    { id: 27, name: "Terror" }, { id: 878, name: "Ciencia ficción" }, { id: 53, name: "Suspense" }
];

const TV_GENRES = [
    { id: 10759, name: "Acción y Aventura" }, { id: 16, name: "Animación" }, { id: 35, name: "Comedia" },
    { id: 80, name: "Crimen" }, { id: 18, name: "Drama" }, { id: 10765, name: "Sci-Fi y Fantasía" }
];

export default function Explorar() {
    const router = useRouter();
    const { search } = router.query;

    const [displayList, setDisplayList] = useState([]);
    const [filter, setFilter] = useState('all'); 
    const [yearFilter, setYearFilter] = useState('all');
    const [genreFilter, setGenreFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    
    // Ref para evitar cargas duplicadas en condiciones de scroll rápido
    const isFetching = useRef(false);

    const { setActiveItem } = useContent();

    const currentGenres = useMemo(() => {
        return filter === 'tv' ? TV_GENRES : MOVIE_GENRES;
    }, [filter]);

    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 40 }, (_, i) => currentYear - i);
    }, []);

    useEffect(() => {
        setGenreFilter('all');
    }, [filter]);

    const loadData = useCallback(async (reset = false, currentPage = 1) => {
        if (isFetching.current) return;
        isFetching.current = true;
        setLoading(true);
        
        try {
            const params = {
                page: currentPage,
                limit: 10 // Carga de a 10 elementos para mayor rapidez
            };

            if (filter !== 'all') params.type = filter;
            if (yearFilter !== 'all') params.year = yearFilter;
            if (genreFilter !== 'all') params.genres = genreFilter; 
            if (search) params.query = search;

            const data = await fetchContent(params);
            const newItems = data.movies || []; 
            
            setDisplayList(prev => {
                if (reset) return newItems;
                const existingIds = new Set(prev.map(i => i._id));
                return [...prev, ...newItems.filter(i => !existingIds.has(i._id))];
            });

            setHasMore(data.pagination ? currentPage < data.pagination.totalPages : false);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    }, [filter, yearFilter, genreFilter, search]);

    useEffect(() => {
        if (!router.isReady) return;
        setPage(1);
        loadData(true, 1);
    }, [filter, yearFilter, genreFilter, search, router.isReady]); 

    const handleScroll = useCallback(() => {
        if (loading || !hasMore) return;
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 600) {
            setPage(prev => {
                const nextPage = prev + 1;
                loadData(false, nextPage);
                return nextPage;
            });
        }
    }, [loading, hasMore, loadData]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return (
        <div className="explore-page">
            <Head>
                <title>Explorar | Peliskal</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            </Head>
            <Header />

            <main className="explore-container">
                <header className="explore-header">
                    <h1 className="section-title">
                        {search ? `"${search}"` : 'Explorar'}
                    </h1>
                    
                    <div className="controls-row">
                        <div className="filter-bar">
                            {['all', 'movie', 'tv'].map((type) => (
                                <button 
                                    key={type}
                                    className={`tab-btn ${filter === type ? 'active' : ''}`}
                                    onClick={() => setFilter(type)}
                                >
                                    {type === 'all' ? 'Todo' : type === 'movie' ? 'Cine' : 'TV'}
                                </button>
                            ))}
                        </div>

                        <div className="select-group">
                            <select 
                                value={genreFilter} 
                                onChange={(e) => setGenreFilter(e.target.value)} 
                                className="apple-select"
                            >
                                <option value="all">Género</option>
                                {currentGenres.map(g => (
                                    <option key={g.id} value={g.id}>{g.name}</option>
                                ))}
                            </select>

                            <select 
                                value={yearFilter} 
                                onChange={(e) => setYearFilter(e.target.value)} 
                                className="apple-select"
                            >
                                <option value="all">Año</option>
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>
                </header>

                <section className="grid">
                    {displayList.map((m, index) => (
                        <article key={`${m._id}-${m.id_tmdb}`} className="card" onClick={() => {
                            setActiveItem(m);
                            router.push(`/seeContent/${createSlug(m)}`);
                        }}>
                            <div className="image-container">
                                <Image 
                                    src={m.poster ? `https://image.tmdb.org/t/p/w342${m.poster}` : '/placeholder.png'} 
                                    alt={m.title} 
                                    fill
                                    sizes="(max-width: 768px) 50vw, 200px"
                                    className="poster-image"
                                    priority={index < 4} // Carga prioritaria para los primeros elementos
                                    unoptimized
                                />
                                <div className="type-badge">{m.type === 'tv' ? 'Serie' : 'Peli'}</div>
                            </div>
                            <div className="card-info">
                                <h2 className="card-title">{m.title}</h2>
                                <p className="card-year">{m.release_year} • ⭐ {m.rating?.toFixed(1)}</p>
                            </div>
                        </article>
                    ))}
                </section>

                {loading && <div className="loader"><div className="spinner"></div></div>}
            </main>
            <Footer />

            <style jsx>{`
    .explore-page { background: #040714; min-height: 100vh; color: #f5f5f7; }
    .explore-container { padding: 80px 15px 50px; max-width: 1400px; margin: 0 auto; }
    
    .section-title { font-size: 1.5rem; margin-bottom: 20px; font-weight: 700; }
    
    .controls-row { 
        display: flex; 
        flex-direction: column; 
        gap: 15px; 
        margin-bottom: 25px; 
        background: rgba(28, 28, 30, 0.8); 
        padding: 12px; 
        border-radius: 14px;
        backdrop-filter: blur(10px);
    }

    .filter-bar { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
    .tab-btn { 
        background: rgba(255,255,255,0.05); 
        border: none; 
        color: #a1a1a6; 
        padding: 10px; 
        cursor: pointer; 
        border-radius: 10px; 
        font-size: 0.9rem;
        transition: all 0.2s;
    }
    .tab-btn.active { background: #0071e3; color: white; font-weight: 600; }

    .select-group { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .apple-select { 
        background: #2c2c2e; 
        color: white; 
        border: 1px solid #3a3a3c; 
        padding: 10px; 
        border-radius: 10px; 
        font-size: 0.9rem;
        outline: none;
    }

    /* GRID OPTIMIZADA PARA MÓVILES PEQUEÑOS */
    .grid { 
        display: grid; 
        grid-template-columns: repeat(2, 1fr); 
        gap: 12px; /* Espaciado un poco más ajustado en móvil */
        width: 100%;
    }

    .card { 
        cursor: pointer; 
        transition: transform 0.2s; 
        width: 100%; /* Asegura que la card no exceda su columna */
        overflow: hidden;
    }

    .image-container { 
        position: relative; 
        aspect-ratio: 2/3; 
        border-radius: 10px; 
        overflow: hidden; 
        background: #1c1c1e;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        width: 100%; /* Forzar a que el contenedor use el ancho de la columna */
    }

    /* Fix para que la imagen de Next.js rellene el contenedor sin deformarse */
    :global(.poster-image) { 
        object-fit: cover !important; 
        width: 100% !important;
        height: 100% !important;
        position: absolute !important;
    }

    .card:active { transform: scale(0.96); }

    .type-badge { 
        position: absolute; 
        bottom: 8px; 
        right: 8px; 
        background: rgba(0, 113, 227, 0.9); 
        color: white; 
        padding: 3px 8px; 
        border-radius: 6px; 
        font-size: 0.65rem; 
        font-weight: bold;
        text-transform: uppercase;
        z-index: 2;
    }

    .card-info { padding: 8px 4px; }
    .card-title { 
        font-size: 0.85rem; 
        margin: 0; 
        white-space: nowrap; 
        overflow: hidden; 
        text-overflow: ellipsis; 
        font-weight: 500; 
    }
    .card-year { font-size: 0.75rem; color: #86868b; margin-top: 2px; }

    .loader { display: flex; justify-content: center; padding: 40px; }
    .spinner { 
        width: 30px; height: 30px; 
        border: 3px solid rgba(255,255,255,0.1); 
        border-top-color: #0071e3; 
        border-radius: 50%; 
        animation: spin 1s linear infinite; 
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Desktop y Tablets */
    @media (min-width: 768px) {
        .explore-container { padding: 120px 5% 50px; }
        .grid { 
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); 
            gap: 25px; 
        }
        .controls-row { flex-direction: row; justify-content: space-between; align-items: center; }
        .filter-bar { display: flex; }
        .select-group { display: flex; }
        .section-title { font-size: 2rem; }
        .card-title { font-size: 1rem; }
    }

    /* Soporte para móviles muy pequeños (ej. iPhone SE) */
    @media (max-width: 360px) {
        .grid { gap: 8px; }
        .card-title { font-size: 0.75rem; }
        .explore-container { padding: 70px 10px 50px; }
    }
`}</style>
        </div>
    );
}