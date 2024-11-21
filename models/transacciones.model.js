module.exports = (sequelize, Sequelize) => {
  const Transacciones = sequelize.define("transacciones", {
    fecha: {
      type: Sequelize.DATE,
    },
    descripcion: {
      type: Sequelize.STRING,
    },
  });
  return Transacciones;
};
