// authorizeOwnerOrAdmin expects req.user and a fetched resource on req.resource
function authorizeOwnerOrAdmin(getOwnerId) {
  return function (req, res, next) {
    try {
      const ownerId = getOwnerId(req);
      if (!ownerId) {
        return res
          .status(404)
          .json({ success: false, message: 'Resource not found' });
      }
      const isOwner = ownerId.toString() === req.user.id;
      const isAdmin = req.user.role === 'admin';
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
      next();
    } catch (e) {
      next(e);
    }
  };
}

module.exports = { authorizeOwnerOrAdmin };
