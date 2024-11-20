const db = require("../models");
const Inventario = db.inventario;

// Crear un nuevo Inventario
exports.crearInventario = async (req, res) => {
    try {
        const data = await Inventario.create(req.body);
        res.status(201).send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al crear el inventario." });
    }
};

// Obtener todos los Inventarios
exports.listaInventarios = async (req, res) => {
    try {
        const data = await Inventario.findAll({
            include: ["proyecto"], // Incluye la relación con Proyecto
        });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al obtener los inventarios." });
    }
};

// Obtener un Inventario por ID
exports.listaInventarioPorID = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Inventario.findByPk(id, {
            include: ["proyecto"], // Incluye la relación con Proyecto
        });
        if (!data) return res.status(404).send({ message: "Inventario no encontrado." });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al obtener el inventario." });
    }
};

// Actualizar un Inventario
exports.editarInventario = async (req, res) => {
    const id = req.params.id;
    try {
        const [updated] = await Inventario.update(req.body, {
            where: { id },
        });
        if (updated) {
            const updatedInventario = await Inventario.findByPk(id);
            res.send(updatedInventario);
        } else {
            res.status(404).send({ message: "Inventario no encontrado." });
        }
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al actualizar el inventario." });
    }
};

// Eliminar un Inventario
exports.eliminarInventario = async (req, res) => {
    const id = req.params.id;
    try {
        const deleted = await Inventario.destroy({
            where: { id },
        });
        if (deleted) {
            res.send({ message: "Inventario eliminado correctamente." });
        } else {
            res.status(404).send({ message: "Inventario no encontrado." });
        }
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al eliminar el inventario." });
    }
};
