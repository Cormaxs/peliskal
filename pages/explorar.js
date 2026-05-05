import { useState, useEffect, useCallback, useMemo } from 'react';
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
    { id: 36, name: "Historia" }, { id: 27, name: "Terror" }, { id: 10402, name: "Música" },
    { id: 9648, name: "Misterio" }, { id: 10749, name: "Romance" }, { id: 878, name: "Ciencia ficción" },
    { id: 10770, name: "Película de TV" }, { id: 53, name: "Suspense" }, { id: 10752, name: "Bélica" },
    { id: 37, name: "Western" }
];

const TV_GENRES = [
    { id: 10759, name: "Acción y Aventura" }, { id: 16, name: "Animación" }, { id: 35, name: "Comedia" },
    { id: 80, name: "Crimen" }, { id: 99, name: "Documental" }, { id: 18, name: "Drama" },
    { id: 10751, name: "Familia" }, { id: 10762, name: "Kids" }, { id: 9648, name: "Misterio" },
    { id: 10763, name: "Noticias" }, { id: 10764, name: "Reality" }, { id: 10765, name: "Sci-Fi y Fantasía" },
    { id: 10766, name: "Telenovela" }, { id: 10767, name: "Talk Show" }, { id: 10768, name: "Guerra y Política" },
    { id: 37, name: "Western" }
];

export default function Explorar() {
    const router = useRouter();
    const { search } = router.query; // Capturamos la búsqueda de la URL

    const [displayList, setDisplayList] = useState([]);
    const [filter, setFilter] = useState('all'); 
    const [yearFilter, setYearFilter] = useState('all');
    const [genreFilter, setGenreFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const { setActiveItem } = useContent();

    const currentGenres = useMemo(() => {
        if (filter === 'movie') return MOVIE_GENRES;
        if (filter === 'tv') return TV_GENRES;
        return [...MOVIE_GENRES]; 
    }, [filter]);

    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 50 }, (_, i) => currentYear - i);
    }, []);

    // RESET de géneros al cambiar tipo
    useEffect(() => {
        setGenreFilter('all');
    }, [filter]);

    const loadData = useCallback(async (reset = false, currentPage = 1) => {
        if (loading && !reset) return;
        setLoading(true);
        
        try {
            const params = {
                page: currentPage,
                limit: 20
            };

            // Lógica de filtros
            if (filter !== 'all') params.type = filter;
            if (yearFilter !== 'all') params.year = yearFilter;
            
            // CORRECCIÓN: Enviamos el ID numérico del género
            if (genreFilter !== 'all') params.genres = genreFilter; 
            
            // CORRECCIÓN: Si hay búsqueda en el router, la incluimos
            if (search) params.query = search;

            const data = await fetchContent(params);
            const newItems = data.movies || []; 
            
            if (reset) {
                setDisplayList(newItems);
            } else {
                setDisplayList(prev => {
                    const existingIds = new Set(prev.map(i => i._id));
                    const uniqueNewItems = newItems.filter(i => !existingIds.has(i._id));
                    return [...prev, ...uniqueNewItems];
                });
            }

            setHasMore(data.pagination ? currentPage < data.pagination.totalPages : false);
        } catch (error) {
            console.error("Error en API:", error);
        } finally {
            setLoading(false);
        }
    }, [filter, yearFilter, genreFilter, search, loading]);

    // Efecto para reaccionar a cambios en filtros o BÚSQUEDA
    useEffect(() => {
        if (!router.isReady) return; // Esperar a que el router esté listo
        setPage(1);
        loadData(true, 1);
    }, [filter, yearFilter, genreFilter, search, router.isReady]); 

    const handleScroll = useCallback(() => {
        if (loading || !hasMore) return;
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = window.innerHeight;

        if (scrollTop + clientHeight >= scrollHeight - 800) {
            setPage(prev => {
                const nextPage = prev + 1;
                loadData(false, nextPage);
                return nextPage;
            });
        }
    }, [loading, hasMore, loadData]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return (
        <div className="explore-page">
            <Head>
                <title>Explorar | Peliskal</title>
            </Head>
            <Header />

            <main className="explore-container">
                <header className="explore-header">
                    <h1 className="section-title">
                        {search ? `Resultados para: "${search}"` : 'Catálogo Completo'}
                    </h1>
                    
                    <div className="controls-row">
                        <div className="filter-group">
                            <div className="filter-bar">
                                {['all', 'movie', 'tv'].map((type) => (
                                    <button 
                                        key={type}
                                        className={`tab-btn ${filter === type ? 'active' : ''}`}
                                        onClick={() => setFilter(type)}
                                    >
                                        {type === 'all' ? 'Todos' : type === 'movie' ? 'Películas' : 'Series'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="select-group">
                            <select 
                                value={genreFilter} 
                                onChange={(e) => setGenreFilter(e.target.value)} 
                                className="apple-select"
                            >
                                <option value="all">Todos los Géneros</option>
                                {currentGenres.map(g => (
                                    <option key={g.id} value={g.id}>{g.name}</option>
                                ))}
                            </select>

                            <select 
                                value={yearFilter} 
                                onChange={(e) => setYearFilter(e.target.value)} 
                                className="apple-select"
                            >
                                <option value="all">Cualquier Año</option>
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>
                </header>

                <section className="grid">
                    {displayList.map((m) => (
                        <article key={`${m._id}-${m.id_tmdb}`} className="card" onClick={() => {
                            setActiveItem(m);
                            router.push(`/seeContent/${createSlug(m)}`);
                        }}>
                            <div className="type-badge">{m.type === 'tv' ? 'Serie' : 'Película'}</div>
                            <div className="image-container">
                                <Image 
                                    src={m.poster ? `https://image.tmdb.org/t/p/w500${m.poster}` : '/placeholder.png'} 
                                    alt={m.title} 
                                    fill
                                    className="poster-image"
                                    unoptimized
                                />
                            </div>
                            <div className="card-info">
                                <h2 className="card-title">{m.title}</h2>
                                <p className="card-year">{m.release_year}</p>
                            </div>
                        </article>
                    ))}
                </section>

                {loading && <div className="loader">Cargando contenido...</div>}
                {!loading && displayList.length === 0 && (
                    <div className="no-results">No se encontraron resultados para tu búsqueda.</div>
                )}
            </main>
            <Footer />

            <style jsx>{`
                /* (Tus estilos se mantienen igual) */
                .explore-page { background: #040714; min-height: 100vh; color: #f5f5f7; }
                .explore-container { padding: 120px 5% 50px; max-width: 1400px; margin: 0 auto; }
                .section-title { font-size: 1.8rem; margin-bottom: 25px; }
                .controls-row { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 30px; background: #1c1c1e; padding: 15px; border-radius: 12px; }
                .filter-bar { display: flex; gap: 5px; }
                .tab-btn { background: none; border: none; color: #a1a1a6; padding: 8px 16px; cursor: pointer; border-radius: 8px; }
                .tab-btn.active { background: #0071e3; color: white; }
                .apple-select { background: #2c2c2e; color: white; border: none; padding: 10px; border-radius: 8px; }
                .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 20px; }
                .card { cursor: pointer; transition: 0.3s; position: relative; }
                .card:hover { transform: scale(1.05); }
                .image-container { position: relative; aspect-ratio: 2/3; border-radius: 10px; overflow: hidden; }
                .type-badge { position: absolute; top: 8px; left: 8px; background: #0071e3; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; z-index: 2; }
                .card-info { padding: 10px 0; }
                .card-title { font-size: 0.9rem; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .card-year { font-size: 0.8rem; color: #86868b; }
                .loader { text-align: center; margin-top: 20px; }
            `}</style>
        </div>
    );
}