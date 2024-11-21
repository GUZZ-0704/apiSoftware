const db = require("../models");
const Cuenta = db.cuenta;

// Crear una nueva Cuenta
exports.crearCuenta = async (req, res) => {
    try {
        const data = await Cuenta.create(req.body);
        res.status(201).send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al crear la cuenta." });
    }
};

// Obtener todas las Cuentas
exports.listaCuentas = async (req, res) => {
    try {
        const data = await Cuenta.findAll({
            include: ["cuentaPadre", "cuentasHijas"], // Incluye la relación con Cuenta
        });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al obtener las cuentas." });
    }
};

// Obtener una Cuenta por ID
exports.listaCuentaPorID = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Cuenta.findByPk(id, {
            include: ["cuentaPadre", "cuentasHijas"], // Incluye la relación con Cuenta
        });
        if (!data) return res.status(404).send({ message: "Cuenta no encontrada." });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al obtener la cuenta." });
    }
};

// Actualizar una Cuenta
exports.editarCuenta = async (req, res) => {
    const id = req.params.id;
    try {
        const [updated] = await Cuenta.update(req.body, {
            where: { id },
        });
        if (updated) {
            const updatedCuenta = await Cuenta.findByPk(id);
            res.send(updatedCuenta);
        } else {
            res.status(404).send({ message: "Cuenta no encontrada." });
        }
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al actualizar la cuenta." });
    }
};

// Eliminar una Cuenta
exports.eliminarCuenta = async (req, res) => {
    const id = req.params.id;
    try {
        const deleted = await Cuenta.destroy({
            where: { id },
        });
        if (!deleted) {
            res.status(404).send({ message: "Cuenta no encontrada." });
        } else {
            res.send({ message: "Cuenta eliminada exitosamente." });
        }
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al eliminar la cuenta." });
    }
};



