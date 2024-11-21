const authMiddleware = require("../middlewares/authMiddleware"); // Importar el middleware de autenticación

module.exports = app => {
    const libroDiarioController = require("../controllers/libroDiario.controller.js");
    let router = require("express").Router();

    // Rutas del CRUD protegidas
    router.post("/", authMiddleware, libroDiarioController.crearLibroDiario);
    router.get("/", authMiddleware, libroDiarioController.listaLibrosDiarios);
    router.get("/:id", authMiddleware, libroDiarioController.listaLibroDiarioPorID);
    router.put("/:id", authMiddleware, libroDiarioController.editarLibroDiario);
    router.delete("/:id", authMiddleware, libroDiarioController.eliminarLibroDiario);

    //obtener libros diarios de un año
    router.get("/anio/:anio", authMiddleware, libroDiarioController.listaLibroDiarioPorAnio);

    //obtener libros diarios de un año, mes
    router.get("/mes/:mes", authMiddleware, libroDiarioController.listaLibroDiarioPorAnioMes);

    //obtener libros diarios de un año, mes, dia
    router.get("/dia/:dia", authMiddleware, libroDiarioController.listaLibroDiarioPorAnioMesDia);

    app.use("/librosDiarios", router);
}