module.exports = (sequelize, Sequelize) => {
    const LibroDiario = sequelize.define("libroDiario", {
        fecha: {
            type: Sequelize.DATE
        },
        descripcion: {
            type: Sequelize.STRING
        },
    });
    return LibroDiario;
}
