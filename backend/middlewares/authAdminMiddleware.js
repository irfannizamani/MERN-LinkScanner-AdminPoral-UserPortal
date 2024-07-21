const jwt = require('jsonwebtoken');

const authAdminMiddleware = (req, res, next) => {
  try {
    const tokenAdminAuth = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(tokenAdminAuth, process.env.JWT_SECRET);
    req.tokenAdminAuth = tokenAdminAuth;
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate as an admin.' });
  }
};

module.exports = authAdminMiddleware;

