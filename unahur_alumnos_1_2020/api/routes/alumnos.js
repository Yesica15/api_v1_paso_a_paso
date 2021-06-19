var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {
  console.log("Esto es un mensaje para ver en consola");
  models.alumno
  .findAll({
    attributes: ["id","nombre","apellido","email","fechaNacimiento","id_carrera"],
      
      include:[{as:'Carrera-Inscripta', model:models.carrera, attributes: ["id","nombre"]}]
    })
    .then(alumno => res.send(alumno))
    .catch(() => res.sendStatus(500));
});

router.get("/pag", (req, res) => {
  console.log("Esto es un mensaje para ver en consola");
  //recibo los valores
  const pagina = parseInt(req.query.paginaActual)
  const cant = parseInt(req.query.cantidadAVer)
  const inicio = (pagina-1)*cant
  //Los convierto en números para usar
  models.alumno
  .findAll({
    offset: inicio,
    limit: cant,
    attributes: ["id","nombre","apellido","email","fechaNacimiento","id_carrera"],
      include:[{as:'Carrera-Inscripta', model:models.carrera, attributes: ["id","nombre"]}]
    })
    .then(alumno => res.send(alumno))
    .catch(() => res.sendStatus(500));
});

router.post("/", (req, res) => {
  models.alumno
    .create({ nombre: req.body.nombre, apellido: req.body.apellido, 
        email:req.body.email, fechaNacimiento: req.body.fechaNacimiento, id_carrera: req.body.id_carrera})
    .then(alumno => res.status(201).send({ id: alumno.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otro alumno con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findAlumno = (id, { onSuccess, onNotFound, onError }) => {
  models.alumno
    .findOne({
      attributes: ["id","nombre","apellido","email","fechaNacimiento","id_carrera"],
      where: { id }
    })
    .then(alumno => (alumno ? onSuccess(alumno) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findAlumno(req.params.id, {
    onSuccess: alumno => res.send(alumno),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = alumno =>
    alumno
    .update({ nombre: req.body.nombre, 
       id_carrera: req.body.id_carrera}, 
       { fields: ["nombre"] ["id_carrera"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otro alumno con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = alumno =>
    alumno
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;