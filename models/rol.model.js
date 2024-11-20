module.exports = (sequelize, Sequelize) => {
    const Rol = sequelize.define("rol", {
        nombre: {
            type: Sequelize.STRING
        },
        sueldo: {
            type: Sequelize.INTEGER
        }
    });
    return Rol;
}
