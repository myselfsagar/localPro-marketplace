exports.getDashboardPage = (req, res) => {
  res.render("pages/dashboard", {
    pageTitle: "My Dashboard",
    user: req.user,
  });
};
