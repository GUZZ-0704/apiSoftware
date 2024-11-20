module.exports = (sequelize, Sequelize) => {
    const Administracion = sequelize.define("administracion", {
        gestion: {
            type: Sequelize.STRING
        },
        mes: {
            type: Sequelize.STRING
        },
        informe: {
            type: Sequelize.STRING,
            allowNull: true
        },
    });
    return Administracion;
}
