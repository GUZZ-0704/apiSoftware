const { Op } = require("sequelize");
const db = require("../models");
const LibroDiario = db.libroDiario;

// Crear un nuevo Libro Diario
exports.crearLibroDiario = async (req, res) => {
  try {
    const data = await LibroDiario.create(req.body);
    res.status(201).send(data);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Error al crear el libro diario." });
  }
};

// Obtener todos los Libros Diarios
exports.listaLibrosDiarios = async (req, res) => {
  try {
    const data = await LibroDiario.findAll({
      include: ["transacciones", "detallesTransacciones"], // Incluye la relación con LibroDiario
    });
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error al obtener los libros diarios.",
    });
  }
};

// Obtener un Libro Diario por ID
exports.listaLibroDiarioPorID = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await LibroDiario.findByPk(id, {
      include: ["transacciones", "detallesTransacciones"], // Incluye la relación con LibroDiario
    });
    if (!data)
      return res.status(404).send({ message: "Libro Diario no encontrado." });
    res.send(data);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Error al obtener el libro diario." });
  }
};

// Actualizar un Libro Diario
exports.editarLibroDiario = async (req, res) => {
  const id = req.params.id;
  try {
    const [updated] = await LibroDiario.update(req.body, {
      where: { id },
    });
    if (updated) {
      const updatedLibroDiario = await LibroDiario.findByPk(id);
      res.send(updatedLibroDiario);
    } else {
      res.status(404).send({ message: "Libro Diario no encontrado." });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error al actualizar el libro diario.",
    });
  }
};

// Eliminar un Libro Diario
exports.eliminarLibroDiario = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await LibroDiario.destroy({
      where: { id },
    });
    if (!data)
      return res.status(404).send({ message: "Libro Diario no encontrado." });
    res.send({ message: "Libro Diario eliminado correctamente." });
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Error al eliminar el libro diario." });
  }
};

// obtener libro diario por fecha solo año
exports.listaLibroDiarioPorAnio = async (req, res) => {
  const anio = req.params.anio;
  try {
    const data = await LibroDiario.findAll({
      where: {
        fecha: {
          [Op.startsWith]: anio,
        },
      },
      include: ["transacciones", "detallesTransacciones"],
    });
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error al obtener los libros diarios.",
    });
  }
};

// obtener libro diario por fecha solo año y mes
exports.listaLibroDiarioPorAnioMes = async (req, res) => {
  const anio = req.params.anio;
  const mes = req.params.mes;
  try {
    const data = await LibroDiario.findAll({
      where: {
        fecha: {
          [Op.startsWith]: `${anio}-${mes}`,
        },
      },
      include: [
        "transacciones",
        {
          association: "detallesTransacciones",
          include: "cuenta",
        },
      ],
    });
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error al obtener los libros diarios.",
    });
  }
};

// obtener libro diario por fecha solo año, mes y dia
exports.listaLibroDiarioPorAnioMesDia = async (req, res) => {
  const anio = req.params.anio;
  const mes = req.params.mes;
  const dia = req.params.dia;
  try {
    const data = await LibroDiario.findAll({
      where: {
        fecha: {
          [Op.startsWith]: `${anio}-${mes}-${dia}`,
        },
      },
      include: ["transacciones", "detallesTransacciones"],
    });
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error al obtener los libros diarios.",
    });
  }
};

