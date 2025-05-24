import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  req.user = null;
  res.locals.user = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      res.locals.user = decoded;
    } catch (err) {
    }
  } else {
  }
  next();
}

const checkIsAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'Admin') {
       return res.status(403).json({ message: 'Acceso denegado' });
    }
    next();
};


export const methods = {
    verifyToken,
    checkIsAdmin
}