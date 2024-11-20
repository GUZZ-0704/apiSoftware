const authMiddleware = require("../middlewares/authMiddleware"); // Importar el middleware de autenticación

module.exports = app => {
    const costoFijoController = require("../controllers/costoFijo.controller.js");
    let router = require("express").Router();

    // Rutas del CRUD protegidas
    router.post("/", authMiddleware, costoFijoController.crearCostoFijo);
    router.get("/", authMiddleware, costoFijoController.listaCostosFijos);
    router.get("/:id", authMiddleware, costoFijoController.listaCostoFijoPorID);
    router.put("/:id", authMiddleware, costoFijoController.editarCostoFijo);
    router.delete("/:id", authMiddleware, costoFijoController.eliminarCostoFijo);

    app.use("/costoFijos", router);
};
