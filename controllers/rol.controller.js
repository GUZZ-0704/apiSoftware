const db = require("../models");
const rol = db.rol;

// Crear y guardar un nuevo rol
exports.crearRol = (req, res) => {
    // Validar la solicitud
    if (!req.body.nombre) {
        res.status(400).send({
            message: "El contenido no puede estar vacío!"
        });
        return;
    }

    // Crear un rol
    const nuevoRol = {
        nombre: req.body.nombre,
        sueldo: req.body.sueldo
    };

    // Guardar el rol en la base de datos
    rol.create(nuevoRol)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Ocurrió un error al crear el rol."
            });
        });
};

// Listar todos los roles
exports.listaRoles = (req, res) => {
    rol.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Ocurrió un error al listar los roles."
            });
        });
};

// Listar un rol por ID
exports.listaRolPorID = (req, res) => {
    const id = req.params.id;

    rol.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al obtener el rol con id=" + id
            });
        });
};

// Editar un rol por ID
exports.editarRol = (req, res) => {
    const id = req.params.id;

    rol.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "El rol fue actualizado exitosamente."
                });
            } else {
                res.send({
                    message: `No se pudo actualizar el rol con id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al actualizar el rol con id=" + id
            });
        });
};

// Eliminar un rol por ID
exports.eliminarRol = (req, res) => {
    const id = req.params.id;

    rol.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "El rol fue eliminado exitosamente."
                });
            } else {
                res.send({
                    message: `No se pudo eliminar el rol con id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "No se pudo eliminar el rol con id=" + id
            });
        });
};