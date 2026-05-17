// Redirect to login if the user is not authenticated
function isLoggedIn(req, res, next) {
  if (req.session.userId) return next();
  req.flash("error", "Please log in to access that page.");
  res.redirect("/auth/login");
}

// Allow only admins; redirect everyone else with an access-denied message
function isAdmin(req, res, next) {
  if (req.session.userId && req.session.userRole === "admin") return next();
  if (!req.session.userId) {
    req.flash("error", "Please log in to access the Admin Panel.");
    return res.redirect("/auth/login");
  }
  // Logged in but not admin
  res.status(403).render("access-denied", { currentUser: res.locals.currentUser });
}

module.exports = { isLoggedIn, isAdmin };
