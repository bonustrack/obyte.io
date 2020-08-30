import api from '@/helpers/api';

const state = {
  created: {
    isLoading: false,
    isLoaded: false,
    messages: [],
  },
};

const mutations = {
  pollsLoading(state) {
    state.created.isLoading = true;
  },
  savePolls(state, polls) {
    state.created.isLoading = false;
    state.created.isLoaded = !polls.length;
    state.created.messages = state.created.messages.concat(polls);
  },
};

const actions = {
  getPolls: ({ commit, state }) => {
    if (!state.created.isLoading && !state.created.isLoaded) {
      commit('pollsLoading');
      let params = null;
      if (state.created.messages.length > 0) {
        const lastMessage = state.created.messages.slice().reverse()[0];
        params = { unit: lastMessage.unit, message_index: lastMessage.message_index };
      }
      api.requestAsync('get_polls', params).then((polls) => {
        commit('savePolls', polls);
      });
    }
  },
};

export default {
  state,
  mutations,
  actions,
};
