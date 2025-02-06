const Joi = require('@hapi/joi');

/**
 * Skema validasi untuk payload buku
 * Memvalidasi data buku yang dikirim oleh client
 */
const bookPayloadSchema = Joi.object({
    name: Joi.string().required()
        .messages({
            'any.required': 'Gagal menambahkan buku. Mohon isi nama buku',
            'string.empty': 'Gagal menambahkan buku. Mohon isi nama buku'
        }),
    year: Joi.number().integer().min(1900).max(2100).required(),
    author: Joi.string().required(),
    summary: Joi.string().required(),
    publisher: Joi.string().required(),
    pageCount: Joi.number().integer().min(1).required(),
    readPage: Joi.number().integer().min(0).max(Joi.ref('pageCount')).required()
        .messages({
            'number.max': 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        }),
    reading: Joi.boolean().required(),
});

/**
 * Skema validasi untuk query parameter
 * Memvalidasi parameter pencarian dan filter
 */
const bookQuerySchema = Joi.object({
    name: Joi.string(),
    reading: Joi.valid('0', '1'),
    finished: Joi.valid('0', '1'),
});

/**
 * Skema validasi untuk parameter ID buku
 * Memvalidasi ID buku yang dikirim melalui parameter URL
 */
const bookIdSchema = Joi.object({
    bookId: Joi.string().required(),
});

module.exports = {
    bookPayloadSchema,
    bookQuerySchema,
    bookIdSchema,
};
