module.exports = (sequelize, Sequelize) => {
    const Tarea = sequelize.define("tarea", {
        titulo: {
            type: Sequelize.STRING
        },
        descripcion: {
            type: Sequelize.STRING
        },
        estado: {
            type: Sequelize.STRING,
            defaultValue: "pendiente"
        },
        usuarioId: {
            type: Sequelize.INTEGER,
            allowNull: true,
        }

    });
    return Tarea;
}
