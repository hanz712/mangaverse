/* js/chapter.js */
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const chapterId = urlParams.get('id');

    if (!chapterId) {
        window.location.href = 'index.html';
        return;
    }

    const imageContainer = document.getElementById('image-container');
    const loadingReader = document.getElementById('loading-reader');
    const chapterTitleText = document.getElementById('chapter-title');

    // Menggunakan let karena data berpotensi dimuat ulang
    let pageData = await MangaDexAPI.getChapterPages(chapterId);

    // Mekanisme Percobaan Ulang (Retry) jika data server utama null/kosong
    if (!pageData || !pageData.chapter || (pageData.chapter.data.length === 0 && pageData.chapter.dataSaver.length === 0)) {
        console.log("Mencoba memuat ulang data server cadangan...");
        // Delay sebentar selama 1 detik sebelum request ulang
        await new Promise(resolve => setTimeout(resolve, 1000));
        pageData = await MangaDexAPI.getChapterPages(chapterId);
    }

    if (pageData && pageData.chapter) {
        const hash = pageData.chapter.hash;
        
        // Cek ketersediaan array gambar
        const hasMainData = pageData.chapter.data && pageData.chapter.data.length > 0;
        const hasSaverData = pageData.chapter.dataSaver && pageData.chapter.dataSaver.length > 0;
        
        // Prioritas: data utama -> dataSaver
        const dataImages = hasMainData ? pageData.chapter.data : (hasSaverData ? pageData.chapter.dataSaver : []);
        const baseUrl = pageData.baseUrl;
        const folderType = hasMainData ? 'data' : 'data-saver';

        if (dataImages.length === 0) {
            alert('Chapter ini berstatus External Link atau gambar belum ter-cache di server MangaDex. Silakan coba buka nomor chapter lain, Han!');
            loadingReader.classList.add('hidden');
            return;
        }

        chapterTitleText.innerText = `Mode Membaca (${dataImages.length} Halaman)`;
        imageContainer.innerHTML = '';

        // Render gambar secara vertikal
        dataImages.forEach(imgFileName => {
            const imgUrl = `${baseUrl}/${folderType}/${hash}/${imgFileName}`;
            const imgElement = document.createElement('img');
            
            imgElement.className = 'reader-image';
            imgElement.src = imgUrl;
            imgElement.loading = 'lazy'; 
            imgElement.alt = 'Halaman Komik';
            
            imgElement.onerror = function() {
                this.src = 'https://via.placeholder.com/500x700?text=Gagal+Memuat+Halaman';
            };
            
            imageContainer.appendChild(imgElement);
        });

        loadingReader.classList.add('hidden');
        imageContainer.classList.remove('hidden');
    } else {
        alert('Gagal terhubung dengan server MangaDex. Coba chapter lainnya.');
        loadingReader.classList.add('hidden');
    }
});