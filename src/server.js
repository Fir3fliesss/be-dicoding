/* global process */
// Import framework Hapi untuk membuat server HTTP
const Hapi = require('@hapi/hapi');

// Import fungsi-fungsi handler dari modul books handler
const {
    addBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
} = require('./handlers/books.handler');

// Import skema validasi
const {
    bookPayloadSchema,
    bookQuerySchema,
    bookIdSchema
} = require('./validations/book.validation');

// Import penanganan error
const errorHandler = require('./utils/error.handler');

/**
 * Fungsi inisialisasi server
 * Mengatur konfigurasi server dan mendefinisikan route
 */
const init = async () => {
    // Membuat instance server Hapi baru dengan konfigurasi
    const server = Hapi.server({
        port: 9000,  // Port yang digunakan sesuai ketentuan
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'], // Mengaktifkan CORS untuk semua origin
            },
            validate: {
                failAction: (request, h, err) => {
                    throw err;
                },
            },
        },
    });

    // Menambahkan penanganan error global
    server.ext('onPreResponse', errorHandler);

    // Mendefinisikan rute-rute API
    server.route([
        {
            method: 'GET',
            path: '/',
            handler: () => 'Bookshelf API', // Handler untuk halaman utama
        },
        {
            method: 'POST',
            path: '/books',
            options: {
                validate: {
                    payload: bookPayloadSchema,
                },
            },
            handler: addBook, // Handler untuk menambah buku
        },
        {
            method: 'GET',
            path: '/books',
            options: {
                validate: {
                    query: bookQuerySchema,
                },
            },
            handler: getAllBooks, // Handler untuk mendapatkan semua buku
        },
        {
            method: 'GET',
            path: '/books/{bookId}',
            options: {
                validate: {
                    params: bookIdSchema,
                },
            },
            handler: getBookById, // Handler untuk mendapatkan buku spesifik
        },
        {
            method: 'PUT',
            path: '/books/{bookId}',
            options: {
                validate: {
                    params: bookIdSchema,
                    payload: bookPayloadSchema,
                },
            },
            handler: updateBook, // Handler untuk memperbarui buku
        },
        {
            method: 'DELETE',
            path: '/books/{bookId}',
            options: {
                validate: {
                    params: bookIdSchema,
                },
            },
            handler: deleteBook, // Handler untuk menghapus buku
        },
    ]);

    // Menjalankan server
    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

// Menangani promise rejection yang tidak tertangani
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

// Memulai aplikasi
init();
