module.exports = (sequelize, Sequelize) => {
    const Proyecto = sequelize.define("proyecto", {
        nombre: {
            type: Sequelize.STRING
        },
        descripcion: {
            type: Sequelize.STRING
        },
        fechaInicio: {
            type: Sequelize.DATE
        },
        fechaFin: {
            type: Sequelize.DATE
        },
        estado: {
            type: Sequelize.STRING
        },
        precio:{
            type: Sequelize.STRING
        },
        usuarioId: {
            type: Sequelize.INTEGER,
            allowNull: true,
        }
    });
    return Proyecto;
}
