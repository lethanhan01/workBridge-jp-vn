const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Quyền truy cập bị từ chối. Yêu cầu quyền Quản trị viên.' });
  }
};

module.exports = adminMiddleware;
