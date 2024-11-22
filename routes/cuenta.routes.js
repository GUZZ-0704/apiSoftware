const authMiddleware = require("../middlewares/authMiddleware"); // Importar el middleware de autenticación

module.exports = (app) => {
  const cuentaController = require("../controllers/cuenta.controller.js");
  let router = require("express").Router();

  // Rutas del CRUD protegidas
  router.post("/", authMiddleware, cuentaController.crearCuenta);
  router.get("/", authMiddleware, cuentaController.listaCuentas);
  router.get("/:id", authMiddleware, cuentaController.listaCuentaPorID);
  router.put("/:id", authMiddleware, cuentaController.editarCuenta);
  router.delete("/:id", authMiddleware, cuentaController.eliminarCuenta);

  //Crear cuenta nivel 1
  router.post("/nivel1", authMiddleware, cuentaController.crearCuentaNivel1);

  //Crear cuenta hija
  router.post("/:id/child", authMiddleware, cuentaController.crearCuentaHija);


  //obtener cuentas finales
  router.get("/finales/lista", authMiddleware, cuentaController.listaCuentasFinales);

  //Obtener balance general
  router.get(
    "/balanceGeneral/lista",
    authMiddleware,
    cuentaController.listaBalanceGeneral
  );

  //Obtener estado de resultados
  router.get(
    "/estadoResultados/lista",
    authMiddleware,
    cuentaController.listaEstadoResultados
  );

  //Obtener flujo de efectivo
  router.get(
    "/flujoEfectivo/lista",
    authMiddleware,
    cuentaController.listaFlujoEfectivo
  );

  //Obtener balance de comprobación
  router.get(
    "/balanceComprobacion/lista",
    authMiddleware,
    cuentaController.listaBalanceComprobacion
  );

  app.use("/cuentas", router);
};
