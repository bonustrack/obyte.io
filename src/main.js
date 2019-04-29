import Vue from 'vue';
import VueI18n from 'vue-i18n';
import infiniteScroll from 'vue-infinite-scroll';
import moment from 'moment';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import makeBlockie from 'ethereum-blockies-base64';
import api from '@/helpers/api';
import client from '@/helpers/client';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import utils from '@/helpers/utils';
import 'primer/index.scss';
import '@/styles.less';

const requireComponent = require.context('./components', true, /[\w-]+\.vue$/);
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName);
  const componentName = upperFirst(camelCase(fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')));
  Vue.component(componentName, componentConfig.default || componentConfig)
});

setInterval(() => api.request('heartbeat', null), 10 * 1000);
setInterval(() => client.api.heartbeat(), 10 * 1000);

Vue.config.productionTip = false;

Vue.filter('truncate', function (text, stop, clamp) {
  return text.slice(0, stop) + (stop < text.length ? clamp || '...' : '')
});

Vue.filter('date', function(value, format) {
  return moment(new Date(value).getTime()).fromNow();
});

Vue.filter('name', function(value, type, fallback) {
  return utils.getAddressName(value, type, fallback);
});

Vue.filter('blockie', value => makeBlockie(value));

Vue.use(VueI18n);
Vue.use(infiniteScroll);

const messages = {
  en: {
    message: {
      hello: 'hello world'
    }
  },
  ja: {
    message: {
      hello: 'こんにちは、世界'
    }
  }
};

const numberFormats = {
  'en-US': {
    currency: {
      style: 'currency', currency: 'USD'
    }
  },
  'ja-JP': {
    currency: {
      style: 'currency', currency: 'JPY', currencyDisplay: 'symbol'
    }
  }
};

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'ja', // set locale
  messages, // set locale messages
  numberFormats,
});

new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
}).$mount('#app');
