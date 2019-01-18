const kbyte = require('kbyte');
const Promise = require('bluebird');

Promise.promisifyAll(kbyte.Client.prototype);
const api = new kbyte.Client('wss://obyte.herokuapp.com');
// const api = new kbyte.Client('ws://localhost:5000');

export default api;
