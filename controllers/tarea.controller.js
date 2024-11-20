const db = require("../models");
const Tarea = db.tarea;

// Crear una nueva Tarea
exports.crearTarea = async (req, res) => {
    try {
        const data = await Tarea.create(req.body);
        res.status(201).send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al crear la tarea." });
    }
};

// Obtener todas las Tareas
exports.listaTareas = async (req, res) => {
    try {
        const data = await Tarea.findAll({
            include: [
                { model: db.proyecto, as: "proyecto" }, // Incluye el proyecto al que pertenece la tarea
                { model: db.usuario, as: "usuario" },  // Incluye el usuario asignado a la tarea
            ],
        });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al obtener las tareas." });
    }
};

// Obtener una Tarea por ID
exports.listaTareaPorID = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Tarea.findByPk(id, {
            include: [
                { model: db.proyecto, as: "proyecto" }, // Incluye el proyecto al que pertenece la tarea
                { model: db.usuario, as: "usuario" },  // Incluye el usuario asignado a la tarea
            ],
        });
        if (!data) return res.status(404).send({ message: "Tarea no encontrada." });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al obtener la tarea." });
    }
};

// Actualizar una Tarea
exports.editarTarea = async (req, res) => {
    const id = req.params.id;
    try {
        const [updated] = await Tarea.update(req.body, {
            where: { id },
        });
        if (updated) {
            const updatedTarea = await Tarea.findByPk(id);
            res.send(updatedTarea);
        } else {
            res.status(404).send({ message: "Tarea no encontrada." });
        }
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al actualizar la tarea." });
    }
};

// Eliminar una Tarea
exports.eliminarTarea = async (req, res) => {
    const id = req.params.id;
    try {
        const deleted = await Tarea.destroy({
            where: { id },
        });
        if (deleted) {
            res.send({ message: "Tarea eliminada correctamente." });
        } else {
            res.status(404).send({ message: "Tarea no encontrada." });
        }
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al eliminar la tarea." });
    }
};

exports.cambiarEstadoTarea = async (req, res) => {
    const id = req.params.id;
    try {
        const [updated] = await Tarea.update({estado: "hecha", usuarioId: req.body.usuarioId}, {
            where: { id },
        });
        if (updated) {
            const updatedTarea = await Tarea.findByPk(id);
            res.send(updatedTarea);
        } else {
            res.status(404).send({ message: "Tarea no encontrada." });
        }
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al cambiar el estado de la tarea." });
    }
};