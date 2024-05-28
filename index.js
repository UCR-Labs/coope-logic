"use strict";

//Incluir todas las clases que desean exportar
const SQLiteFunctions = require("./src/storage/SQLite");
const CacheFunctions = require("./src/storage/Cache");
const LocalStorageFunctions = require("./src/storage/LocalStorage");

module.exports = {
  SQLiteFunctions,
  CacheFunctions,
  LocalStorageFunctions
};
