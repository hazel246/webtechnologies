function isLoggedIn(req, res, next) {
  if (req.session.userId) return next();
  req.flash("error", "Please log in to access that page.");
  res.redirect("/auth/login");
}
function isAdmin(req, res, next) {
  if (req.session.userId && req.session.userRole === "admin") return next();
  if (!req.session.userId) {
    req.flash("error", "Please log in.");
    return res.redirect("/auth/login");
  }
  res.status(403).render("access-denied", { currentUser: res.locals.currentUser });
}
module.exports = { isLoggedIn, isAdmin };
