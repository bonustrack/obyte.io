const obyte = require('obyte');

const client = new obyte.Client('wss://obyte.org/bb', { reconnect: true });

export default client;
