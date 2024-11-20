module.exports = (sequelize, Sequelize) => {
    const Inventario = sequelize.define("inventario", {
        nombre: {
            type: Sequelize.STRING
        },
        descripcion: {
            type: Sequelize.STRING
        },
        precio: {
            type: Sequelize.STRING
        },
        cantidad: {
            type: Sequelize.STRING
        }
    });
    return Inventario;
}
