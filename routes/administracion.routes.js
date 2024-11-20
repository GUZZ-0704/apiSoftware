const authMiddleware = require("../middlewares/authMiddleware"); // Importar el middleware de autenticación

module.exports = app => {
    const administracionController = require("../controllers/administracion.controller.js");
    let router = require("express").Router();

    // Rutas del CRUD protegidas
    router.post("/", authMiddleware, administracionController.crearAdministracion);
    router.get("/", authMiddleware, administracionController.listaAdministraciones);
    router.get("/:id", authMiddleware, administracionController.listaAdministracionPorID);
    router.put("/:id", authMiddleware, administracionController.editarAdministracion);
    router.delete("/:id", authMiddleware, administracionController.eliminarAdministracion);
    //get gestioActual
    router.get("/gestionActual", authMiddleware, administracionController.getGestionActual);
    //getMesActual
    router.get("/mesActual", authMiddleware, administracionController.getMesActual);
    //cambiaMes
    router.put("/cambiaMes", authMiddleware, administracionController.cambiarMes);
    //getContabilidadPorMesYGestion
    router.get("/contabilidad/mes/:mes/gestion/:gestion", authMiddleware, administracionController.getContabilidadPorMesyGestion);
    //getContabilidadPorGestion
    router.get("/contabilidad/gestion/:gestion", authMiddleware, administracionController.getContabilidadPorGestion);

    app.use("/administracion", router);
};
