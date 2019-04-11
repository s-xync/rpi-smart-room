const { Router } = require("express");

const adminController = require("./admin.controllers");
const { authLocal, authJwt } = require("../../services/auth.services");

const routes = new Router();

routes.post("/login", authLocal, adminController.login);
routes.get("/tokeninfo", authJwt, adminController.tokenInfo);

module.exports = routes;
