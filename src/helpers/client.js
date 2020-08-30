const obyte = require('obyte');

const client = new obyte.Client(process.env.HUB_WS || 'wss://obyte.org/bb', { reconnect: true });

export default client;
