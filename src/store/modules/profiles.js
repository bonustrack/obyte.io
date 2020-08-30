import Vue from 'vue';
import api from '@/helpers/api';

const state = {};

const mutations = {
  profileLoading(state, address) {
    Vue.set(state, address, {
      isLoading: true,
      isLoaded: state[address] ? state[address].isLoaded : false,
      profile: state[address] ? state[address].profile : {},
    });
  },
  saveProfile(state, { address, profile }) {
    Vue.set(state, address, {
      isLoading: false,
      isLoaded: true,
      profile,
    });
  },
};

const actions = {
  getProfile: ({ commit, state }, address) => new Promise((resolve, reject) => {
    if (!state[address] || (state[address] && !state[address].isLoading && !state[address].isLoaded)) {
      commit('profileLoading', address);
      api.requestAsync('get_profile', address).then((profile) => {
        commit('saveProfile', { address, profile });
        resolve(profile);
      });
    }
  }),
};

export default {
  state,
  mutations,
  actions,
};
