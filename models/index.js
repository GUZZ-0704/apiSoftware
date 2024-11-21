const dbConfig = require("../database/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: "mysql",
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.asientoContable = require("./asientoContable.model.js")(
  sequelize,
  Sequelize
);
db.usuario = require("./usuario.model.js")(sequelize, Sequelize);
db.inventario = require("./inventario.model.js")(sequelize, Sequelize);
db.administracion = require("./administracion.model.js")(sequelize, Sequelize);
db.proyecto = require("./proyecto.model.js")(sequelize, Sequelize);
db.tarea = require("./tarea.model.js")(sequelize, Sequelize);
db.rol = require("./rol.model.js")(sequelize, Sequelize);
db.costoFijo = require("./costoFijo.model.js")(sequelize, Sequelize);

//un usuario tiene un rol
db.usuario.belongsTo(db.rol, {
  foreignKey: "rolId",
  as: "rol",
});

//un proyecto tiene un administrador(usuario)
db.proyecto.belongsTo(db.usuario, {
  foreignKey: "usuarioId",
  as: "administrador",
});
//un usuario tiene muchos proyectos
db.usuario.hasMany(db.proyecto, {
  as: "proyectosAdministrados",
});

//un proyecto tiene muchos usuarios(equipo)
db.proyecto.belongsToMany(db.usuario, {
  through: "proyecto_usuario",
  as: "equipo",
  foreignKey: "proyectoId",
  otherKey: "usuarioId",
});
//un proyecto puede tener n inventario
db.proyecto.hasMany(db.inventario, {
  as: "inventarios",
});

//un usuario tiene muchos proyectos
db.usuario.belongsToMany(db.proyecto, {
  through: "proyecto_usuario",
  as: "proyectosParticipados",
  foreignKey: "usuarioId",
  otherKey: "proyectoId",
});

//un proyecto tiene muchas tareas
db.proyecto.hasMany(db.tarea, {
  as: "tareas",
});
//una tarea pertenece a un proyecto
db.tarea.belongsTo(db.proyecto, {
  foreignKey: "proyectoId",
  as: "proyecto",
});
//una tarea puede cambiar de estado con un usuario
db.tarea.belongsTo(db.usuario, {
  foreignKey: "usuarioId",
  as: "usuario",
});

//una administracion tiene muchos asientos contables
db.administracion.hasMany(db.asientoContable, {
  as: "asientosContables",
});

//contabilidad
db.cuenta = require("./cuenta.model.js")(sequelize, Sequelize);
db.detalleTransaccion = require("./detalleTransaccion.model.js")(
  sequelize,
  Sequelize
);
db.libroDiario = require("./libroDiario.model.js")(sequelize, Sequelize);
db.transacciones = require("./transacciones.model.js")(sequelize, Sequelize);

//relaciones contabilidad
db.cuenta.hasMany(db.detalleTransaccion, {
    foreignKey: "cuentaId",
  as: "detallesTransacciones",
});

db.cuenta.belongsTo(db.cuenta, {
  foreignKey: "padreId",
  as: "cuentaPadre",
});

db.cuenta.hasMany(db.cuenta, {
  foreignKey: "padreId",
  as: "cuentasHijas",
});

db.transacciones.hasMany(db.detalleTransaccion, {
    foreignKey: "transaccionesId",
    as: "detallesTransacciones",
});

db.transacciones.belongsTo(db.libroDiario, {
  foreignKey: "libroDiarioId",
  as: "libroDiario",
});

db.libroDiario.hasMany(db.transacciones, {
  foreignKey: "libroDiarioId",
  as: "transacciones",
});

db.libroDiario.hasMany(db.detalleTransaccion, {
    foreignKey: "libroDiarioId",
  as: "detallesTransacciones",
});

db.detalleTransaccion.belongsTo(db.cuenta, {
  foreignKey: "cuentaId",
  as: "cuenta",
});

db.detalleTransaccion.belongsTo(db.transacciones, {
  foreignKey: "transaccionesId",
  as: "transacciones",
});

db.detalleTransaccion.belongsTo(db.libroDiario, {
  foreignKey: "libroDiarioId",
  as: "libroDiario",
});

module.exports = db;
