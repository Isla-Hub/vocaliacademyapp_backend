const canPerformAction = (roles) => {
  return (req, res, next) => {
    if (roles && roles.includes(req.role)) {
      next();
    } else {
      res.sendStatus(401);
    }
  };
};

export default canPerformAction;
