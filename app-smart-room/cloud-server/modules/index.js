const adminRoutes = require("./admins/admin.routes");

module.exports = app => {
  app.use("/admin", adminRoutes);
};
