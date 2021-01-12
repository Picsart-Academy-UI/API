exports.emailRegexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
// Pagination

exports.getPagination = (givenPage, givenLimit, count, req, query) => {

  let queryRef = query;
  const page = parseInt(givenPage, 10) || 1;
  const limit = parseInt(givenLimit, 10) || 100;
  const start_index = (page - 1) * limit;
  const end_index = page * limit;
  const pagination = {};

  if (end_index < count) {
    pagination.next_page = page + 1;
  }
  if (start_index > 0) {
    pagination.prev_page = page - 1;
  }

  const {select, sort} = req.query;

  if (select) {
    const fields = select.split(',')
      .join(' ');
    queryRef = queryRef.select(fields);
  }

  // sorting
  if (sort) {
    const sort_by = sort.split(',')
      .join(' ');
    queryRef = queryRef.sort(sort_by);
  } else {
    queryRef = queryRef.sort('createdAt');
  }
  queryRef = queryRef.skip(start_index)
    .limit(limit);

  return {
    pagination,
    limit,
    start_index,
    query: queryRef
  };
};

// Querying

const excluded_fields = ['select', 'sort', 'page', 'limit', 'search_by'];

function checkMatching(property) {
  return (property === 'lt' || property === 'lte'
    || property === 'gt' || property === 'gte'
    || property === 'in' || false);
}

function formatQuery(query) {
  Object.keys(query)
    .forEach((objKey) => {
      const assumedAsObject = query[objKey];
      if (typeof assumedAsObject === 'object') {
        Object.keys(assumedAsObject)
          .forEach((key) => {
            if (checkMatching(key)) {
              const value = assumedAsObject[key];
              delete assumedAsObject[key];
              assumedAsObject[`$${key}`] = value;
            }
          });
      }
    });
  return query;
}

exports.buildQuery = (query) => {
  const result = {...query};
  excluded_fields.forEach((field) => delete result[field]);
  return formatQuery(result);
};

// excluding undefined fields

exports.excludeUndefinedFields = (obj) => {
  let toBeReturned = {};
  Object.keys(obj)
    .forEach((p) => {
      if (typeof obj[p] === 'undefined') {
        return;
      }
      toBeReturned = {
        ...toBeReturned,
        [p]: obj[p]
      };
    });
  return toBeReturned;
};
