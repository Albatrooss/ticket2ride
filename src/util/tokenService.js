const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'secret';

function createJWT(username) {
  return jwt.sign(
    { username },
    SECRET
  )
}

function setToken(token) {
  localStorage.setItem('ticket-token', token);
}

function setTokenFromUser(user) {
  const t = createJWT(user);
  setToken(t);
}

function getToken() {
  let token = localStorage.getItem('ticket-token');
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp < Date.now() / 1000) {
      localStorage.removeItem('ticket-token');
      token = null;
    }
  }
  return token;
}

function getUserFromToken() {
  const token = getToken();
  return token ? JSON.parse(atob(token.split('.')[1])) : null;
}

function removeToken() {
  localStorage.removeItem('ticket-token');
}

export default {
  createJWT,
  setToken,
  setTokenFromUser,
  getToken,
  getUserFromToken,
  removeToken
}