import axios from 'axios';

const UrlBase = "https://api.dunddermifflin.com/peliskal"; // Puerto 3001 según tu config de backend

/**
 * Obtiene películas/series usando el buscador avanzado.
 * Soporta búsqueda por texto, filtros y paginación.
 */
export const fetchContent = async ({ 
    query = '', 
    page = 1, 
    limit = 12, 
    type = '',      // 'movie' o 'tv'
    genres = '',    // IDs de géneros separados por coma
    minRating = '',
    year = ''
}) => {
    try {
        // Usamos URLSearchParams para construir la query string de forma limpia
        const params = new URLSearchParams();
        
        if (query) params.append('query', query);
        if (type) params.append('type', type);
        if (genres) params.append('genres', genres);
        if (minRating) params.append('minRating', minRating);
        if (year) params.append('year', year);
        
        params.append('page', page);
        params.append('limit', limit);

        // Todo pasa por el endpoint /search que creamos
        const url = `${UrlBase}/search?${params.toString()}`;
        
        const response = await axios.get(url);
        
        // Retorna { movies: [...], pagination: {...} }
        return response.data; 
    } catch (error) {
        console.error("Error al obtener contenido de Peliskal:", error);
        throw new Error('No se pudo conectar con el servidor de Peliskal.');
    }
}

/**
 * Obtiene el detalle de una película o serie por su ID (TMDB ID).
 */
export const fetchContentById = async (id) => {
    try {
        const response = await axios.get(`${UrlBase}/${id}`); 
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return null; 
        }
        console.error(`Error al buscar contenido por ID ${id}:`, error);
        throw new Error(`Error de conexión al obtener los detalles.`);
    }
}

/**
 * Si decides implementar la descarga vía Telegram para las pelis más adelante
 */
export const getTelegramLink = async ({ fileId, chatId }) => {
    try {
        const response = await axios.post(`${UrlBase}/telegram/link`, {
            fileId,
            chatId,
        });
        return response.data;
    } catch (error) {
        console.error('Error en enlace Telegram:', error);
        return null;
    }
};