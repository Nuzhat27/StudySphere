// RBAC guard: pass the roles allowed to access a route.
// Usage: router.post('/courses', protect, authorize('educator', 'admin'), createCourse)
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied: requires role(s) ${allowedRoles.join(', ')}`,
      });
    }
    next();
  };
};

module.exports = { authorize };
