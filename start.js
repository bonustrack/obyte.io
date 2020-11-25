const express = require('express');
const kbyte = require('kbyte');
const SocketServer = require('ws').Server;
const moment = require('moment');
const db = require('./server/db');
const writer = require('./server/writer');

if (process.env.SINGLE_PROCESS) {
  const { replay } = require('./server/replay'); // eslint-disable-line global-require
  replay.start();
}

const client = new kbyte.Client(process.env.RELAY_WS || 'wss://obyte.org/bb');
setInterval(() => client.request('heartbeat', null), 7 * 1000);

const hideFromTimeline = [
  'RD7NA7Y36HCI7IFUUOSKBE5IG3MPKVY7', // temperature spam
  'R3GLJ26HT2VTMIJUO3ZU5EYXOUCYJKEH', // temperature spam
  'YKDZGSVK6FYGHTCDIW6CDTW5F4CSURY7', // t1/reserve manager bot (old)
  'HQNGJWHIFD7IU2JECPKSYEN52OSJUNCZ', // t1/reserve manager bot (old)
  'EIKC7VROSE2MZQ64QTKTW7DCYAYRMJ7A', // t1/reserve manager bot
  'USKWYTYD4NKBIOGPFGROG5NNTQQLISYB', // t1/reserve arb aa
  '6KGD2SIKEIMWKUWC5E5265JKMMZHFWF2', // t1/reserve arb aa
  '6DV4SOBQ5XCC44242HTRXJMRQUXYZFSI', // t1/reserve arb aa
  'V7Y7N7HPF3BFAQOHG7R77JRGZA7CM7VA', // t1/reserve arb aa
  'YSGAUS4DWUORJMV3TEZXPCAEFCT4FGO3', // t1/reserve arb aa
  'Y3NP6UMNFMA6DU2DGPJN4HB65KHKVAKR', // t1/reserve arb aa
  'PVL22DMGM57FOYKJRPKMQBFM2BUSJLDU', // t1/reserve arb aa
  '2G4AZXBKO3XDD5JE2D3DI3UY7N35TVCE', // t2/stable manager bot
  'BCMFNDHNQDEECEWAKUXYIHFE6GXAJ2F6', // t2/stable arb aa
  '55M2H457UQHWGADDELAM2SZZJOUPDRS5', // t2/stable manager bot
  'ENVRH2JPPWBVD7A2FXPMSV6WV5M75T7A', // t2/stable arb aa
  '3H2CB4TR3DDEJUKZZU23UAVL3CD5HDQO', // t2/stable manager bot
  'ED4PXGI5HOOKMMQAOWZAOF6E3GS5JBEJ', // t2/stable arb aa
  'TJCYEZEDAXVMTU3MUYHVOBALD2JSTK7F', // t1/reserve manager bot
  '2SC5S623JW4F34MQLLJ2MABCTA2WQEEQ', // t1/reserve arb aa
  '3SYDJCUOP44TY77IKNEQAHAKTTMXC24D', // t1/reserve arb aa
  'DM33UCESEZQMNW4HWCB4AIYBBIS3YTZC', // t1/reserve arb aa
  'NOA6IFLWCJIWMTFYVT3HQJTNKX4LJEBX', // t1/reserve arb aa
  'PFENOZC7PPDKUORSMIAD2LMHBKN6G5VT', // t1/reserve arb aa
  'DDELYLL2B74T7VRGHERQJH5AVAXV7NZM', // t1/reserve arb aa
  'NW5W2VHBNQQQ53MEMKKORF53BRMTDKEX', // t1/reserve arb aa
  'ELC727CRYVYXMAQJYHY6SF2XNVLTHOKZ', // t1/reserve arb aa
];
const assetRegistries = ['AM6GTUKENBYA54FYDAKX2VLENFZIMXWG', 'O6H6ZIFI57X3PLTYHOCVYPP5A553CYFQ'];

const app = express();
app.use(express.static(`${__dirname}/dist`));

app.get('/joint/:unit(*)', (req, res) => {
  const { unit } = req.params;
  client.request('get_joint', unit, (err, result) => {
    if (!result.joint) return res.json({ error: result });
    db.query('SELECT * FROM messages LEFT JOIN doc_urls USING (unit) WHERE messages.unit = $1', [unit]).then((messages) => {
      let outdatedMeta = false;
      if (messages.length) {
        messages.forEach((message) => {
          if (message.fetch_date && message.fetch_date < moment().subtract(1, 'weeks')) {
            outdatedMeta = true;
          }
        });
        if (!outdatedMeta) return;
      }
      writer.indexJoints([result]).then(() => {
        console.log('express indexJoints success', unit);
      }).catch((err2) => {
        console.error('express indexJoints failure', err2);
      });
    });
    return res.json(result.joint);
  });
});

app.get('*', (req, res) => {
  res.sendFile(`${__dirname}/dist/index.html`);
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log('Listening on port', port);
});

const wss = new SocketServer({ server });

/** Init websocket server */
wss.on('connection', (ws) => {
  console.log('Got connection from new peer');
  ws.on('message', (message) => {
    // console.log('Message', message);
    let call = {};
    try { call = JSON.parse(message); } catch (e) {}
    if (call[0] && call[0] === 'request' && call[1] && call[1].command) {
      const { command, params, tag } = call[1];
      switch (command) {
        case 'get_timeline': {
          const query = params
            ? ["SELECT * FROM messages WHERE app = 'text' AND unit_creation_date <= (SELECT unit_creation_date FROM messages m2 WHERE m2.unit = $1 AND m2.message_index = $2) AND NOT (unit = $1 AND message_index = $2) ORDER BY unit_creation_date DESC LIMIT 10", [params.unit, params.message_index]]
            : ["SELECT * FROM messages WHERE app = 'text' ORDER BY unit_creation_date DESC LIMIT 10", []];
          db.query(query[0], query[1]).then((response) => {
            console.log('Send get_timeline', params);
            ws.send(JSON.stringify(['response', { tag, response }]));
          }).catch((err) => {
            console.error('Query get_timeline failed', err);
          });
          break;
        }
        case 'get_created': {
          const query = params
            ? ["SELECT * FROM messages WHERE app != 'data_feed' AND unit_creation_date <= (SELECT unit_creation_date FROM messages m2 WHERE m2.unit = $1 AND m2.message_index = $2) AND NOT (unit = $1 AND message_index = $2) AND NOT unit_authors ?| $3 ORDER BY unit_creation_date DESC LIMIT 10", [params.unit, params.message_index, hideFromTimeline]]
            : ["SELECT * FROM messages WHERE app != 'data_feed' AND NOT unit_authors ?| $1 ORDER BY unit_creation_date DESC LIMIT 10", [hideFromTimeline]];
          db.query(query[0], query[1]).then((response) => {
            console.log('Send get_created', params);
            ws.send(JSON.stringify(['response', { tag, response }]));
          }).catch((err) => {
            console.error('Query get_created failed', err);
          });
          break;
        }
        case 'get_messages': {
          const query = params.unit
            ? ['SELECT * FROM messages WHERE unit_creation_date <= (SELECT unit_creation_date FROM messages m2 WHERE m2.unit = $2 AND m2.message_index = $3) AND unit_authors ?| array[$1] AND NOT (unit = $2 AND message_index = $3) ORDER BY unit_creation_date DESC LIMIT 10', [params.address, params.unit, params.message_index]]
            : ['SELECT * FROM messages WHERE unit_authors ?| array[$1] ORDER BY unit_creation_date DESC LIMIT 10', [params.address]];
          db.query(query[0], query[1]).then((response) => {
            console.log('Send get_messages', params);
            ws.send(JSON.stringify(['response', { tag, response }]));
          }).catch((err) => {
            console.error('Query get_messages failed', err);
          });
          break;
        }
        case 'get_polls': {
          const query = params
            ? ['SELECT * FROM polls WHERE unit_creation_date <= (SELECT unit_creation_date FROM messages m2 WHERE m2.unit = $1 AND m2.message_index = $2) AND NOT (unit = $1 AND message_index = $2) ORDER BY unit_creation_date DESC LIMIT 10', [params.unit, params.message_index]]
            : ['SELECT * FROM polls ORDER BY unit_creation_date DESC LIMIT 10', []];
          db.query(query[0], query[1]).then((response) => {
            console.log('Send get_polls', params);
            ws.send(JSON.stringify(['response', { tag, response }]));
          }).catch((err) => {
            console.error('Query get_polls failed', err);
          });
          break;
        }
        case 'get_votes': {
          const query = ["SELECT * FROM messages WHERE app = 'vote' AND payload->'unit' = to_jsonb(text $1) ORDER BY unit_creation_date DESC LIMIT 10", [params]];
          db.query(query[0], query[1]).then((response) => {
            console.log('Send get_votes', params);
            ws.send(JSON.stringify(['response', { tag, response }]));
          }).catch((err) => {
            console.error('Query get_votes failed', err);
          });
          break;
        }
        case 'get_attestors': {
          db.query('SELECT * FROM attestors').then((response) => {
            console.log('Send attestors');
            ws.send(JSON.stringify(['response', { tag, response }]));
          }).catch((err) => {
            console.error('Query get_attestors failed', err);
          });
          break;
        }
        case 'get_oracles': {
          db.query('SELECT * FROM oracles').then((response) => {
            console.log('Send oracles');
            ws.send(JSON.stringify(['response', { tag, response }]));
          }).catch((err) => {
            console.error('Query get_oracles failed', err);
          });
          break;
        }
        case 'get_aa_metadata': {
          db.query('SELECT * FROM doc_urls JOIN messages USING (unit) WHERE source IS NOT NULL ORDER BY unit_creation_date DESC', []).then((response) => {
            console.log('Send get_aa_metadata');
            ws.send(JSON.stringify(['response', { tag, response }]));
          }).catch((err) => {
            console.error('Query get_aa_metadata failed', err);
          });
          break;
        }
        case 'get_asset_metadata': {
          db.query("SELECT * FROM messages WHERE app = 'data' AND unit_authors ?| $1 AND payload->'asset' IS NOT NULL ORDER BY unit_creation_date DESC", [assetRegistries]).then((response) => {
            const assets = response
              .filter((v, i, a) => a.findIndex(t => (t.payload.asset === v.payload.asset)) === i)
              .reduce((accum, currentVal) => {
                const newArray = accum;
                let assetName = currentVal.payload.name;
                assetName += currentVal.payload.ticker ? ` ($${currentVal.payload.ticker})` : '';
                newArray.push({
                  assetId: currentVal.payload.asset,
                  assetName,
                  shortName: currentVal.payload.shortName,
                  name: currentVal.payload.name,
                  ticker: currentVal.payload.ticker,
                  decimals: currentVal.payload.decimals || 0,
                  metaUnit: currentVal.unit,
                  description: currentVal.payload.description,
                  issuer: currentVal.payload.issuer,
                });
                return newArray;
              }, []);
            console.log('Send get_asset_metadata');
            ws.send(JSON.stringify(['response', { tag, response: assets }]));
          }).catch((err) => {
            console.error('Query get_asset_metadata failed', err);
          });
          break;
        }
        case 'get_profile': {
          db.query("SELECT * FROM messages WHERE app = 'profile' AND unit_authors ?| array[$1] ORDER BY unit_creation_date", [params]).then((response) => {
            const profile = {};
            response.forEach((p) => {
              Object.assign(profile, p.payload);
            });
            console.log('Send profile', params);
            ws.send(JSON.stringify(['response', { tag, response: profile }]));
          }).catch((err) => {
            console.error('Query profile failed', err);
          });
          break;
        }
      }
    }
  });
  ws.on('error', () => console.error('Error on connection with peer'));
  ws.on('close', () => console.log('Connection with peer closed'));
});
