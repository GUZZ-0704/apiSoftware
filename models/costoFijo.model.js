module.exports = (sequelize, Sequelize) => {
    const CostoFijo = sequelize.define("costo", {
        nombre: {
            type: Sequelize.STRING
        },
        costo: {
            type: Sequelize.INTEGER
        }
    });
    return CostoFijo;
}
y 