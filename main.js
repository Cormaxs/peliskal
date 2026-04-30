let moviesDB = [];

async function loadDatabase() {
    try {
        const res = await fetch('db_completa_imdb.jsonl');
        const text = await res.text();
        moviesDB = text.split('\n').filter(l => l.trim()).map(l => JSON.parse(l));
        setupSearch();
    } catch (e) { console.error("Error cargando DB", e); }
}

function setupSearch() {
    const searchInput = document.getElementById('search');
    const preview = document.getElementById('search-preview');

    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        if (term.length < 2) { preview.style.display = 'none'; return; }
        
        const res = moviesDB.filter(m => m.title.toLowerCase().includes(term)).slice(0, 6);
        preview.style.display = 'block';
        preview.innerHTML = res.map(m => `
            <div style="display:flex; align-items:center; gap:15px; padding:12px; cursor:pointer; border-bottom:1px solid rgba(255,255,255,0.05);" onclick="verDetalle('${m.id_tmdb}')">
                <img src="https://image.tmdb.org/t/p/w92${m.poster}" width="40" style="border-radius:4px">
                <div>
                    <div style="font-weight:bold; font-size:0.9rem;">${m.title}</div>
                    <div style="font-size:0.75rem; color:#a1a1a6;">${m.release_year}</div>
                </div>
            </div>
        `).join('');
    });
}

function verDetalle(id) {
    const m = moviesDB.find(x => x.id_tmdb == id);
    localStorage.setItem('currentMovie', JSON.stringify(m));
    window.location.href = 'detalle.html';
}

// Control del Scroll para el Nav
window.onscroll = () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
};