const db = require("../models");
const CostoFijo = db.costoFijo;

// Crear un nuevo Costo Fijo
exports.crearCostoFijo = async (req, res) => {
    try {
        const data = await CostoFijo.create(req.body);
        res.status(201).send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al crear el costo fijo." });
    }
};

// Obtener todos los Costos Fijos
exports.listaCostosFijos = async (req, res) => {
    try {
        const data = await CostoFijo.findAll();
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al obtener los costos fijos." });
    }
};

// Obtener un Costo Fijo por ID
exports.listaCostoFijoPorID = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await CostoFijo.findByPk(id);
        if (!data) return res.status(404).send({ message: "Costo fijo no encontrado." });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al obtener el costo fijo." });
    }
};

// Actualizar un Costo Fijo
exports.editarCostoFijo = async (req, res) => {
    const id = req.params.id;
    try {
        const [updated] = await CostoFijo.update(req.body, {
            where: { id },
        });
        if (updated) {
            const updatedCostoFijo = await CostoFijo.findByPk(id);
            res.send(updatedCostoFijo);
        } else {
            res.status(404).send({ message: "Costo fijo no encontrado." });
        }
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al actualizar el costo fijo." });
    }
};

// Eliminar un Costo Fijo

exports.eliminarCostoFijo = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await CostoFijo.destroy({
            where: { id },
        });
        if (!data) return res.status(404).send({ message: "Costo fijo no encontrado." });
        res.send({ message: "Costo fijo eliminado correctamente." });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al eliminar el costo fijo." });
    }
}