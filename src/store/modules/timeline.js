import api from '@/helpers/api';

const state = {
  created: {
    isLoading: false,
    isLoaded: false,
    messages: [],
  },
};

const mutations = {
  timelineLoading (state) {
    state.created.isLoading = true;
  },
  saveTimeline (state, timeline) {
    state.created.isLoading = false;
    state.created.isLoaded = !timeline.length;
    state.created.messages = state.created.messages.concat(timeline);
  },
};

const actions = {
  getTimeline: ({ commit, state }) => {
    if (!state.created.isLoading && !state.created.isLoaded) {
      commit('timelineLoading');
      let params = null;
      if (state.created.messages.length > 0) {
        const lastMessage = state.created.messages.slice().reverse()[0];
        params = { unit: lastMessage.unit, message_index: lastMessage.message_index };
      }
      api.requestAsync('get_timeline', params).then(timeline => {
        commit('saveTimeline', timeline);
      });
    }
  },
};

export default {
  state,
  mutations,
  actions,
};
