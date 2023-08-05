const canPerformAction = (roles) => {
  return (req, res, next) => {
    if (roles && roles.includes(req.role)) {
      next();
    } else {
      res.status(401).json({ message: error.message });
    }
  };
};

export default canPerformAction;
