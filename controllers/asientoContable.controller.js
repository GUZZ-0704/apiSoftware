const db = require("../models");
const AsientoContable = db.asientoContable;

// Crear un nuevo Asiento Contable
exports.crearAsiento = async (req, res) => {
    try {
        const data = await AsientoContable.create(req.body);
        res.status(201).send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al crear el asiento contable." });
    }
};

// Obtener todos los Asientos Contables
exports.listaAsientos = async (req, res) => {
    try {
        const data = await AsientoContable.findAll({
            include: ["administracion"], // Incluye la relación con Administracion
        });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al obtener los asientos contables." });
    }
};

// Obtener un Asiento Contable por ID
exports.listaAsientoPorID = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await AsientoContable.findByPk(id, {
            include: ["administracion"], // Incluye la relación con Administracion
        });
        if (!data) return res.status(404).send({ message: "Asiento contable no encontrado." });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al obtener el asiento contable." });
    }
};

// Actualizar un Asiento Contable
exports.editarAsiento = async (req, res) => {
    const id = req.params.id;
    try {
        const [updated] = await AsientoContable.update(req.body, {
            where: { id },
        });
        if (updated) {
            const updatedAsiento = await AsientoContable.findByPk(id);
            res.send(updatedAsiento);
        } else {
            res.status(404).send({ message: "Asiento contable no encontrado." });
        }
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al actualizar el asiento contable." });
    }
};

// Eliminar un Asiento Contable
exports.eliminarAsiento = async (req, res) => {
    const id = req.params.id;
    try {
        const deleted = await AsientoContable.destroy({
            where: { id },
        });
        if (deleted) {
            res.send({ message: "Asiento contable eliminado correctamente." });
        } else {
            res.status(404).send({ message: "Asiento contable no encontrado." });
        }
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al eliminar el asiento contable." });
    }
};

exports.getAsientosContablesPorAdministracion = async (id) => {
    try {
        const data = await AsientoContable.findAll({
            where: { administracionId: id },
        });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al obtener los asientos contables." });
    }
}