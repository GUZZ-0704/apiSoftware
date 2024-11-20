module.exports = app => {
    require('./administracion.routes')(app);
    require('./asientoContable.routes')(app);
    require('./inventario.routes')(app);
    require('./proyecto.routes')(app);
    require('./tarea.routes')(app);
    require('./costoFijo.routes')(app);
    require('./usuario.routes')(app);
    require('./rol.routes')(app);
}