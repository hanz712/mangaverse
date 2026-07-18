/* js/search.js */
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

let debounceTimer;

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    clearTimeout(debounceTimer);

    if (query.length < 3) {
        searchResults.classList.add('hidden');
        return;
    }

    debounceTimer = setTimeout(async () => {
        searchResults.innerHTML = '<div class="suggestion-item">Mencari...</div>';
        searchResults.classList.remove('hidden');

        const data = await MangaDexAPI.searchManga(query);
        if (data && data.data.length > 0) {
            searchResults.innerHTML = '';
            data.data.forEach(manga => {
                const title = manga.attributes.title.en || manga.attributes.title['ja-ro'] || Object.values(manga.attributes.title)[0];
                const cover = MangaDexAPI.getCoverUrl(manga.id, manga.relationships);

                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.innerHTML = `
                    <img src="${cover}" alt="${title}">
                    <div class="suggestion-info">
                        <h4>${title}</h4>
                    </div>
                `;
                item.addEventListener('click', () => {
                    window.location.href = `manga.html?id=${manga.id}`;
                });
                searchResults.appendChild(item);
            });
        } else {
            searchResults.innerHTML = '<div class="suggestion-item">Manga tidak ditemukan</div>';
        }
    }, 500); // Penundaan Debounce 500ms
});

// Menutup suggestion box jika klik di luar search box
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-box')) {
        searchResults.classList.add('hidden');
    }
});