/* js/app.js */
const popularContainer = document.getElementById('popular-container');
const trendingContainer = document.getElementById('trending-container');
const infiniteLoading = document.getElementById('infinite-loading');
const backToTopBtn = document.getElementById('back-to-top');
const navbar = document.getElementById('navbar');

let currentOffset = 0;
const limit = 12;
let isLoading = false;

// Fungsi Render Kartu Manga ke Grid Beranda
function renderMangaCards(mangaList, container, clear = false) {
    if (clear) container.innerHTML = '';

    mangaList.forEach(manga => {
        // Mengambil judul
        const title = manga.attributes.title.en || manga.attributes.title['ja-ro'] || Object.values(manga.attributes.title)[0];
        
        // Memanggil fungsi khusus dari api.js untuk mendapatkan gambar cover
        const coverUrl = MangaDexAPI.getCoverUrl(manga.id, manga.relationships);
        const type = manga.attributes.status || 'Ongoing';

        const card = document.createElement('div');
        card.className = 'manga-card';
        card.innerHTML = `
            <div class="manga-card-img">
                <img src="${coverUrl}" alt="${title}" loading="lazy">
            </div>
            <div class="manga-card-info">
                <h3>${title}</h3>
                <p>${type.toUpperCase()}</p>
            </div>
        `;
        
        // Mengarahkan klik kartu ke halaman manga.html bawaan kita
        card.addEventListener('click', () => {
            window.location.href = `manga.html?id=${manga.id}`;
        });
        container.appendChild(card);
    });
}

// Load Data Manga Awal saat Beranda Dibuka
async function initHome() {
    isLoading = true;
    const data = await MangaDexAPI.getPopularManga(limit, currentOffset);
    
    if (data && data.data) {
        // Bersihkan kotak abu-abu skeleton loading awal
        if (trendingContainer) trendingContainer.innerHTML = '';
        if (popularContainer) popularContainer.innerHTML = '';
        
        // Bagi data untuk slider tren dan grid populer
        if (trendingContainer) renderMangaCards(data.data.slice(0, 4), trendingContainer);
        if (popularContainer) renderMangaCards(data.data, popularContainer);
        currentOffset += limit;
    }
    isLoading = false;
}

// Infinite Scroll Load Lebih Banyak Konten saat di-scroll ke bawah
async function loadMoreManga() {
    if (isLoading || !popularContainer) return;
    isLoading = true;
    if (infiniteLoading) infiniteLoading.classList.remove('hidden');

    const data = await MangaDexAPI.getPopularManga(limit, currentOffset);
    if (data && data.data && data.data.length > 0) {
        renderMangaCards(data.data, popularContainer);
        currentOffset += limit;
    }

    if (infiniteLoading) infiniteLoading.classList.add('hidden');
    isLoading = false;
}

// Deteksi Event Scroll Layar HP
window.addEventListener('scroll', () => {
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    if (backToTopBtn) {
        if (window.scrollY > 500) {
            backToTopBtn.classList.remove('hidden');
        } else {
            backToTopBtn.classList.add('hidden');
        }
    }

    if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 300) {
        loadMoreManga();
    }
});

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Jalankan fungsi inisialisasi beranda
document.addEventListener('DOMContentLoaded', initHome);