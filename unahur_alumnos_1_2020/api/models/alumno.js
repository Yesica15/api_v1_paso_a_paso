'use strict';
module.exports = (sequelize, DataTypes) => {
  const alumno = sequelize.define('alumno', {
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    email: DataTypes.STRING,
    fechaNacimiento: DataTypes.DATE,
    id_carrera: DataTypes.INTEGER
  }, {});
  alumno.associate = function(models) {
    alumno.belongsTo(models.carrera// modelo al que pertenece
      ,{
        as : 'Carrera-Inscripta',  // nombre de mi relacion
        foreignKey: 'id_carrera'     // campo con el que voy a igualar
      })
  };
  return alumno;
};