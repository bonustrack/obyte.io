const express = require('express');
const kbyte = require('kbyte');
const serveStatic = require('serve-static');
const SocketServer = require('ws').Server;
const db = require('./server/db');

const client = new kbyte.Client('wss://byteball.org/bb');
setInterval(() => client.request('heartbeat', null), 10 * 1000);

let app = express();
app.use(serveStatic(__dirname + '/dist'));

app.get('/joint/:unit(*)', function (req, res) {
  const { unit } = req.params;
  client.request('get_joint', unit, function(err, result) {
    res.json(result);
  });
});

app.get('*', function (req, res) {
  res.sendFile(__dirname + '/dist/index.html')
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log('Listening on port ' + port)
});

const wss = new SocketServer({ server });

/** Init websocket server */
wss.on('connection', (ws) => {
  console.log('Got connection from new peer');
  ws.on('message', (message) => {
    console.log('Message', message);
    let call = {};
    try { call = JSON.parse(message); } catch (e) {}
    if (call[0] && call[0] === 'request' && call[1] && call[1].command) {
      const command = call[1].command;
      const params = call[1].params ? call[1].params : null;
      const tag = call[1].tag;
      switch (command) {
        case 'get_timeline': {
          const query = params
            ? ["SELECT * FROM messages WHERE app = 'text' AND unit_creation_date <= (SELECT unit_creation_date FROM messages m2 WHERE m2.unit = $1 AND m2.message_index = $2) AND NOT (unit = $1 AND message_index = $2) ORDER BY unit_creation_date DESC LIMIT 10", [params.unit, params.message_index]]
            : ["SELECT * FROM messages WHERE app = 'text' ORDER BY unit_creation_date DESC LIMIT 10", []];
          db.query(query[0], query[1]).then((response) => {
            console.log('Send get_timeline', JSON.stringify(response));
            ws.send(JSON.stringify(['response', { tag, response }]));
          }).catch((err) => {
            console.log('Query get_timeline failed', err);
          });
          break;
        }
        case 'get_created': {
          const query = params
            ? ["SELECT * FROM messages WHERE app != 'data_feed' AND unit_creation_date <= (SELECT unit_creation_date FROM messages m2 WHERE m2.unit = $1 AND m2.message_index = $2) AND NOT (unit = $1 AND message_index = $2) ORDER BY unit_creation_date DESC LIMIT 10", [params.unit, params.message_index]]
            : ["SELECT * FROM messages WHERE app != 'data_feed' ORDER BY unit_creation_date DESC LIMIT 10", []];
          db.query(query[0], query[1]).then((response) => {
            console.log('Send get_created', JSON.stringify(response));
            ws.send(JSON.stringify(['response', { tag, response }]));
          }).catch((err) => {
            console.log('Query get_created failed', err);
          });
          break;
        }
        case 'get_messages': {
          const query = params.unit
            ? ["SELECT * FROM messages WHERE unit_creation_date <= (SELECT unit_creation_date FROM messages m2 WHERE m2.unit = $2 AND m2.message_index = $3) AND unit_authors ?| array[$1] AND NOT (unit = $2 AND message_index = $3) ORDER BY unit_creation_date DESC LIMIT 10", [params.address ,params.unit, params.message_index]]
            : ["SELECT * FROM messages WHERE unit_authors ?| array[$1] ORDER BY unit_creation_date DESC LIMIT 10", [params.address]];
          db.query(query[0], query[1]).then((response) => {
            console.log('Send get_messages', JSON.stringify(response));
            ws.send(JSON.stringify(['response', { tag, response }]));
          }).catch((err) => {
            console.log('Query get_messages failed', err);
          });
          break;
        }
        case 'get_polls': {
          const query = params
            ? ["SELECT * FROM polls WHERE unit_creation_date <= (SELECT unit_creation_date FROM messages m2 WHERE m2.unit = $1 AND m2.message_index = $2) AND NOT (unit = $1 AND message_index = $2) ORDER BY unit_creation_date DESC LIMIT 10", [params.unit, params.message_index]]
            : ["SELECT * FROM polls ORDER BY unit_creation_date DESC LIMIT 10", []];
          db.query(query[0], query[1]).then((response) => {
            console.log('Send get_polls', JSON.stringify(response));
            ws.send(JSON.stringify(['response', { tag, response }]));
          }).catch((err) => {
            console.log('Query get_polls failed', err);
          });
          break;
        }
        case 'get_votes': {
          const query = ["SELECT * FROM messages WHERE app = 'vote' AND payload->'unit' = to_jsonb(text $1) ORDER BY unit_creation_date DESC LIMIT 10", [params]];
          db.query(query[0], query[1]).then((response) => {
            console.log('Send get_votes', JSON.stringify(response));
            ws.send(JSON.stringify(['response', { tag, response }]));
          }).catch((err) => {
            console.log('Query get_votes failed', err);
          });
          break;
        }
        case 'get_attestors': {
          db.query("SELECT * FROM attestors").then((response) => {
            console.log('Send attestors', JSON.stringify(response));
            ws.send(JSON.stringify(['response', { tag, response }]));
          }).catch((err) => {
            console.log('Query get_attestors failed', err);
          });
          break;
        }
        case 'get_oracles': {
          db.query("SELECT * FROM oracles").then((response) => {
            console.log('Send oracles', JSON.stringify(response));
            ws.send(JSON.stringify(['response', { tag, response }]));
          }).catch((err) => {
            console.log('Query get_oracles failed', err);
          });
          break;
        }
        case 'get_asset_metadata': {
          db.query("SELECT * FROM messages WHERE app = 'data' AND unit_authors ?| array[$1] AND payload->'asset' IS NOT NULL ORDER BY unit_creation_date DESC", ['AM6GTUKENBYA54FYDAKX2VLENFZIMXWG']).then((response) => {
            console.log('Send get_asset_metadata', JSON.stringify(response));
            ws.send(JSON.stringify(['response', { tag, response }]));
          }).catch((err) => {
            console.log('Query get_asset_metadata failed', err);
          });
          break;
        }
        case 'get_profile': {
          db.query("SELECT * FROM messages WHERE app = 'profile' AND unit_authors ?| array[$1] ORDER BY unit_creation_date", [params]).then((response) => {
            const profile = {};
            response.forEach(p => {
              Object.assign(profile, p.payload);
            });
            console.log('Send profile', JSON.stringify(profile));
            ws.send(JSON.stringify(['response', { tag, response: profile }]));
          }).catch((err) => {
            console.log('Query profile failed', err);
          });
          break;
        }
      }
    }
  });
  ws.on('error', () => console.log('Error on connection with peer'));
  ws.on('close', () => console.log('Connection with peer closed'));
});
