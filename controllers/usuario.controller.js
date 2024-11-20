const db = require("../models");
const Usuario = db.usuario;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;  // ESTO ES LA CLAVE, SIN ESTO NOS HACKEAN, NO BORRAR PORQUE SE TIRA EL JWT
// **Registro de un Usuario**
exports.register = async (req, res) => {
    try {
        const { nombre, email, password, rolId } = req.body;

        // Validación de entrada
        if (!nombre || !email || !password || !rolId) {
            return res.status(400).send({ message: "Todos los campos son obligatorios." });
        }

        // Verificar si el usuario ya existe
        const existingUser = await Usuario.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).send({ message: "El correo ya está registrado." });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario
        const newUser = await Usuario.create({
            nombre,
            email,
            password: hashedPassword,
            rolId,
        });

        res.status(201).send({ message: "Usuario registrado exitosamente.", usuario: newUser });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al registrar el usuario." });
    }
};

// **Inicio de Sesión**
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validación de entrada
        if (!email || !password) {
            return res.status(400).send({ message: "Email y contraseña son obligatorios." });
        }

        // Buscar el usuario por email
        const user = await Usuario.findOne({ where: { email } });
        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        }

        // Comparar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: "Contraseña incorrecta." });
        }

        // Generar el token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, rolId: user.rolId },
            JWT_SECRET,
            { expiresIn: "1h" } // Token válido por 1 hora
        );

        res.status(200).send({ message: "Inicio de sesión exitoso.", token, id: user.id })
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al iniciar sesión." });
    }
};

// **CRUD Básico para Usuarios**
// Crear un Usuario (solo para casos excepcionales)
exports.crearUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rolId } = req.body;

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        const data = await Usuario.create({
            nombre,
            email,
            password: hashedPassword,
            rolId,
        });

        res.status(201).send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al crear el usuario." });
    }
};

// Obtener todos los Usuarios (para casos excepcionales)
exports.listaUsuarios = async (req, res) => {
    try {
        const data = await Usuario.findAll({
            include: [
                {
                    model: db.rol,
                    as: "rol",
                },
            ],
        });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al obtener los usuarios." });
    }
};

// Obtener un Usuario por ID
exports.listaUsuarioPorID = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Usuario.findByPk({id,
            include: [
                {
                    model: db.rol,
                    as: "rol",
                },
            ],}
        );
        if (!data) return res.status(404).send({ message: "Usuario no encontrado." });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al obtener el usuario." });
    }
};

// Actualizar un Usuario
exports.editarUsuario = async (req, res) => {
    const id = req.params.id;
    try {
        const { nombre, email, password, rolId } = req.body;

        // Encriptar la nueva contraseña si se proporciona
        let updateData = { nombre, email, rolId };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const [updated] = await Usuario.update(updateData, {
            where: { id },
        });

        if (updated) {
            const updatedUsuario = await Usuario.findByPk(id);
            res.send(updatedUsuario);
        } else {
            res.status(404).send({ message: "Usuario no encontrado." });
        }
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al actualizar el usuario." });
    }
};

// Eliminar un Usuario
exports.eliminarUsuario = async (req, res) => {
    const id = req.params.id;
    try {
        const deleted = await Usuario.destroy({
            where: { id },
        });
        if (deleted) {
            res.send({ message: "Usuario eliminado correctamente." });
        } else {
            res.status(404).send({ message: "Usuario no encontrado." });
        }
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al eliminar el usuario." });
    }
};
