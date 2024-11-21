module.exports = (sequelize, Sequelize) => {
  const Cuenta = sequelize.define("cuenta", {
    codigo: {
      type: Sequelize.STRING,
    },
    nombre: {
      type: Sequelize.STRING,
    },
    tipo: {
      type: Sequelize.STRING,
    },
    nivel: {
      type: Sequelize.INTEGER,
    },
  });
  return Cuenta;
};
