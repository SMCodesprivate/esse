// 0 é igual a "Por favor marque um staffer assim: @staffer"
// 1 é igual a "Por favor agora digite uma nota para o staffer marcado"
// 2 é igual a "Por favor agora digite uma mensagem de classificação"
var users = [];

function add(user_id, id) {
  var user = {
    id: user_id,
    level: 0,
    _id: id
  }
  return users.push(user);
}

function search(position) {
  return users[position];
}

function is(user_id) {
  var usersid = [];
  users.map(user => {
    usersid.push(user.id);
  });
  return usersid.indexOf(user_id);
}

function up(location) {
  return users[location].level = Number(users[location].level)+1;
}

function remove(location) {
  return users.shift(location);
}

module.exports = {
  add,
  is,
  up,
  remove,
  search
};