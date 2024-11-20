const db = require("../models");
const Proyecto = db.proyecto;

// Crear un nuevo Proyecto
exports.crearProyecto = async (req, res) => {
    try {
        const data = await Proyecto.create(req.body);
        res.status(201).send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al crear el proyecto." });
    }
};

// Obtener todos los Proyectos
exports.listaProyectos = async (req, res) => {
    try {
        const data = await Proyecto.findAll({
            include: [
                { model: db.usuario, as: "administrador" }, // Incluye el administrador del proyecto
                { model: db.usuario, as: "equipo" }, // Incluye el equipo del proyecto
                { model: db.tarea, as: "tareas" }, // Incluye las tareas del proyecto
                { model: db.inventario, as: "inventarios" }, // Incluye los inventarios del proyecto
            ],
        });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al obtener los proyectos." });
    }
};

// Obtener un Proyecto por ID
exports.listaProyectoPorID = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Proyecto.findByPk(id, {
            include: [
                { model: db.usuario, as: "administrador" }, // Incluye el administrador del proyecto
                { model: db.usuario, as: "equipo" }, // Incluye el equipo del proyecto
                { model: db.tarea, as: "tareas" }, // Incluye las tareas del proyecto
                { model: db.inventario, as: "inventarios" }, // Incluye los inventarios del proyecto
            ],
        });
        if (!data) return res.status(404).send({ message: "Proyecto no encontrado." });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al obtener el proyecto." });
    }
};

// Actualizar un Proyecto
exports.editarProyecto = async (req, res) => {
    const id = req.params.id;
    try {
        const [updated] = await Proyecto.update(req.body, {
            where: { id },
        });
        if (updated) {
            const updatedProyecto = await Proyecto.findByPk(id);
            res.send(updatedProyecto);
        } else {
            res.status(404).send({ message: "Proyecto no encontrado." });
        }
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al actualizar el proyecto." });
    }
};

// Eliminar un Proyecto
exports.eliminarProyecto = async (req, res) => {
    const id = req.params.id;
    try {
        const deleted = await Proyecto.destroy({
            where: { id },
        });
        if (deleted) {
            res.send({ message: "Proyecto eliminado correctamente." });
        } else {
            res.status(404).send({ message: "Proyecto no encontrado." });
        }
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al eliminar el proyecto." });
    }
};

exports.getProyectosPorMesyGestion = async (mes, gestion) => {
    try {
        const data = await Proyecto.findAll({
            where: {
                fechaInicio: {
                    [Op.gte]: new Date(gestion, mes, 1),
                    [Op.lt]: new Date(gestion, mes, 31),
                },
            },
            include : [
                { model: db.usuario, as: "administrador" }, // Incluye el administrador del proyecto
                { model: db.usuario, as: "equipo" }, // Incluye el equipo del proyecto
                { model: db.tarea, as: "tareas" }, // Incluye las tareas del proyecto
                { model: db.inventario, as: "inventarios" }, // Incluye los inventarios del proyecto
            ],
        });
        return data;
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al obtener los proyectos." });
    }
}

exports.agregarUsuarioAProyecto = async (req, res) => {
    const id = req.params.id;
    const { usuarioId } = req.body;
    try {
        const proyecto = await Proyecto.findByPk(id);
        if (!proyecto) {
            return res.status(404).send({ message: "Proyecto no encontrado." });
        }
        await proyecto.addEquipo(usuarioId);
        res.send({ message: "Usuario agregado correctamente." });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al agregar el usuario al proyecto." });
    }
};

exports.eliminarUsuarioDeProyecto = async (req, res) => {
    const id = req.params.id;
    const { usuarioId } = req.body;
    try {
        const proyecto = await Proyecto.findByPk(id);
        if (!proyecto) {
            return res.status(404).send({ message: "Proyecto no encontrado." });
        }
        await proyecto.removeEquipo(usuarioId);
        res.send({ message: "Usuario eliminado correctamente." });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al eliminar el usuario del proyecto." });
    }
};

exports.agregarInventarioAProyecto = async (req, res) => {
    const id = req.params.id;
    const { inventarioId } = req.body;
    try {
        const proyecto = await Proyecto.findByPk(id);
        if (!proyecto) {
            return res.status(404).send({ message: "Proyecto no encontrado." });
        }
        await proyecto.addInventarios(inventarioId);
        res.send({ message: "Inventario agregado correctamente." });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al agregar el inventario al proyecto." });
    }
};

exports.eliminarInventarioDeProyecto = async (req, res) => {
    const id = req.params.id;
    const { inventarioId } = req.body;
    try {
        const proyecto = await Proyecto.findByPk(id);
        if (!proyecto) {
            return res.status(404).send({ message: "Proyecto no encontrado." });
        }
        await proyecto.removeInventarios(inventarioId);
        res.send({ message: "Inventario eliminado correctamente." });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al eliminar el inventario del proyecto." });
    }
};

exports.agregarTareaAProyecto = async (req, res) => {
    const id = req.params.id;
    const { tareaId } = req.body;
    try {
        const proyecto = await Proyecto.findByPk(id);
        if (!proyecto) {
            return res.status(404).send({ message: "Proyecto no encontrado." });
        }
        await proyecto.addTareas(tareaId);
        res.send({ message: "Tarea agregada correctamente." });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al agregar la tarea al proyecto." });
    }
};

exports.eliminarTareaDeProyecto = async (req, res) => {
    const id = req.params.id;
    const { tareaId } = req.body;
    try {
        const proyecto = await Proyecto.findByPk(id);
        if (!proyecto) {
            return res.status(404).send({ message: "Proyecto no encontrado." });
        }
        await proyecto.removeTareas(tareaId);
        res.send({ message: "Tarea eliminada correctamente." });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al eliminar la tarea del proyecto." });
    }
};

exports.actualizarEstadoProyecto = async (req, res) => {
    const id = req.params.id;
    try {
        const proyecto = await Proyecto.findByPk(id, {
            include: ["tareas"],
        });
        if (!proyecto) {
            return res.status(404).send({ message: "Proyecto no encontrado." });
        }
        const tareas = proyecto.tareas;
        const tareasRealizadas = tareas.filter((tarea) => tarea.estado === "hecha");
        if (tareas.length === tareasRealizadas.length) {
            await Proyecto.update({ estado: "finalizado" }, {
                where: { id },
            });
            res.send({ message: "Proyecto finalizado correctamente." });
        } else {
            res.send({ message: "Proyecto actualizado correctamente." });
        }
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al actualizar el proyecto." });
    }
};

exports.getProyectosByAdminId = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Proyecto.findAll({
            where: {
                usuarioId: id,
            },
            include: [
                { model: db.usuario, as: "administrador" }, // Incluye el administrador del proyecto
                { model: db.usuario, as: "equipo" }, // Incluye el equipo del proyecto
                { model: db.tarea, as: "tareas" }, // Incluye las tareas del proyecto
                { model: db.inventario, as: "inventarios" }, // Incluye los inventarios del proyecto
            ],
        });
        if (!data) return res.status(404).send({ message: "Proyecto no encontrado." });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al obtener el proyecto." });
    }
};

exports.getProyectosDondeParticipo = async (req, res) => {
    const usuarioId = req.params.id; // ID del usuario que realiza la solicitud

    try {
        const proyectos = await Proyecto.findAll({
            include: [
                {
                    model: db.usuario,
                    as: "equipo",
                    through: { attributes: [] },
                    where: { id: usuarioId },
                },
                {
                    model: db.usuario,
                    as: "administrador",
                    attributes: ["id", "nombre"]
                },
                { model: db.tarea, as: "tareas" }, // Incluye tareas
                { model: db.inventario, as: "inventarios" }, // Incluye inventarios
            ],
            where: {
                usuarioId: { [db.Sequelize.Op.ne]: usuarioId }, // Excluye proyectos donde el usuario es administrador
            },
        });

        res.send(proyectos);
    } catch (error) {
        console.error("Error al obtener proyectos con usuarios:", error);
        res.status(500).send({
            message: error.message || "Error al obtener los proyectos.",
        });
    }
};
