const db = require("../database/dbConfig");

module.exports = {
  add,
  getBy,
};

function add(user) {
  return db("users").insert(user);
}

function getBy(prop) {
  return db("users").where(prop).first();
}
