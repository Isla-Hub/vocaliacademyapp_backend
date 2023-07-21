const canPerformAction = (roles) => {
  return (req, res, next) => {
    if ((roles && roles.includes(req.role)) || req.role === "admin") {
      next();
    } else {
      res.sendStatus(401);
    }
  };
};

export default canPerformAction;
