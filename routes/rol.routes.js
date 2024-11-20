const authMiddleware = require("../middlewares/authMiddleware"); // Importar el middleware de autenticación

module.exports = app => {
    const rolController = require("../controllers/rol.controller.js");
    let router = require("express").Router();

    // Rutas del CRUD protegidas
    router.post("/", authMiddleware, rolController.crearRol);
    router.get("/", authMiddleware, rolController.listaRoles);
    router.get("/:id", authMiddleware, rolController.listaRolPorID);
    router.put("/:id", authMiddleware, rolController.editarRol);
    router.delete("/:id", authMiddleware, rolController.eliminarRol);

    app.use("/rol", router);
};
