/* js/manga.js */
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const mangaId = urlParams.get('id');

    // Jika tidak ada ID manga di URL, artinya user sedang di home, abaikan script detail ini
    if (!mangaId) {
        return;
    }

    const loadingState = document.getElementById('loading-state');
    const detailContainer = document.getElementById('manga-detail');

    const mangaData = await MangaDexAPI.getMangaDetail(mangaId);
    const chapterData = await MangaDexAPI.getMangaChapters(mangaId);

    if (mangaData && mangaData.data) {
        const manga = mangaData.data;
        const title = manga.attributes.title.en || Object.values(manga.attributes.title)[0];
        const description = manga.attributes.description.en || 'Tidak ada sinopsis dalam bahasa Inggris.';
        const coverUrl = MangaDexAPI.getCoverUrl(manga.id, manga.relationships);

        // Pasang data teks ke elemen HTML detail
        if (document.getElementById('manga-title')) {
            document.getElementById('manga-title').innerText = title;
        }
        if (document.getElementById('manga-description')) {
            document.getElementById('manga-description').innerText = description;
        }
        if (document.getElementById('manga-status')) {
            document.getElementById('manga-status').innerText = (manga.attributes.status || 'Unknown').toUpperCase();
        }
        if (document.getElementById('manga-year')) {
            document.getElementById('manga-year').innerText = manga.attributes.year || '-';
        }
        if (document.getElementById('manga-cover')) {
            document.getElementById('manga-cover').src = coverUrl;
        }

        const chapterContainer = document.getElementById('chapter-container');
        if (chapterContainer) {
            chapterContainer.innerHTML = '';

            if (chapterData && chapterData.data && chapterData.data.length > 0) {
                chapterData.data.forEach(ch => {
                    // Filter link eksternal agar tidak merusak halaman baca kita
                    if (ch.attributes.externalUrl) return; 

                    const chTitle = ch.attributes.title ? ` - ${ch.attributes.title}` : '';
                    const chName = `Chapter ${ch.attributes.chapter || '0'}${chTitle}`;
                    
                    const item = document.createElement('a');
                    item.className = 'chapter-item';
                    item.href = `chapter.html?id=${ch.id}`; 
                    item.innerHTML = `
                        <span>${chName}</span>
                        <small style="color: #4ade80; font-weight: bold;">READ NOW</small>
                    `;
                    chapterContainer.appendChild(item);
                });

                if (chapterContainer.children.length === 0) {
                    chapterContainer.innerHTML = '<div class="chapter-item">Chapter di server ini dialihkan ke Link Eksternal Resmi.</div>';
                }
            } else {
                chapterContainer.innerHTML = '<div class="chapter-item">Belum ada chapter bahasa Inggris di server ini.</div>';
            }
        }

        // Sembunyikan loading spinner detail jika elemennya ada
        if (loadingState) loadingState.classList.add('hidden');
        if (detailContainer) detailContainer.classList.remove('hidden');
    }
});