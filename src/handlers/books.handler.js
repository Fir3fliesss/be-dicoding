// Import nanoid untuk menghasilkan ID unik
const { nanoid } = require('nanoid');

// Penyimpanan buku menggunakan array (in-memory storage)
const books = [];

// Add this function for testing purposes
const clearBooks = () => {
    books.length = 0;
};

/**
 * Handler untuk menambahkan buku baru
 * @param {Object} request - Object request Hapi
 * @param {Object} h - Response toolkit Hapi
 * @returns {Object} Object response dengan status dan pesan
 */
const addBook = (request, h) => {
    // Ekstrak data dari payload request
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    // Validasi field readPage
    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        }).code(400);
    }

    // Validasi field nama
    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        }).code(400);
    }

    // Membuat metadata buku
    const id = nanoid();
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    // Membuat object buku baru
    const newBook = {
        id, name, year, author, summary, publisher,
        pageCount, readPage, finished, reading,
        insertedAt, updatedAt,
    };

    books.push(newBook);

    return h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: id,
        },
    }).code(201);
};

/**
 * Handler untuk mendapatkan semua buku
 * @param {Object} request - Object request Hapi
 * @returns {Object} Object response dengan array buku
 */
const getAllBooks = (request) => {
    const { name, reading, finished } = request.query;
    let filteredBooks = [...books];

    // Filter berdasarkan nama (non-case sensitive)
    if (name) {
        filteredBooks = filteredBooks.filter((book) =>
            book.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    // Filter berdasarkan status reading
    if (reading !== undefined) {
        const isReading = reading === '1';
        filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
    }

    // Filter berdasarkan status finished
    if (finished !== undefined) {
        const isFinished = finished === '1';
        filteredBooks = filteredBooks.filter((book) => book.finished === isFinished);
    }

    return {
        status: 'success',
        data: {
            books: filteredBooks.map(({ id, name: bookName, publisher }) => ({
                id,
                name: bookName,
                publisher,
            })),
        },
    };
};

/**
 * Handler untuk mendapatkan buku berdasarkan ID
 * @param {Object} request - Object request Hapi
 * @param {Object} h - Response toolkit Hapi
 * @returns {Object} Object response dengan data buku atau error
 */
const getBookById = (request, h) => {
    const { bookId } = request.params;

    // Mencari buku dengan ID yang sesuai
    const book = books.find((b) => b.id === bookId);

    // Jika buku tidak ditemukan
    if (!book) {
        return h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        }).code(404);
    }

    // Jika buku ditemukan
    return h.response({
        status: 'success',
        data: {
            book,
        },
    }).code(200);  // Explicitly set status code to 200
};

/**
 * Handler untuk memperbarui buku berdasarkan ID
 * @param {Object} request - Object request Hapi
 * @param {Object} h - Response toolkit Hapi
 * @returns {Object} Object response dengan status dan pesan
 */
const updateBook = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    // Validasi field nama
    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        }).code(400);
    }

    // Validasi readPage
    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }

    const index = books.findIndex((book) => book.id === bookId);

    // Validasi keberadaan buku
    if (index === -1) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        }).code(404);
    }

    // Memperbarui metadata buku
    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage;

    // Memperbarui buku dengan data baru
    books[index] = {
        ...books[index],
        name, year, author, summary, publisher,
        pageCount, readPage, reading, finished,
        updatedAt,
    };

    return {
        status: 'success',
        message: 'Buku berhasil diperbarui',
    };
};

/**
 * Handler untuk menghapus buku berdasarkan ID
 * @param {Object} request - Object request Hapi
 * @param {Object} h - Response toolkit Hapi
 * @returns {Object} Object response dengan status dan pesan
 */
const deleteBook = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((book) => book.id === bookId);

    if (index === -1) {
        return h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        }).code(404);
    }

    books.splice(index, 1);

    return {
        status: 'success',
        message: 'Buku berhasil dihapus',
    };
};

// Export semua handler
module.exports = {
    addBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
    clearBooks, // Export the clear function
};
