/**
 * Middleware untuk menangani error secara global
 * @param {Object} request - Object request Hapi
 * @param {Object} h - Response toolkit Hapi
 * @returns {Object} Response error yang telah diformat
 */
const errorHandler = (request, h) => {
    const response = request.response;

    if (!response.isBoom) {
        return h.continue;
    }

    if (response.output.statusCode === 400) {
        const validation = response.details?.[0];
        const isUpdateOperation = request.method === 'put';

        // Handle name validation
        if (validation?.context?.key === 'name') {
            const message = isUpdateOperation
                ? 'Gagal memperbarui buku. Mohon isi nama buku'
                : 'Gagal menambahkan buku. Mohon isi nama buku';
            return h.response({
                status: 'fail',
                message,
            }).code(400);
        }

        // Handle readPage validation
        if (validation?.context?.key === 'readPage') {
            const message = isUpdateOperation
                ? 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
                : 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount';
            return h.response({
                status: 'fail',
                message,
            }).code(400);
        }
    }

    const statusCode = response.output.statusCode;
    return h.response({
        status: 'fail',
        message: response.message.replace(/['"]/g, ''),
    }).code(statusCode);
};

module.exports = errorHandler;
