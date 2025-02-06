const Hapi = require('@hapi/hapi');
const {
    addBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
    clearBooks,
} = require('../src/handlers/books.handler');

/* global describe, beforeEach, afterEach, it, expect */

/**
 * Test Suite untuk Books API
 * Menguji seluruh endpoint dan fungsionalitas API
 */
describe('Books API Tests', () => {
    let server;

    /**
     * Setup untuk setiap test case
     * Membersihkan data dan menginisialisasi server
     */
    beforeEach(async () => {
        // Membersihkan array buku sebelum setiap test
        clearBooks();

        // Inisialisasi server Hapi untuk testing
        server = Hapi.server({
            port: 9000,
            host: 'localhost',
        });

        // Mendefinisikan route untuk testing
        server.route([
            {
                method: 'POST',
                path: '/books',
                handler: addBook,
            },
            {
                method: 'GET',
                path: '/books',
                handler: getAllBooks,
            },
            {
                method: 'GET',
                path: '/books/{bookId}',
                handler: getBookById,
            },
            {
                method: 'PUT',
                path: '/books/{bookId}',
                handler: updateBook,
            },
            {
                method: 'DELETE',
                path: '/books/{bookId}',
                handler: deleteBook,
            },
        ]);

        await server.initialize();
    });

    /**
     * Cleanup setelah setiap test case
     */
    afterEach(async () => {
        await server.stop();
    });

    /**
     * Test Suite untuk endpoint POST /books
     * Menguji penambahan buku baru
     */
    describe('POST /books', () => {
        /**
         * Test case: Menambah buku dengan data lengkap
         */
        it('should add a new book successfully', async () => {
            const payload = {
                name: 'Test Book',
                year: 2023,
                author: 'Test Author',
                summary: 'Test Summary',
                publisher: 'Test Publisher',
                pageCount: 100,
                readPage: 50,
                reading: false,
            };

            const response = await server.inject({
                method: 'POST',
                url: '/books',
                payload,
            });

            expect(response.statusCode).toBe(201);
            expect(JSON.parse(response.payload)).toHaveProperty('status', 'success');
        });

        /**
         * Test case: Menambah buku tanpa nama
         * Memastikan API menolak buku tanpa nama
         */
        it('should fail when name is not provided', async () => {
            const payload = {
                year: 2023,
                author: 'Test Author',
                summary: 'Test Summary',
                publisher: 'Test Publisher',
                pageCount: 100,
                readPage: 50,
                reading: false,
            };

            const response = await server.inject({
                method: 'POST',
                url: '/books',
                payload,
            });

            expect(response.statusCode).toBe(400);
            expect(JSON.parse(response.payload)).toHaveProperty('status', 'fail');
        });
    });

    /**
     * Test Suite untuk endpoint GET /books
     * Menguji pengambilan daftar buku
     */
    describe('GET /books', () => {
        /**
         * Test case: Mengambil daftar buku saat tidak ada buku
         */
        it('should return empty books array when no books exist', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/books',
            });

            expect(response.statusCode).toBe(200);
            const responseJson = JSON.parse(response.payload);
            expect(responseJson.data.books).toEqual([]);
        });
    });
});
