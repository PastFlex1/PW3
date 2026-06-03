export const isAuthenticated = (req, res, next) => {
  if (req.session.user) return next();
  
  if (req.originalUrl.startsWith("/api/")) {
    return res.status(401).json({ error: "No autorizado. Por favor inicia sesión." });
  }
  
  res.redirect("/login");
};

export const isNotAuthenticated = (req, res, next) => {
  if (!req.session.user) return next();
  res.redirect("/productos");
};