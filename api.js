// js/api.js

const BASE_URL = 'https://api.mangadex.org';
const COVER_URL = 'https://uploads.mangadex.org';

const MangaDexAPI = {
    // 1. Ambil daftar manga populer/trending
    async getPopularManga(limit = 10, offset = 0) {
        try {
            const response = await fetch(`${BASE_URL}/manga?limit=${limit}&offset=${offset}&includes[]=cover_art&includes[]=author&order[followedCount]=desc&contentRating[]=safe`);
            if (!response.ok) throw new Error('Gagal mengambil data dari API');
            return await response.json();
        } catch (error) {
            console.error('Error Fetch Popular:', error);
            return null;
        }
    },

    // 2. Pencarian Manga berdasarkan Judul
    async searchManga(title) {
        try {
            const response = await fetch(`${BASE_URL}/manga?title=${encodeURIComponent(title)}&limit=5&includes[]=cover_art&contentRating[]=safe`);
            if (!response.ok) throw new Error('Pencarian gagal');
            return await response.json();
        } catch (error) {
            console.error('Error Search:', error);
            return null;
        }
    },

    // 3. Ambil Detail Informasi Satu Manga berdasarkan ID
    async getMangaDetail(id) {
        try {
            const response = await fetch(`${BASE_URL}/manga/${id}?includes[]=cover_art&includes[]=author`);
            if (!response.ok) throw new Error('Gagal memuat detail manga');
            return await response.json();
        } catch (error) {
            console.error('Error Detail:', error);
            return null;
        }
    },

    // 4. Ambil Daftar Chapter Komik (Bahasa Inggris)
    async getMangaChapters(id) {
        try {
            const response = await fetch(`${BASE_URL}/manga/${id}/feed?translatedLanguage[]=en&limit=100&order[chapter]=desc&contentRating[]=safe`);
            if (!response.ok) throw new Error('Gagal memuat chapter');
            return await response.json();
        } catch (error) {
            console.error('Error Chapters:', error);
            return null;
        }
    },

    // 5. Ambil Halaman Gambar dari Satu Chapter berdasarkan ID (Sudah Diperbaiki)
    async getChapterPages(chapterId) {
        try {
            const response = await fetch(`${BASE_URL}/at-home/server/${chapterId}`);
            if (!response.ok) throw new Error('Gagal mengambil server gambar');
            return await response.json();
        } catch (error) {
            console.error('Error Chapter Pages:', error);
            return null;
        }
    },

    // Helper untuk membuat URL Cover Image yang valid dari MangaDex
    getCoverUrl(mangaId, relationships) {
        const coverObj = relationships.find(rel => rel.type === 'cover_art');
        if (coverObj && coverObj.attributes) {
            const fileName = coverObj.attributes.fileName;
            return `${COVER_URL}/covers/${mangaId}/${fileName}.256.jpg`;
        }
        return 'https://via.placeholder.com/256x360?text=No+Cover';
    }
};