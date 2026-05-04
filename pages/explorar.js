import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { fetchContent } from '../lib/api'; 
import { useContent } from '../context/ContentContext';

const createSlug = (item) => `${item.title?.toLowerCase().replace(/\s+/g, '-')}-${item.id_tmdb}`;

export default function Explorar() {
    const [movies, setMovies] = useState([]);
    const [displayList, setDisplayList] = useState([]);
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const { setActiveItem } = useContent();
    const router = useRouter();
    const { search } = router.query;

    // --- Lógica de SEO Dinámico ---
    const getPageTitle = () => {
        if (search) return `Resultados para "${search}" | Peliskal`;
        const filters = {
            'movie': 'Películas',
            'tv': 'Series de TV',
            'genre-28': 'Acción',
            'genre-35': 'Comedia',
            'genre-27': 'Terror',
            'genre-878': 'Ciencia Ficción'
        };
        return `${filters[filter] || 'Explorar Catálogo'} | Peliskal`;
    };

    const getPageDescription = () => {
        if (search) return `Busca y encuentra "${search}" en Peliskal. Tu contenido favorito disponible en streaming HD.`;
        return `Explora nuestro catálogo completo de películas y series. Filtra por género y encuentra los últimos estrenos de acción, comedia, terror y más.`;
    };

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                const savedFilter = sessionStorage.getItem('explorarFilter') || 'all';
                const currentFilter = search ? 'all' : savedFilter;
                setFilter(currentFilter);

                const data = await fetchContent({ limit: 500 }); 
                const sorted = (data.movies || []).sort((a, b) => b.release_year - a.release_year);
                setMovies(sorted);
                
                applyFilter(currentFilter, sorted, 1, search);
            } catch (error) {
                console.error("Error cargando catálogo:", error);
            }
            setLoading(false);
        };
        loadInitialData();
    }, [search]);

    const applyFilter = (type, allData, currentPage, searchTerm = "") => {
        let filtered = [...allData];

        if (searchTerm) {
            filtered = filtered.filter(m => 
                m.title?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (type === 'movie') filtered = filtered.filter(m => m.type === 'movie');
        else if (type === 'tv') filtered = filtered.filter(m => m.type === 'tv');
        else if (type.startsWith('genre-')) {
            const genreId = parseInt(type.split('-')[1]);
            filtered = filtered.filter(m => m.genres?.includes(genreId));
        }

        const endOffset = currentPage * 20;
        const itemsToDisplay = filtered.slice(0, endOffset);
        
        setDisplayList(itemsToDisplay);
        setHasMore(itemsToDisplay.length < filtered.length);
    };

    const handleFilterChange = (type) => {
        setFilter(type);
        setPage(1);
        sessionStorage.setItem('explorarFilter', type);
        if (search) router.push('/explorar', undefined, { shallow: true });
        applyFilter(type, movies, 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleScroll = useCallback(() => {
        if (loading || !hasMore) return;
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 800) {
            setPage(prev => {
                const nextPage = prev + 1;
                applyFilter(filter, movies, nextPage, search);
                return nextPage;
            });
        }
    }, [loading, hasMore, filter, movies, search]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const handleSelect = (movie) => {
        setActiveItem(movie);
        router.push(`/seeContent/${createSlug(movie)}`);
    };

    return (
        <div className="explore-page">
            <Head>
                {/* SEO Dinámico */}
                <title>{getPageTitle()}</title>
                <meta name="description" content={getPageDescription()} />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={`https://peliskal.com/explorar${filter !== 'all' ? `?filter=${filter}` : ''}`} />
        <meta charSet="utf-8" />
                {/* Open Graph / Redes Sociales */}
                <meta property="og:title" content={getPageTitle()} />
                <meta property="og:description" content={getPageDescription()} />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://peliskal.com/og-catalog-image.jpg" />
                
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={getPageTitle()} />
                <meta name="twitter:description" content={getPageDescription()} />
            </Head>

            <Header />

            <main className="explore-container">
                <header className="explore-header">
                    <h1 className="sr-only">Catálogo de Películas y Series - Peliskal</h1>
                    <div className="filter-bar" role="tablist" aria-label="Filtros de catálogo">
                        {[
                            { id: 'all', label: 'Todos' },
                            { id: 'movie', label: 'Películas' },
                            { id: 'tv', label: 'Series' },
                            { id: 'genre-28', label: 'Acción' },
                            { id: 'genre-35', label: 'Comedia' },
                            { id: 'genre-27', label: 'Terror' },
                            { id: 'genre-878', label: 'Ciencia Ficción' }
                        ].map((btn) => (
                            <button 
                                key={btn.id}
                                role="tab"
                                aria-selected={filter === btn.id}
                                className={`tab-btn ${filter === btn.id && !search ? 'active' : ''}`}
                                onClick={() => handleFilterChange(btn.id)}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </header>

                {search && (
                    <div className="search-info" aria-live="polite">
                        <p>Mostrando resultados para: <strong>{search}</strong></p>
                        <button onClick={() => router.push('/explorar')}>Ver todo el catálogo</button>
                    </div>
                )}

                <section className="grid" aria-label="Listado de contenido">
                    {displayList.map((m) => (
                        <article key={m._id} className="card" onClick={() => handleSelect(m)}>
                            <div className="type-badge">{m.type === 'tv' ? 'Serie' : 'Peli'}</div>
                            <img 
                                src={`https://image.tmdb.org/t/p/w500${m.poster}`} 
                                alt={`Ver ${m.title} online en Peliskal`} 
                                loading="lazy" 
                            />
                            <div className="card-info">
                                <h2 className="card-title">{m.title}</h2>
                            </div>
                        </article>
                    ))}
                </section>

                {loading && <div className="loader" box-role="status">Cargando catálogo...</div>}
                
                {!hasMore && displayList.length > 0 && (
                    <div className="end-msg">Has llegado al final del catálogo de {filter}</div>
                )}
            </main>

            <style jsx>{`
                /* Mantén tus estilos originales, agregué estas clases semánticas */
                .sr-only {
                    position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
                    overflow: hidden; clip: rect(0,0,0,0); border: 0;
                }
                .explore-page { background: #040714; min-height: 100vh; color: #f5f5f7; }
                .explore-container { padding: 140px 5% 50px; max-width: 1400px; margin: 0 auto; }
                .filter-bar { display: flex; gap: 12px; margin-bottom: 30px; flex-wrap: wrap; justify-content: center; }
                .search-info { text-align: center; margin-bottom: 30px; font-size: 1.1rem; }
                .search-info button { 
                    margin-left: 15px; background: rgba(255,255,255,0.1); border: none; 
                    color: #0071e3; padding: 5px 12px; border-radius: 5px; cursor: pointer;
                }
                .tab-btn {
                    padding: 10px 22px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1);
                    background: rgba(255,255,255,0.05); color: white; cursor: pointer; 
                    transition: 0.3s; font-size: 0.9rem;
                }
                .tab-btn:hover { background: rgba(255,255,255,0.15); }
                .tab-btn.active { background: #0071e3; border-color: #0071e3; }
                .grid {
                    display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 20px;
                }
                .card {
                    position: relative; border-radius: 12px; overflow: hidden;
                    cursor: pointer; transition: 0.4s cubic-bezier(0.2, 0, 0.2, 1);
                    aspect-ratio: 2/3; background: #1a1a1a;
                }
                .card:hover { transform: scale(1.05); z-index: 2; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
                .card img { width: 100%; height: 100%; object-fit: cover; }
                .type-badge {
                    position: absolute; top: 10px; right: 10px;
                    background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(5px);
                    color: white; font-size: 0.65rem; font-weight: 800;
                    padding: 4px 8px; border-radius: 6px; text-transform: uppercase;
                    border: 1px solid rgba(255,255,255,0.2); z-index: 5;
                }
                .card-info {
                    position: absolute; bottom: 0; left: 0; width: 100%;
                    padding: 25px 10px 10px;
                    background: linear-gradient(to top, rgba(0,0,0,0.95), transparent);
                }
                .card-title { font-size: 0.8rem; font-weight: 500; text-align: center; margin: 0; }
                .loader, .end-msg { text-align: center; padding: 50px; color: #86868b; font-size: 0.9rem; }
                @media (max-width: 768px) {
                    .explore-container { padding-top: 170px; }
                    .grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 12px; }
                }
            `}</style>
            <Footer />
        </div>
    );
}