import Vue from 'vue';
import api from '@/helpers/api';

const state = {
  created: {
    isLoading: false,
    isLoaded: false,
    messages: [],
  },
};

const mutations = {
  messagesLoading (state, address) {
    if (!address) {
      state.created.isLoading = true;
    } else {
      Vue.set(state, address, {
        isLoading: true,
        isLoaded: state[address] ? state[address].isLoaded : false,
        messages: state[address] ? state[address].messages : [],
      });
    }
  },
  saveCreated (state, created) {
    state.created.isLoading = false;
    state.created.isLoaded = !created.length;
    state.created.messages = state.created.messages.concat(created);
  },
  saveMessages (state, payload) {
    Vue.set(state, payload.address, {
      isLoading: false,
      isLoaded: !payload.messages.length,
      messages: state[payload.address] && state[payload.address].messages
        ? state[payload.address].messages.concat(payload.messages)
        : payload.messages,
    });
  },
};

const actions = {
  getCreated: ({ commit, state }) => {
    if (!state.created.isLoading && !state.created.isLoaded) {
      commit('messagesLoading');
      let params = null;
      if (state.created.messages.length > 0) {
        const lastMessage = state.created.messages.slice().reverse()[0];
        params = { unit: lastMessage.unit, message_index: lastMessage.message_index };
      }
      api.requestAsync('get_created', params).then(created => {
        commit('saveCreated', created);
      });
    }
  },
  getMessages: ({ commit, state }, address) => {
    if (!state[address] || (state[address] && !state[address].isLoading && !state[address].isLoaded)) {
      commit('messagesLoading', address);
      let params = { address };
      if (state[address] && state[address].messages && state[address].messages.length > 0) {
        const lastMessage = state[address].messages.slice().reverse()[0];
        params = { ...params, unit: lastMessage.unit, message_index: lastMessage.message_index };
      }
      api.requestAsync('get_messages', params).then(messages => {
        commit('saveMessages', { messages, address });
      });
    }
  }
};

export default {
  state,
  mutations,
  actions,
};
