module.exports = (query) => {
  const queryObj = { ...query };
  const excludedFields = ['limit', 'offset', 'sort'];

  excludedFields.forEach((el) => delete queryObj[el]);

  return queryObj;
};
