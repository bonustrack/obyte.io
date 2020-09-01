import crypto from 'crypto';
import axios from 'axios';
import Mnemonic from 'bitcore-mnemonic';
import Promise from 'bluebird';
import { toWif, getChash160 } from 'obyte/lib/utils';
import store from '@/store';
import utils from '@/helpers/utils';
import client from '@/helpers/client';
import api from '@/helpers/api';

const state = {
  rate: {},
  address: null,
  name: null,
  pubkey: null,
  seed: null,
  hasBackup: null,
  balances: null,
  balancesIsLoading: false,
  balancesIsLoaded: false,
  unspent: null,
  witnesses: [],
  attestors: [],
  oracles: [],
  dapps: [],
  assets: [],
  assetsIsLoading: false,
  assetsIsLoaded: false,
  bots: [],
  path: null,
  definition: null,
  hasUserList: !!localStorage.getItem('userList'),
};

/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
const mutations = {
  saveRate(state, rate) {
    state.rate = rate;
  },
  loginUser(state, {
    address,
    name,
    path,
    pubkey,
    definition,
    seed,
    hasBackup,
  }) {
    state.address = address;
    state.name = name;
    state.path = path;
    state.pubkey = pubkey;
    state.definition = definition;
    state.seed = seed;
    state.hasBackup = hasBackup;
  },
  balancesIsLoading(state) {
    state.balancesIsLoading = true;
  },
  saveBalances(state, { unspent, balances }) {
    state.balancesIsLoaded = true;
    state.balancesIsLoading = false;
    state.balances = balances;
    state.unspent = unspent;
  },
  saveWitnesses(state, witnesses) {
    state.witnesses = witnesses;
  },
  saveAttestors(state, attestors) {
    state.attestors = attestors;
  },
  saveOracles(state, oracles) {
    state.oracles = oracles;
  },
  saveBots(state, bots) {
    state.bots = bots;
  },
  saveDapps(state, dapps) {
    state.dapps = dapps;
  },
  assetsIsLoading(state) {
    state.assetsIsLoading = true;
  },
  saveAssets(state, assets) {
    state.assetsIsLoaded = true;
    state.assetsIsLoading = false;
    state.assets = assets;
  },
};

const actions = {
  getBalances: ({ commit, state }) => {
    commit('balancesIsLoading');
    client.api.getWitnesses().then((witnesses) => {
      client.api.getHistory({ witnesses, addresses: [state.address] }).then((history) => {
        const unspent = utils.getUnspent(history, [state.address]);
        const balances = utils.getBalances(unspent);
        commit('saveBalances', { unspent, balances });
      });
    });
  },
  getRate: ({ commit }) => {
    axios.get('https://api.coinpaprika.com/v1/tickers/gbyte-obyte?quotes=USD,BTC').then((response) => {
      if (response.data && response.data.quotes) {
        commit('saveRate', response.data.quotes);
      }
    }).catch(err => console.error(err.response.statusText, err.response.request.res.responseUrl));
  },
  createAccount: ({ commit }, {
    name,
    seed = utils.generateRandomSeed(),
    password,
    path = "m/44'/0'/1'/0/0",
  }) => {
    const mnemonic = new Mnemonic(seed);
    const xPrivKey = mnemonic.toHDPrivateKey();
    const { privateKey } = xPrivKey.derive(path);
    // const privKeyBuf = privateKey.bn.toBuffer({ size: 32 });
    const pubkey = privateKey.publicKey.toBuffer().toString('base64');
    const definition = ['sig', { pubkey }];
    const address = getChash160(definition);

    /** Encrypt seed */
    const cipher = crypto.createCipher('aes192', password);
    let encryptedSeed = cipher.update(seed, 'utf8', 'hex');
    encryptedSeed += cipher.final('hex');

    /** Store encrypted seed on localStorage */
    let userList = localStorage.getItem('userList');
    userList = userList ? JSON.parse(userList) : [];
    userList.push({
      address, name, path, pubkey, definition, encryptedSeed, hasBackup: false,
    });
    localStorage.setItem('userList', JSON.stringify(userList));

    commit('loginUser', {
      address,
      name,
      path,
      pubkey,
      definition,
      seed,
      hasBackup: false,
    });
  },
  login: ({ commit }, { address, password }) => {
    let userList = [];
    try {
      userList = localStorage.getItem('userList');
      userList = JSON.parse(userList);
    } catch (e) {
      console.error('Error localStorage', e);
    }
    const user = userList.find(u => u.address === address);
    return new Promise((resolve, reject) => {
      if (user && user.address) {
        try {
          const decipher = crypto.createDecipher('aes192', password);
          let decrypted = decipher.update(user.encryptedSeed, 'hex', 'utf8');
          decrypted += decipher.final('utf8');

          commit('loginUser', {
            address: user.address,
            name: user.name,
            path: user.path,
            pubkey: user.pubkey,
            definition: user.definition,
            seed: decrypted,
            hasBackup: user.hasBackup,
          });
          store.dispatch('getBalances');
          store.dispatch('getWitnesses');
          resolve();
        } catch (e) {
          console.error('Error password', e);
          reject();
        }
      }
    });
  },
  getWitnesses: ({ commit }) => {
    client.api.getWitnesses().then((witnesses) => {
      commit('saveWitnesses', witnesses);
    });
  },
  getAttestors: ({ commit }) => {
    api.requestAsync('get_attestors', null).then((attestors) => {
      commit('saveAttestors', attestors);
    });
  },
  getOracles: ({ commit }) => {
    api.requestAsync('get_oracles', null).then((oracles) => {
      commit('saveOracles', oracles);
    });
  },
  getBots: ({ commit }) => {
    client.api.getBots().then((bots) => {
      commit('saveBots', bots);
    });
  },
  getDapps: ({ commit }) => {
    api.requestAsync('get_aa_metadata', null).then((dapps) => {
      commit('saveDapps', dapps);
    });
  },
  getAssets: ({ commit }) => {
    commit('assetsIsLoading');
    api.requestAsync('get_asset_metadata', null).then((assets) => {
      commit('saveAssets', assets);
    });
  },
  post: ({ state }, { app, payload }) => new Promise((resolve, reject) => {
    const mnemonic = new Mnemonic(state.seed);
    const xPrivKey = mnemonic.toHDPrivateKey();
    const { privateKey } = xPrivKey.derive(state.path);
    const privKeyBuf = privateKey.bn.toBuffer({ size: 32 });
    const wif = toWif(privKeyBuf, false);

    client.post.message(app, payload, wif).then(resolve).catch(reject);
  }),
};
/* eslint-enable no-param-reassign */
/* eslint-enable no-shadow */

export default {
  state,
  mutations,
  actions,
};
