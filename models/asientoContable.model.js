module.exports = (sequelize, Sequelize) => {
    const AsientoContable = sequelize.define("asiento", {
        fecha: {
            type: Sequelize.DATE
        },
        concepto: {
            type: Sequelize.STRING
        },
        debe: {
            type: Sequelize.FLOAT
        },
        haber: {
            type: Sequelize.FLOAT
        },
        saldo: {
            type: Sequelize.FLOAT
        },
        tipo: {
            type: Sequelize.STRING
        },
        administracionId: {
            type: Sequelize.INTEGER
        }
    });
    return AsientoContable;
}
