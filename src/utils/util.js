exports.emailRegexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

// Pagination

exports.getPagination = (givenPage, givenLimit) => {
  const page = parseInt(givenPage, 10) || 1;
  const limit = parseInt(givenLimit, 10) || 100;
  const start_index = (page - 1) * limit;
  const end_index = page * limit;
  return {
    page,
    limit,
    start_index,
    end_index
  };
};

// Querying

const excluded_fields = ['select', 'sort', 'page', 'limit'];

const regexp = /\b(gt|gte|lt|lte|in)\b/g;

function formatQuery(query) {
  Object.keys(query).forEach((objKey) => {
    const assumedAsObject = query[objKey];
    if (typeof assumedAsObject === 'object') {
      Object.keys(assumedAsObject).forEach((key) => {
        const isMatch = regexp.test(key);
        if (isMatch) {
          const replacedValue = assumedAsObject[key];
          delete assumedAsObject[key];
          assumedAsObject[`$${key}`] = replacedValue;
        }
      });
    }
  });
  return query;
}

exports.build_query = (query) => {
  const result = { ...query };
  excluded_fields.forEach((field) => delete result[field]);
  return formatQuery(result);
};
