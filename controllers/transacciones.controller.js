const db = require("../models");
const Transacciones = db.transacciones;

// Crear una nueva Transacción
exports.crearTransaccion = async (req, res) => {
  try {
    const data = await Transacciones.create(req.body);
    res.status(201).send(data);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Error al crear la transacción." });
  }
};

// Obtener todas las Transacciones
exports.listaTransacciones = async (req, res) => {
  try {
    const data = await Transacciones.findAll({
      include: ["libroDiario", "detallesTransacciones"], // Incluye la relación con Transacciones
    });
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error al obtener las transacciones.",
    });
  }
};

// Obtener una Transacción por ID
exports.listaTransaccionPorID = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Transacciones.findByPk(id, {
      include: ["libroDiario", "detallesTransacciones"], // Incluye la relación con Transacciones
    });
    if (!data)
      return res.status(404).send({ message: "Transacción no encontrada." });
    res.send(data);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Error al obtener la transacción." });
  }
};

// Actualizar una Transacción
exports.editarTransaccion = async (req, res) => {
  const id = req.params.id;
  try {
    const [updated] = await Transacciones.update(req.body, {
      where: { id },
    });
    if (updated) {
      const updatedTransaccion = await Transacciones.findByPk(id);
      res.send(updatedTransaccion);
    } else {
      res.status(404).send({ message: "Transacción no encontrada." });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error al actualizar la transacción.",
    });
  }
};

// Eliminar una Transacción
exports.eliminarTransaccion = async (req, res) => {
  const id = req.params.id;
  try {
    const deleted = await Transacciones.destroy({
      where: { id },
    });
    if (!deleted) {
      res.status(404).send({ message: "Transacción no encontrada." });
    } else {
      res.send({ message: "Transacción eliminada correctamente." });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error al eliminar la transacción.",
    });
  }
};

//obtener todas las transacciones de un libro diario
exports.listaTransaccionesPorLibroDiario = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Transacciones.findAll({
      where: { libroDiarioId: id },
      include: ["libroDiario", "detallesTransacciones"], // Incluye la relación con Transacciones
    });
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error al obtener las transacciones.",
    });
  }
};

