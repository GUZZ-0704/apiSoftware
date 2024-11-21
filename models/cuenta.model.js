module.exports = (sequelize, Sequelize) => {
  const Cuenta = sequelize.define("cuenta", {
    codigo: {
      type: Sequelize.STRING,
    },
    nombre: {
      type: Sequelize.INTEGER,
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
