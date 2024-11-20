const authMiddleware = require("../middlewares/authMiddleware"); // Importar el middleware de autenticación

module.exports = app => {
    const usuarioController = require("../controllers/usuario.controller.js");
    let router = require("express").Router();

    // Rutas de autenticación (públicas)
    router.post("/register", usuarioController.register);
    router.post("/login", usuarioController.login);

    // Rutas del CRUD protegidas
    router.post("/", authMiddleware, usuarioController.crearUsuario);
    router.get("/", authMiddleware, usuarioController.listaUsuarios);
    router.get("/:id", authMiddleware, usuarioController.listaUsuarioPorID);
    router.put("/:id", authMiddleware, usuarioController.editarUsuario);
    router.delete("/:id", authMiddleware, usuarioController.eliminarUsuario);

    app.use("/usuarios", router);
};
