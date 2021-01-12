/**
 * Calculate offset from page and perPage/limit.
 *
 * @param {number} page
 * @param {number} perPage
 * @returns {number}
 */
const calculateOffsetFromPage = (page, perPage) => perPage * (page - 1) || 0;

/**
 * Calculate page from offset and perPage/limit
 *
 * @param {number} offset
 * @param {number} perPage
 * @returns {number}
 */
const calculatePageFromOffset = (offset, perPage) => offset / perPage + 1 || 1;

const paginationHelpers = {
  calculateOffsetFromPage,
  calculatePageFromOffset
};

export { paginationHelpers as default, paginationHelpers, calculateOffsetFromPage, calculatePageFromOffset };
