const getAdminPage = (req, res) => {
  // req.user contiene la información del usuario autenticado con JWT
  const user = req.user.toObject({ getters: true });

  res.render('admin.handlebars', { user: user });
};

module.exports = { getAdminPage };