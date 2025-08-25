function success(res, data = {}, message = undefined, status = 200) {
  return res
    .status(status)
    .json({ success: true, ...(message && { message }), data });
}

function created(res, data = {}, message = 'Created') {
  return success(res, data, message, 201);
}

function paginationMeta({ totalItems, currentPage, itemsPerPage }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}

function paginated(res, items, page, limit, total) {
  return success(res, {
    items,
    pagination: paginationMeta({
      totalItems: total,
      currentPage: page,
      itemsPerPage: limit,
    }),
  });
}

module.exports = { success, created, paginated, paginationMeta };
