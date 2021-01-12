const {User} = require('booking-db');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const mailer = require('./mailer');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

const excluded_fields = ['select', 'sort', 'page', 'limit'];

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

const excludeUndefinedFields = (obj) => {
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

exports.getUserProperties = (req) => {

  const userProperties = {
    email: req.body.email,
    is_admin: req.body.is_admin,
    team_id: req.body.team_id,
    position: req.body.position,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    birthdate: req.body.birthdate,
    phone: req.body.phone
  };
  return userProperties;
};

exports.createUser = async (userProperties) => {
  const createdUser = await User.create(userProperties);
  await mailer(userProperties.email);
  return createdUser;
};

exports.updateUser = async (userProperties, user_id) => {
  const updatedUser = await User.findOneAndUpdate({_id: user_id},
    excludeUndefinedFields(userProperties), {
      new: true,
      runValidators: true
    }).lean().exec();
  await mailer(updatedUser.email);
  return updatedUser;
};

exports.verifyIdToken = (idToken) => {
  return client.verifyIdToken({idToken, audience: process.env.GOOGLE_CLIENT_ID});
};

exports.findUserByEmailAndUpdate = async (email, photo_url) => {
  return User.findOneAndUpdate({email}, {
    profile_picture: photo_url,
    accepted: true
  }, {new: true}).lean().exec();
};

exports.getJwt = (user) => {
  return jwt.sign({
    _id: user._id,
    email: user.email,
    team_id: user.team_id,
    is_admin: user.is_admin
  }, process.env.JWT_SECRET, {expiresIn: '5h'});
};

exports.excludeUndefinedFields = excludeUndefinedFields;
