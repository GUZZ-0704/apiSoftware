const db = require("../models");
const DetalleTransaccion = db.detalleTransaccion;

// Crear un nuevo DetalleTransaccion
exports.crearDetalleTransaccion = async (req, res) => {
    try {
        const data = await DetalleTransaccion.create(req.body);
        res.status(201).send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al crear el detalle de la transacción." });
    }
}

// Obtener todos los DetallesTransacciones
exports.listaDetallesTransacciones = async (req, res) => {
    try {
        const data = await DetalleTransaccion.findAll();
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al obtener los detalles de las transacciones." });
    }
}

// Obtener un DetalleTransaccion por ID
exports.listaDetalleTransaccionPorID = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await DetalleTransaccion.findByPk(id);
        if (!data) return res.status(404).send({ message: "Detalle de la transacción no encontrado." });
        res.send(data);
    }
    catch (error) {
        res.status(500).send({ message: error.message || "Error al obtener el detalle de la transacción." });
    }
}

// Actualizar un DetalleTransaccion
exports.editarDetalleTransaccion = async (req, res) => {
    const id = req.params.id;
    try {
        const [updated] = await DetalleTransaccion.update(req.body, {
            where: { id },
        });
        if (updated) {
            const updatedDetalleTransaccion = await DetalleTransaccion.findByPk(id);
            res.send(updatedDetalleTransaccion);
        } else {
            res.status(404).send({ message: "Detalle de la transacción no encontrado." });
        }
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al actualizar el detalle de la transacción." });
    }
}

// Eliminar un DetalleTransaccion
exports.eliminarDetalleTransaccion = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await DetalleTransaccion.destroy({
            where: { id },
        });
        if (data) {
            res.send({ message: "Detalle de la transacción eliminado exitosamente." });
        }
        else {
            res.status(404).send({ message: "Detalle de la transacción no encontrado." });
        }
    }catch (error) {
        res.status(500).send({ message: error.message || "Error al eliminar el detalle de la transacción." });
    }
}

// Obtener todos los detalles de una transacción
exports.listaDetallesTransaccionPorTransaccion = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await DetalleTransaccion.findAll({
            where: { transaccionId: id },
        });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al obtener los detalles de la transacción." });
    }
}

// Obtener todos los detalles de una cuenta
exports.listaDetallesTransaccionPorCuenta = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await DetalleTransaccion.findAll({
            where: { cuentaId: id },
        });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al obtener los detalles de la transacción." });
    }
}

// Obtener todos los detalles de un libro diario
exports.listaDetallesTransaccionPorLibroDiario = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await DetalleTransaccion.findAll({
            where: { libroDiarioId: id },
        });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al obtener los detalles de la transacción." });
    }
}