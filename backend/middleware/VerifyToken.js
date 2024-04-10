var jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
 
  let token = req.headers.authorization || req.headers.Authorization;
  if (!token)
    return res.status(403).send({ 'status': false, 'errorMessage': 'No token provided' });

  // Remove Bearer from string
  token = token.replace(/^Bearer\s+/, "");

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err)
      return res.status(401).send({ 'status': false, 'message': 'Failed to authenticate token' });

    if (req.originalUrl == '/dashboard/totalCount' && req.method == 'GET') {
      if (decoded.permissions.dashboard.list == false) {
        return res.status(401).send({ 'status': false, 'message': 'User permission denied' });
      }
    }
    if (req.originalUrl == '/property/list' && req.method == 'POST') {
      if (decoded.permissions.facility.list == false) {
        return res.status(401).send({ 'status': false, 'message': 'User permission denied' });
      }
    }

    if (req.originalUrl == '/property/' && req.method == 'POST') {
      if (decoded.permissions.facility.create == false) {
        return res.status(401).send({ 'status': false, 'message': 'User permission denied' });
      }
    }
    
    
      if (req.method == 'PATCH' && req.originalUrl) {
        const url = req.originalUrl;
        const value = url.split('/').pop(); 
        if (req.originalUrl === `/property/history/${value}`) {
          const permissions = decoded.permissions.facility;
          if (!permissions.list) {
            return res.status(401).send({ 'status': false, 'message': 'User permission denied' });
          } 
        }
     if (req.originalUrl === `/property/${value}`) {
          const permissions = decoded.permissions.facility;
          if (!permissions.update) {
            return res.status(401).send({ 'status': false, 'message': 'User permission denied' });
          } 
        }
      }
      
    if (req.originalUrl && req.method == 'DELETE') {
      if (decoded.permissions.facility.delete == false) {
        return res.status(401).send({ 'status': false, 'message': 'User permission denied' });
      }
    }

    req.userId = decoded.id;
    req.email = decoded.email;
    req.username = decoded.name;
    req.permissions = decoded.permissions

    next();
  })
}


module.exports = verifyToken;