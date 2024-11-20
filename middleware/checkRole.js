function checkRole(requiredRole) {
  return (req, res, next) => {
    const rolesHierarchy = {
      user: 0,
      admin: 1,
      superAdmin: 2,
    };
    console.log(req.user.role)
    console.log(requiredRole);
    if (rolesHierarchy[req.user.role] < rolesHierarchy[requiredRole]) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
}

export default checkRole;
