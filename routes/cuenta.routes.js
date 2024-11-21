const authMiddleware = require("../middlewares/authMiddleware"); // Importar el middleware de autenticación

module.exports = app => {
    const cuentaController = require("../controllers/cuenta.controller.js");
    let router = require("express").Router();

    // Rutas del CRUD protegidas
    router.post("/", authMiddleware, cuentaController.crearCuenta);
    router.get("/", authMiddleware, cuentaController.listaCuentas);
    router.get("/:id", authMiddleware, cuentaController.listaCuentaPorID);
    router.put("/:id", authMiddleware, cuentaController.editarCuenta);
    router.delete("/:id", authMiddleware, cuentaController.eliminarCuenta);

    

    app.use("/cuentas", router);
}