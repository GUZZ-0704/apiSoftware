const db = require("../models");
const Administracion = db.administracion;

// Crear una nueva Administración
exports.crearAdministracion = async (req, res) => {
    try {
        const data = await Administracion.create(req.body);
        res.status(201).send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al crear la administración." });
    }
};

// Obtener todas las Administraciones
exports.listaAdministraciones = async (req, res) => {
    try {
        const data = await Administracion.findAll({
            include: ["asientosContables"], // Incluye la relación con Asientos Contables
        });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al obtener las administraciones." });
    }
};

// Obtener una Administración por ID
exports.listaAdministracionPorID = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Administracion.findByPk(id, {
            include: ["asientosContables"], // Incluye la relación con Asientos Contables
        });
        if (!data) return res.status(404).send({ message: "Administración no encontrada." });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al obtener la administración." });
    }
};

// Actualizar una Administración
exports.editarAdministracion = async (req, res) => {
    const id = req.params.id;
    try {
        const [updated] = await Administracion.update(req.body, {
            where: { id },
        });
        if (updated) {
            const updatedAdministracion = await Administracion.findByPk(id);
            res.send(updatedAdministracion);
        } else {
            res.status(404).send({ message: "Administración no encontrada." });
        }
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al actualizar la administración." });
    }
};

// Eliminar una Administración
exports.eliminarAdministracion = async (req, res) => {
    const id = req.params.id;
    try {
        const deleted = await Administracion.destroy({
            where: { id },
        });
        if (deleted) {
            res.send({ message: "Administración eliminada correctamente." });
        } else {
            res.status(404).send({ message: "Administración no encontrada." });
        }
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al eliminar la administración." });
    }
};

const usuarioController = require("./usuario.controller");
const asientoContableController = require("./asientoContable.controller");
const costoFijoController = require("./costoFijo.controller");
const proyectoController = require("./proyecto.controller");

exports.getGestionActual = async (req, res) => {
    try {
        const data = await Administracion.findAll({
            attributes: ["gestion"],
            group: ["gestion"],
        });
        let gestionActual = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i].gestion > gestionActual) {
                gestionActual = data[i].gestion;
            }
        }
        if (!data) return res.status(404).send({ message: "Gestión no encontrada." });
        res.send({ gestion: gestionActual });
        return gestionActual;
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al obtener la gestión." });
    }
}

exports.getMesActual = async (req, res) => {
    try {
        this.getGestionActual();
        const data = await Administracion.findAll({
            where: {
                gestion: gestionActual,
            },
            attributes: ["mes"],
            group: ["mes"],
        });

        let mesActual = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i].mes > mesActual) {
                mesActual = data[i].mes;
            }
        }
        if (!data) return res.status(404).send({ message: "Mes no encontrado." });
        res.send({ mes: mesActual });
        return mesActual;
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al obtener el mes." });
    }
}

exports.cambiarMes = async (req, res) => {
    try{
        mesActual = this.getMesActual();
        gestionActual = this.getGestionActual();
        if(mesActual === 12){
            nuevaAdministracion = {
                gestion: gestionActual + 1,
                mes: 1,
                informe: "",
            };
            await Administracion.create(nuevaAdministracion);
        }else{
            nuevaAdministracion = {
                gestion: gestionActual,
                mes: mesActual + 1,
                informe: "",
            };
            await Administracion.create(nuevaAdministracion);
        }
    }catch(error){
        res.status(500).send({ message: error.message || "Error al cambiar el mes." });
    }
}

generarSueldosPorMes = async (mes, gestion) => {
    try {
        const trabajadores = await usuarioController.listaUsuarios();
        for (let i = 0; i < trabajadores.length; i++) {
            const trabajador = trabajadores[i];
            const sueldo = trabajador.rol.sueldo;
            const asientoContable = {
                fecha: new Date(1, mes, gestion),
                concepto: `Sueldo de ${trabajador.nombre} del mes ${mes} del año ${gestion}`,
                debe: sueldo,
                haber: 0,
                saldo: sueldo,
                tipo: "Sueldo",
                administracionId: 0,
            };
            const sueldos = sueldos.append(asientoContable);
        }
        return sueldos;
    } catch (error) {
        console.log(error);
    }
}

generarCostoFijoPorMes = async (mes, gestion) => {
    try {
        const costosFijos = await costoFijoController.listaCostosFijos();
        for (let i = 0; i < costosFijos.length; i++) {
            const costoFijo = costosFijos[i];
            const asientoContable = {
                fecha: new Date(1, mes, gestion),
                concepto: `Costo fijo de ${costoFijo.nombre} del mes ${mes} del año ${gestion}`,
                debe: costoFijo.monto,
                haber: 0,
                saldo: costoFijo.monto,
                tipo: "Costo Fijo",
                administracionId: 0,
            };
            const costos = costos.append(asientoContable);
        }
        return costos;
    } catch (error) {
        console.log(error);
    }
}

generarGananciasEnProyectosPorMes = async (mes, gestion) => {
    try {
        const proyectos = await proyectoController.getProyectosPorMesyGestion(mes, gestion);
        for (let i = 0; i < proyectos.length; i++) {
            const proyecto = proyectos[i];
            const asientoContable = {
                fecha: proyecto.fechaInicio,
                concepto: `Ganancias en el proyecto ${proyecto.nombre} del mes ${mes} del año ${gestion}`,
                debe: 0,
                haber: proyecto.precio,
                saldo: proyecto.precio,
                tipo: "Ganancias en Proyecto",
                administracionId: 0,
            };
            const ganancias = ganancias.append(asientoContable);
        }
        return ganancias;
    } catch (error) {
        console.log(error);
    }
}

generarCostosdeInventariodeProyectosPorMes = async (mes, gestion) => {
    try {
        const proyectos = await proyectoController.getProyectosPorMesyGestion(mes, gestion);
        for (let i = 0; i < proyectos.length; i++) {
            const proyecto = proyectos[i];
            const inventarios = proyecto.inventarios;
            for (let j = 0; j < inventarios.length; j++) {
                const inventario = inventarios[j];
                const asientoContable = {
                    fecha: proyecto.fechaInicio,
                    concepto: `Costos de inventario en el proyecto ${proyecto.nombre} del mes ${mes} del año ${gestion}`,
                    debe: inventario.precio,
                    haber: 0,
                    saldo: inventario.precio,
                    tipo: "Costos de Inventario",
                    administracionId: 0,
                };
                const costos = costos.append(asientoContable);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

exports.getContabilidadPorMesyGestion = async (req, res) => {
    try {
        mes = req.params.mes;
        gestion = req.params.gestion;
        const administracion = await Administracion.findOne({
            where: {
                mes: mes,
                gestion: gestion,
            },
        });
        const sueldos = await generarSueldosPorMes(mes, gestion);
        const costos = await generarCostoFijoPorMes(mes, gestion);
        const ganancias = await generarGananciasEnProyectosPorMes(mes, gestion);
        const costosInventario = await generarCostosdeInventariodeProyectosPorMes(mes, gestion);
        const contabilidad = sueldos.concat(costos).concat(ganancias).concat(costosInventario);
        for (let i = 0; i < contabilidad.length; i++) {
            contabilidad[i].administracionId = administracion.id;
            await asientoContableController.crearAsientoContable(contabilidad[i]);
        }
        const data = await Administracion.findOne({
            where: {
                mes: mes,
                gestion: gestion,
            },
            include: ["asientosContables"],
        });
        let totalDebe = 0;
        let totalHaber = 0;
        for (let i = 0; i < data.asientosContables.length; i++) {
            totalDebe += data.asientosContables[i].debe;
            totalHaber += data.asientosContables[i].haber;
        }
        if (totalDebe > totalHaber) {
            data.informe = "Pérdida";
        } else {
            data.informe = "Ganancia";
        }
        res.send(data, totalDebe, totalHaber);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al obtener la contabilidad." });
    }
}

exports.getContabilidadPorGestion = async (req, res) => {
    try {
        gestion = req.params.gestion;
        const administraciones = await Administracion.findAll({
            where: {
                gestion: gestion,
            },
        });
        let totalDebe = 0;
        let totalHaber = 0;
        for (let i = 0; i < administraciones.length; i++) {
            const administracion = administraciones[i];
            const asientosContables = await asientoContableController.getAsientosContablesPorAdministracion(administracion.id);
            for (let j = 0; j < asientosContables.length; j++) {
                totalDebe += asientosContables[j].debe;
                totalHaber += asientosContables[j].haber;
            }
        }
        if (totalDebe > totalHaber) {
            informe = "Pérdida";
        } else {
            informe = "Ganancia";
        }
        res.send({ totalDebe, totalHaber, informe });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error al obtener la contabilidad." });
    }
}

