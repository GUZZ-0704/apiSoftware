const authMiddleware = require("../middlewares/authMiddleware"); // Importar el middleware de autenticación

module.exports = app => {
    const tareaController = require("../controllers/tarea.controller.js");
    let router = require("express").Router();

    // Rutas del CRUD protegidas
    router.post("/", authMiddleware, tareaController.crearTarea);
    router.get("/", authMiddleware, tareaController.listaTareas);
    router.get("/:id", authMiddleware, tareaController.listaTareaPorID);
    router.put("/:id", authMiddleware, tareaController.editarTarea);
    router.delete("/:id", authMiddleware, tareaController.eliminarTarea);
    //cambiarEstadoTarea
    router.put("/estado/:id", authMiddleware, tareaController.cambiarEstadoTarea);

    app.use("/tareas", router);
};
