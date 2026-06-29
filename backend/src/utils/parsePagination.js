const parsePagination = (query) => {
    const maxLimit = 100;

    let page = parseInt(query.page, 10);
    let limit = parseInt(query.limit, 10);

    if (Number.isNaN(page) || page < 1) {
        page = 1;
    }

    if (Number.isNaN(limit) || limit < 1) {
        limit = 20;
    }

    if (limit > maxLimit) {
        limit = maxLimit;
    }

    const skip = (page - 1) * limit;

    return { page, limit, skip };
};

export default parsePagination;
