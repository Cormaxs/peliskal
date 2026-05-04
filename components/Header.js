import Link from 'next/link';
import Image from 'next/image'; // Importación añadida
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { fetchContent } from '../lib/api';
import { useContent } from '../context/ContentContext';

const createSlug = (item) => `${item.title?.toLowerCase().replace(/\s+/g, '-')}-${item.id_tmdb}`;

export default function Header() {
    const [searchTerm, setSearchTerm] = useState('');
    const [previewResults, setPreviewResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    
    const { setActiveItem } = useContent();
    const router = useRouter();
    const searchRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.trim().length >= 2) {
                setIsLoading(true);
                try {
                    const data = await fetchContent({ query: searchTerm, limit: 6 });
                    setPreviewResults(data.movies || []);
                } catch (error) {
                    console.error("Error buscando:", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setPreviewResults([]);
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setPreviewResults([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (movie) => {
        setActiveItem(movie);
        setSearchTerm('');
        setPreviewResults([]);
        router.push(`/seeContent/${createSlug(movie)}`);
    };

    const handleViewAll = () => {
        const query = searchTerm;
        setSearchTerm('');
        setPreviewResults([]);
        router.push(`/explorar?search=${encodeURIComponent(query)}`);
    };

    return (
        <nav className={scrolled ? 'scrolled' : ''}>
            <div className="nav-container">
                <Link href="/" className="logo-container">
                    {/* Corrección: Uso de next/image para el logo */}
                    <div className="logo-img-wrapper">
                        <Image 
                            src="/peliskal-logo.webp" 
                            alt="PELISKAL" 
                            width={120} 
                            height={35} 
                            priority 
                            className="nav-logo-img"
                        />
                    </div>
                </Link>

                <div className="search-wrapper" ref={searchRef}>
                    <div className="input-container">
                        <input 
                            type="text" 
                            placeholder="Buscar..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoComplete="off"
                        />
                        {isLoading && <div className="spinner"></div>}
                    </div>

                    {previewResults.length > 0 && (
                        <div className="search-preview">
                            {previewResults.map((movie) => (
                                <div key={movie._id} className="preview-item" onClick={() => handleSelect(movie)}>
                                    {/* Corrección: Uso de next/image para posters de previsualización */}
                                    <div className="poster-preview-wrapper">
                                        <Image 
                                            src={`https://image.tmdb.org/t/p/w92${movie.poster}`} 
                                            alt={movie.title} 
                                            width={35} 
                                            height={50}
                                            className="p-img"
                                        />
                                    </div>
                                    <div className="preview-info">
                                        <div className="p-title">{movie.title}</div>
                                        <div className="p-meta">{movie.release_year} • <span>{movie.type === 'tv' ? 'SERIE' : 'PELI'}</span></div>
                                    </div>
                                </div>
                            ))}
                            <div className="view-all-results" onClick={handleViewAll}>
                                {/* Corrección: Caracteres especiales escapados */}
                                Ver todos para &quot;{searchTerm}&quot;
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="nav-menu">
                    <Link href="/explorar" className="nav-link">Explorar</Link>
                </div>
            </div>

            <style jsx>{`
                nav { 
                    position: fixed; top: 0; left: 0; width: 100%; 
                    z-index: 2000; transition: 0.3s;
                    background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
                    box-sizing: border-box;
                }
                nav.scrolled { 
                    background: rgba(15, 15, 15, 0.95);
                    backdrop-filter: blur(15px);
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }

                .nav-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 20px;
                    gap: 15px;
                    box-sizing: border-box;
                }

                .logo-container { 
                    display: flex;
                    align-items: center;
                    text-decoration: none; 
                    flex-shrink: 0;
                }
                
                .logo-img-wrapper {
                    height: 35px;
                    display: flex;
                    align-items: center;
                    transition: transform 0.3s ease;
                }
                
                .logo-img-wrapper:hover {
                    transform: scale(1.05);
                }

                :global(.nav-logo-img) {
                    height: 35px !important;
                    width: auto !important;
                }

                .search-wrapper { 
                    flex: 1; 
                    max-width: 600px; 
                    position: relative; 
                    margin: 0 10px;
                }
                
                .input-container { position: relative; width: 100%; }
                
                input { 
                    width: 100%; padding: 10px 15px; border-radius: 20px; 
                    border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.1); 
                    color: white; outline: none; font-size: 0.9rem;
                    box-sizing: border-box;
                }
                input:focus { border-color: #0071e3; background: rgba(255,255,255,0.2); }

                .spinner { 
                    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
                    width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.2); 
                    border-top-color: #0071e3; border-radius: 50%; animation: spin 0.8s linear infinite; 
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                .search-preview { 
                    position: absolute; top: calc(100% + 10px); left: 0; width: 100%; 
                    background: #1c1c1e; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); 
                    overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.6);
                }
                .preview-item { display: flex; align-items: center; gap: 12px; padding: 10px; cursor: pointer; }
                .preview-item:hover { background: rgba(255,255,255,0.05); }
                
                .poster-preview-wrapper {
                    flex-shrink: 0;
                    width: 35px;
                    height: 50px;
                    position: relative;
                }
                :global(.p-img) {
                    object-fit: cover;
                    border-radius: 4px;
                }

                .p-title { font-size: 0.85rem; font-weight: 500; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .p-meta { font-size: 0.7rem; color: #86868b; }
                .view-all-results { padding: 12px; text-align: center; background: rgba(0, 113, 227, 0.1); color: #0071e3; font-size: 0.8rem; font-weight: 600; cursor: pointer; }

                .nav-menu { flex-shrink: 0; }
                .nav-link { color: white; text-decoration: none; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; }

                @media (max-width: 600px) {
                    .nav-container { padding: 10px 15px; gap: 10px; }
                    .logo-img-wrapper { height: 28px; }
                    :global(.nav-logo-img) { height: 28px !important; }
                    .nav-link { font-size: 0.7rem; }
                    .search-wrapper { margin: 0 5px; }
                    input { padding: 8px 12px; font-size: 0.8rem; }
                }
            `}</style>
        </nav>
    );
}