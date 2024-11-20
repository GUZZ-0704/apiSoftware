const authMiddleware = require("../middlewares/authMiddleware"); // Importar el middleware de autenticación

module.exports = app => {
    const inventarioController = require("../controllers/inventario.controller.js");
    let router = require("express").Router();

    // Rutas del CRUD protegidas
    router.post("/", authMiddleware, inventarioController.crearInventario);
    router.get("/", authMiddleware, inventarioController.listaInventarios);
    router.get("/:id", authMiddleware, inventarioController.listaInventarioPorID);
    router.put("/:id", authMiddleware, inventarioController.editarInventario);
    router.delete("/:id", authMiddleware, inventarioController.eliminarInventario);

    app.use("/inventarios", router);
};
