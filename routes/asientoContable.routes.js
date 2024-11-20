const authMiddleware = require("../middlewares/authMiddleware"); // Importar el middleware de autenticación

module.exports = app => {
    const asientoController = require("../controllers/asientoContable.controller.js");
    let router = require("express").Router();

    // Rutas del CRUD protegidas
    router.post("/", authMiddleware, asientoController.crearAsiento);
    router.get("/", authMiddleware, asientoController.listaAsientos);
    router.get("/:id", authMiddleware, asientoController.listaAsientoPorID);
    router.put("/:id", authMiddleware, asientoController.editarAsiento);
    router.delete("/:id", authMiddleware, asientoController.eliminarAsiento);
    //getAsientosContablesPorAdministracion
    router.get("/administracion/:id", authMiddleware, asientoController.getAsientosContablesPorAdministracion);

    app.use("/asientos", router);
};
