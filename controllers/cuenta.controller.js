const db = require("../models");
const Cuenta = db.cuenta;

// Crear una nueva Cuenta
exports.crearCuenta = async (req, res) => {
  try {
    const data = await Cuenta.create(req.body);
    res.status(201).send(data);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Error al crear la cuenta." });
  }
};

// Obtener todas las Cuentas
exports.listaCuentas = async (req, res) => {
  try {
    const data = await Cuenta.findAll({
      order: [["codigo", "ASC"]],
    });
    res.send(data);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Error al obtener las cuentas." });
  }
};

// Obtener una Cuenta por ID
exports.listaCuentaPorID = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Cuenta.findByPk(id, {
      include: ["cuentaPadre", "cuentasHijas"], // Incluye la relación con Cuenta
    });
    if (!data)
      return res.status(404).send({ message: "Cuenta no encontrada." });
    res.send(data);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Error al obtener la cuenta." });
  }
};

// Actualizar una Cuenta
exports.editarCuenta = async (req, res) => {
  const id = req.params.id;
  try {
    const [updated] = await Cuenta.update(req.body, {
      where: { id },
    });
    if (updated) {
      const updatedCuenta = await Cuenta.findByPk(id);
      res.send(updatedCuenta);
    } else {
      res.status(404).send({ message: "Cuenta no encontrada." });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Error al actualizar la cuenta." });
  }
};

// Eliminar una Cuenta
exports.eliminarCuenta = async (req, res) => {
  const id = req.params.id;
  try {
    const deleted = await Cuenta.destroy({
      where: { id },
    });
    if (!deleted) {
      res.status(404).send({ message: "Cuenta no encontrada." });
    } else {
      res.send({ message: "Cuenta eliminada exitosamente." });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Error al eliminar la cuenta." });
  }
};

// Crear cuenta nivel 1, solo se pasa nombre y tipo
exports.crearCuentaNivel1 = async (req, res) => {
  try {
    //get all cuentas nivel 1
    const cuentas = await Cuenta.findAll({
      where: {
        nivel: 1,
      },
    });

    //conseguir el ultimo codigo
    const newCodigo = cuentas.length + 1;
    req.body.codigo = newCodigo;

    const nuevaCuenta = {
      codigo: newCodigo,
      nombre: req.body.nombre,
      tipo: req.body.tipo,
      nivel: 1,
    };

    const data = await Cuenta.create(nuevaCuenta);

    res.status(201).send(data);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Error al crear la cuenta." });
  }
};

// Crear child cuenta, se pasa nombre, cuentaPadreId
exports.crearCuentaHija = async (req, res) => {
  try {
    const idPadre = req.params.id;
    //get cuentaPadre with relation cuentasHijas
    const cuentaPadre = await Cuenta.findByPk(idPadre, {
      include: ["cuentasHijas"],
    });

    //conseguir el ultimo codigo
    const newCodigo = cuentaPadre.cuentasHijas?.length + 1;
    req.body.codigo = cuentaPadre.codigo + "." + newCodigo;
    req.body.nivel = cuentaPadre.nivel + 1;
    req.body.tipo = cuentaPadre.tipo;

    const nuevaCuenta = {
      codigo: req.body.codigo,
      nombre: req.body.nombre,
      tipo: req.body.tipo,
      nivel: req.body.nivel,
      padreId: idPadre,
    };

    const data = await Cuenta.create(nuevaCuenta);
    res.status(201).send(data);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Error al crear la cuenta." });
  }
};

exports.listaCuentasFinales = async (req, res) => {
  try {
    const cuentas = await Cuenta.findAll({
      include: ["cuentasHijas"],
    });

    const cuentasFinales = cuentas.filter(
      (cuenta) => cuenta.cuentasHijas.length === 0
    );

    res.send(cuentasFinales);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Error al obtener las cuentas." });
  }
};

// Se consiguen todas las cuentas finales de los activos, pasivos, patrimonio, ingresos y egresos
exports.listaBalanceGeneral = async (req, res) => {
  try {
    const cuentas = await Cuenta.findAll({
      include: ["cuentasHijas"],
    });

    const cuentasFinales = cuentas.filter(
      (cuenta) => cuenta.cuentasHijas.length === 0
    );

    // Devolver cuentas divididas por tipo
    const tiposPermitidos = ["Activo", "Pasivo", "Patrimonio"];
    const cuentasDivididas = await cuentasFinales.reduce(
      async (accPromise, cuenta) => {
        const acc = await accPromise;
        const tipo = cuenta.tipo;
        if (tiposPermitidos.includes(tipo)) {
          if (!acc[tipo]) {
            acc[tipo] = [];
          }
          // Agregar el atributo total a cada cuenta
          await calcularTotalCuenta(cuenta.id).then((total) => {
            cuenta.dataValues.total = total;
            acc[tipo].push(cuenta);
          });
        }
        return acc;
      },
      Promise.resolve({})
    );

    const totalEjercicio = await calcularResultadoEjercicio(res);

    const cuentaTotalEjercicio = {
      nombre: "Resultado del Ejercicio",
      total: totalEjercicio,
    };

    cuentasDivididas["Patrimonio"] = cuentaTotalEjercicio;

    res.send(cuentasDivididas);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Error al obtener las cuentas." });
  }
};

calcularResultadoEjercicio = async (res) => {
  try {
    const cuentas = await Cuenta.findAll({
      include: ["cuentasHijas"],
    });

    const cuentasFinales = cuentas.filter(
      (cuenta) => cuenta.cuentasHijas.length === 0
    );

    // Devolver cuentas divididas por tipo
    const tiposPermitidos = ["Ingreso", "Egreso"];
    const cuentasDivididas = await cuentasFinales.reduce(
      async (accPromise, cuenta) => {
        const acc = await accPromise;
        const tipo = cuenta.tipo;
        if (tiposPermitidos.includes(tipo)) {
          if (!acc[tipo]) {
            acc[tipo] = [];
          }
          // Agregar el atributo total a cada cuenta
          await calcularTotalCuenta(cuenta.id).then((total) => {
            cuenta.dataValues.total = total;
            acc[tipo].push(cuenta);
          });
        }
        return acc;
      },
      Promise.resolve({})
    );

    const totalResultado =
      cuentasDivididas["Ingreso"].reduce(
        (acc, cuenta) => acc + cuenta.dataValues.total,
        0
      ) -
      cuentasDivididas["Egreso"].reduce(
        (acc, cuenta) => acc + cuenta.dataValues.total,
        0
      );

    return totalResultado;
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Error al obtener las cuentas." });
  }
};

// Se consiguen todas las cuentas finales de los ingresos y egresos
exports.listaEstadoResultados = async (req, res) => {
  try {
    const cuentas = await Cuenta.findAll({
      include: ["cuentasHijas"],
    });

    const cuentasFinales = cuentas.filter(
      (cuenta) => cuenta.cuentasHijas.length === 0
    );

    //devolver cuentas divididas por tipo
    const tiposPermitidos = ["Ingreso", "Egreso"];
    const cuentasDivididas = await cuentasFinales.reduce(
      async (accPromise, cuenta) => {
        const acc = await accPromise;
        const tipo = cuenta.tipo;
        if (tiposPermitidos.includes(tipo)) {
          if (!acc[tipo]) {
            acc[tipo] = [];
          }
          // Add total attribute to cuenta
          await calcularTotalCuenta(cuenta.id).then((total) => {
            cuenta.dataValues.total = total;
            acc[tipo].push(cuenta);
          });
        }
        return acc;
      },
      Promise.resolve({})
    );

    res.send(cuentasDivididas);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Error al obtener las cuentas." });
  }
};

// calcular total de cuenta
calcularTotalCuenta = async (id) => {
  try {
    //conseguir el total de debe haber de cuenta
    const cuenta = await Cuenta.findByPk(id, {
      include: ["detallesTransacciones"],
    });
    let totalDebe = 0;
    let totalHaber = 0;

    cuenta.detallesTransacciones.forEach((detalle) => {
      totalDebe += detalle.debe;
      totalHaber += detalle.haber;
    });

    if (cuenta.tipo === "Activo" || cuenta.tipo === "Egreso") {
      return totalDebe - totalHaber;
    }
    //else
    return totalHaber - totalDebe;
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Error al obtener las cuentas." });
  }
};

// obtener total por anio,mes
exports.listaFlujoEfectivo = async (req, res) => {
  try {
    const cuentas = await Cuenta.findAll({
      include: ["cuentasHijas"],
    });

    const cuentasFinales = cuentas.filter(
      (cuenta) => cuenta.cuentasHijas.length === 0
    );

    //devolver cuentas divididas por tipo
    const tiposPermitidos = ["Ingreso", "Egreso"];
    const cuentasDivididas = await cuentasFinales.reduce(
      async (accPromise, cuenta) => {
        const acc = await accPromise;
        const tipo = cuenta.tipo;
        if (tiposPermitidos.includes(tipo)) {
          if (!acc[tipo]) {
            acc[tipo] = [];
          }
          // Add total por mes attribute to cuenta
          await calcularTotalCuentaPorMes(cuenta.id, res).then(
            (totalPorMes) => {
              cuenta.dataValues.totalPorMes = totalPorMes;
              acc[tipo].push(cuenta);
            }
          );
        }
        return acc;
      },
      Promise.resolve({})
    );

    res.send(cuentasDivididas);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Error al obtener las cuentas." });
  }
};

calcularTotalCuentaPorMes = async (id, res) => {
  try {
    //conseguir el total de debe haber de cuenta
    const cuenta = await Cuenta.findByPk(id, {
      include: [
        {
          association: "detallesTransacciones",
          include: ["transacciones", "libroDiario"],
        },
      ],
    });
    let totalPorMes = {};
    
    cuenta.detallesTransacciones.forEach((detalle) => {
      const fecha = detalle.libroDiario?.fecha;
      if (fecha instanceof Date) {
        const anio = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // Months are zero-based
        if (!totalPorMes[anio]) {
          totalPorMes[anio] = {};
        }
        if (!totalPorMes[anio][mes]) {
          totalPorMes[anio][mes] = 0;
        }
        if (cuenta.tipo === "Ingreso") {
          totalPorMes[anio][mes] += detalle.haber - detalle.debe;
        } else {
          totalPorMes[anio][mes] += detalle.debe - detalle.haber;
        }
      }
    });

    console.log(totalPorMes);

    return totalPorMes;
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Error al obtener las cuentas." });
  }
};

//obtener todas las cuentas finales con su debe y haber
exports.listaBalanceComprobacion = async (req, res) => {
  try {
    const cuentas = await Cuenta.findAll({
      include: ["cuentasHijas"],
    });

    const cuentasFinales = cuentas.filter(
      (cuenta) => cuenta.cuentasHijas.length === 0
    );

    //devolver cuentas divididas por tipo
    const cuentasDivididas = await cuentasFinales.reduce(
      async (accPromise, cuenta) => {
        const acc = await accPromise;
        if (!acc[cuenta.tipo]) {
          acc[cuenta.tipo] = [];
        }
        // Add total attribute to cuenta
        await totalDebeHaber(cuenta.id).then((total) => {
          cuenta.dataValues.totalDebe = total.totalDebe;
          cuenta.dataValues.totalHaber = total.totalHaber;
          acc[cuenta.tipo].push(cuenta);
        });
        return acc;
      },
      Promise.resolve({})
    );

    res.send(cuentasDivididas);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Error al obtener las cuentas." });
  }
};

totalDebeHaber = async (id) => {
  try {
    //conseguir el total de debe haber de cuenta
    const cuenta = await Cuenta.findByPk(id, {
      include: ["detallesTransacciones"],
    });
    let totalDebe = 0;
    let totalHaber = 0;

    cuenta.detallesTransacciones.forEach((detalle) => {
      totalDebe += detalle.debe;
      totalHaber += detalle.haber;
    });

    return { totalDebe, totalHaber };
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Error al obtener las cuentas." });
  }
};
