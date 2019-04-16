import Vue from 'vue';
import Promise from 'bluebird';
import client from '@/helpers/client';

const state = {};

const mutations = {
  attestationsLoading (state, address) {
    Vue.set(state, address, { isLoading: true });
  },
  saveAttestations (state, payload) {
    Vue.set(state, payload.address, {
      isLoading: false,
      isLoaded: true,
      messages: payload.attestations,
    });
  },
};

const actions = {
  getAttestations: ({ commit, state }, address) => {
    if (!state[address] || (state[address] && !state[address].isLoaded)) {
      commit('attestationsLoading', address);
      client.api.getAttestations({ address }).then(attestations => {
        const promises = attestations.map(attestation => client.api.getJoint(attestation.unit));
        Promise.all(promises).then(joints => {
          const attestationsArr  = [];
          joints.forEach(joint => {
            joint.joint.unit.messages.forEach((message, i) => {
              if (message.app === 'attestation') {
                attestationsArr.push({
                  ...message,
                  unit: joint.joint.unit.unit,
                  message_index: i,
                  unit_authors: joint.joint.unit.authors.map(author => author.address),
                  unit_creation_date: new Date(joint.joint.unit.timestamp * 1000),
                  unit_is_stable: joint.joint.ball ? 1 : 0,
                  unit_main_chain_index: joint.joint.unit.main_chain_index,
                });
              }
            });
          });
          commit('saveAttestations', { attestations: attestationsArr, address });
        });
      });
    }
  }
};

export default {
  state,
  mutations,
  actions,
};
