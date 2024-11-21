module.exports = (sequelize, Sequelize) => {
  const DetallesTransacciones = sequelize.define("detallesTransacciones", {
    debe: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
      validate: { min: 0 },
    },
    haber: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
      validate: { min: 0 },
    },
  });
  return DetallesTransacciones;
};
