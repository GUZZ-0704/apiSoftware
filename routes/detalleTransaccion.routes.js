const authMiddleware = require("../middlewares/authMiddleware"); // Importar el middleware de autenticación

module.exports = app => {
    const detalleTransaccionController = require("../controllers/detalleTransaccion.controller.js");
    let router = require("express").Router();

    // Rutas del CRUD protegidas
    router.post("/", authMiddleware, detalleTransaccionController.crearDetalleTransaccion);
    router.get("/", authMiddleware, detalleTransaccionController.listaDetallesTransacciones);
    router.get("/:id", authMiddleware, detalleTransaccionController.listaDetalleTransaccionPorID);
    router.put("/:id", authMiddleware, detalleTransaccionController.editarDetalleTransaccion);
    router.delete("/:id", authMiddleware, detalleTransaccionController.eliminarDetalleTransaccion);

    //get detalles de una transaccion
    router.get("/transaccion/:id", authMiddleware, detalleTransaccionController.listaDetallesTransaccionPorTransaccion);

    //get detalles de una cuenta
    router.get("/cuenta/:id", authMiddleware, detalleTransaccionController.listaDetallesTransaccionPorCuenta);

    //get detalles de un libro diario
    router.get("/libroDiario/:id", authMiddleware, detalleTransaccionController.listaDetallesTransaccionPorLibroDiario);


    app.use("/detalleTransacciones", router);
}