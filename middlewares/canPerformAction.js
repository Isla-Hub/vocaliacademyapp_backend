const canPerformAction = (roles) => {
  return (req, res, next) => {
    console.log("req.role", req.role);
    console.log("roles", roles);
    if (roles && roles.includes(req.role)) {
      next();
    } else {
      res.sendStatus(401);
    }
  };
};

export default canPerformAction;
