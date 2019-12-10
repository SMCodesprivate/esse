var users = [];

function add(user_id, time) {
  return users.push({ id: user_id, time });
}
function infos(position) {
  return users[position];
}
function change(position, qnt) {
  return users[position].time = qnt;
}
function is(user_id) {
  var users_id = [];
  users.map(user => {
    users_id.push(user.id);
  });
  return users_id.indexOf(user_id);
}
function remove(position) {
  return users.shift(position);
}
function down(position, qnt) {
  return users[position].time -= qnt;
}
module.exports = {
  add,
  is,
  remove,
  infos,
  down,
  change
};