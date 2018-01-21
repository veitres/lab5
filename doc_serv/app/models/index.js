const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../../config/config');
const db = {};

const sequelize = new Sequelize(config.db);

fs.readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== 'index.js'))
  .forEach((file) => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Doctor.belongsTo(db.Spec);

// db.Spec.bulkCreate([
// {spec: "Травмотолог"},
// {spec: "Логопед"},
// {spec: "Психиатор"}
// ]);

// db.Doctor.bulkCreate([
// {fio: "Барулёв Александр Вадимович", SpecId: 1},
// {fio: "Белов Николай Юрьевич", SpecId: 2},
// {fio: "Зотова Татьяна Евгеньевна", SpecId: 3},
// {fio: "Попутников Илья Владимирович", SpecId: 3},
// ]);

module.exports = db;
