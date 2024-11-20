const authMiddleware = require("../middlewares/authMiddleware"); // Importar el middleware de autenticación

module.exports = app => {
    const proyectoController = require("../controllers/proyecto.controller.js");
    let router = require("express").Router();

    // Rutas del CRUD protegidas
    router.post("/", authMiddleware, proyectoController.crearProyecto);
    router.get("/", authMiddleware, proyectoController.listaProyectos);
    router.get("/:id", authMiddleware, proyectoController.listaProyectoPorID);
    router.put("/:id", authMiddleware, proyectoController.editarProyecto);
    router.delete("/:id", authMiddleware, proyectoController.eliminarProyecto);
    //getProyectosPorMesyGestion
    router.get("/proyectosPorMesyGestion", authMiddleware, proyectoController.getProyectosPorMesyGestion);
    //agregarUsuarioAProyecto
    router.post("/usuario/:id", authMiddleware, proyectoController.agregarUsuarioAProyecto);
    //eliminarUsuarioDeProyecto
    router.delete("/usuario/:id", authMiddleware, proyectoController.eliminarUsuarioDeProyecto);
    //agregarInventarioAProyecto
    router.post("/inventario/:id", authMiddleware, proyectoController.agregarInventarioAProyecto);
    //eliminarInventarioDeProyecto
    router.delete("/inventario/:id", authMiddleware, proyectoController.eliminarInventarioDeProyecto);
    //agregarTareaAProyecto
    router.post("/tarea/:id", authMiddleware, proyectoController.agregarTareaAProyecto);
    //eliminarTareaDeProyecto
    router.delete("/tarea/:id", authMiddleware, proyectoController.eliminarTareaDeProyecto);
    //actualizarEstadoProyecto
    router.put("/estado/:id", authMiddleware, proyectoController.actualizarEstadoProyecto);
    //obtenerProyectoPorAdminId
    router.get("/admin/:id", authMiddleware, proyectoController.getProyectosByAdminId);
    //obtenerProyectoDondeParticipo
    router.get("/usuario/:id", authMiddleware, proyectoController.getProyectosDondeParticipo);

    
    app.use("/proyectos", router);
};
