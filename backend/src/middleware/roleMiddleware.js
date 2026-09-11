const { failure } = require('../utils/response');

const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return failure(res, 'You do not have permission to perform this action', 403);
  }
  next();
};

module.exports = { authorize };