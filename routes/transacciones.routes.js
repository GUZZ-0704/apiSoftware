const authMiddleware = require("../middlewares/authMiddleware"); // Importar el middleware de autenticación

module.exports = app => {
    const transaccionesController = require("../controllers/transacciones.controller.js");
    let router = require("express").Router();

    // Rutas del CRUD protegidas
    router.post("/", authMiddleware, transaccionesController.crearTransaccion);
    router.get("/", authMiddleware, transaccionesController.listaTransacciones);
    router.get("/:id", authMiddleware, transaccionesController.listaTransaccionPorID);
    router.put("/:id", authMiddleware, transaccionesController.editarTransaccion);
    router.delete("/:id", authMiddleware, transaccionesController.eliminarTransaccion);

    //obtener transacciones de un libro diario
    router.get("/libroDiario/:id", authMiddleware, transaccionesController.listaTransaccionesPorLibroDiario);

    app.use("/transacciones", router);
}