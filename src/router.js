import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import Home from '@/views/Home.vue';
import Profile from '@/views/Profile.vue';
import ProfileAttestations from '@/views/ProfileAttestations.vue';
import Unit from '@/views/Unit.vue';
import About from '@/views/About.vue';
import Attestors from '@/views/Attestors.vue';
import Oracles from '@/views/Oracles.vue';
import Dapps from '@/views/Dapps.vue';
import Bots from '@/views/Bots.vue';
import Witnesses from '@/views/Witnesses.vue';
import Polls from '@/views/Polls.vue';
import Timeline from '@/views/Timeline.vue';
import Assets from '@/views/Assets.vue';
import Settings from '@/views/Settings.vue';
import EditProfile from '@/views/EditProfile.vue';
import Wallet from '@/views/Wallet.vue';
import Create from '@/views/Create.vue';
import Login from '@/views/Login.vue';
import Editor from '@/views/Editor.vue';
import CreatePoll from '@/views/CreatePoll.vue';
import Restore from '@/views/Restore.vue';
import Error404 from '@/views/Error404.vue';
import client from '@/helpers/client';

Vue.use(Router);

const requireAuth = (to, from, next) => {
  if (!store.state.app.address) {
    next({ path: '/login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
};

const redirectToAddress = (to, from, next) => {
  client.api.getAttestation({
    attestor_address: to.meta.attestor_address,
    field: to.meta.field,
    value: to.params.handle,
  }, (err, unit) => {
    if (err || !unit) { return next({ name: 'error', query: { error: 'ATTESTATION_NOT_FOUND' } }); }
    return client.api.getJoint(unit, (err2, joint) => {
      if (err2 || !joint) { return next(); }
      const { address } = joint.joint.unit.messages.find(message => message.app === 'attestation').payload;
      if (!address) { return next({ name: 'error', query: { error: 'ATTESTATION_NOT_FOUND' } }); }
      return next({ name: 'profile', params: { address } });
    });
  });
};

const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'home', component: Home },
    {
      path: '/email/:handle', name: 'profile-email', meta: { attestor_address: 'H5EZTQE7ABFH27AUDTQFMZIALANK6RBG', field: 'email' }, beforeEnter: redirectToAddress,
    },
    {
      path: '/github/:handle', name: 'profile-github', meta: { attestor_address: 'OYW2XTDKSNKGSEZ27LMGNOPJSYIXHBHC', field: 'github_username' }, beforeEnter: redirectToAddress,
    },
    {
      path: '/steem/:handle', name: 'profile-steem', meta: { attestor_address: 'JEDZYC2HMGDBIDQKG3XSTXUSHMCBK725', field: 'steem_username' }, beforeEnter: redirectToAddress,
    },
    {
      path: '/username/:handle', name: 'profile-username', meta: { attestor_address: 'UENJPVZ7HVHM6QGVGT6MWOJGGRTUTJXQ', field: 'username' }, beforeEnter: redirectToAddress,
    },
    {
      path: '/@:address', name: 'profile', component: Profile, meta: { title: 'Profile' },
    },
    {
      path: '/@:address/attestations', name: 'profile-attestations', component: ProfileAttestations, meta: { title: 'Profile' },
    },
    {
      path: '/u/*', name: 'unit', component: Unit, meta: { title: 'Unit' },
    },
    {
      path: '/about', name: 'about', component: About, meta: { title: 'About' },
    },
    {
      path: '/polls', name: 'polls', component: Polls, meta: { title: 'Polls' },
    },
    {
      path: '/timeline', name: 'timeline', component: Timeline, meta: { title: 'Timeline' },
    },
    {
      path: '/assets', name: 'assets', component: Assets, meta: { title: 'Assets' },
    },
    {
      path: '/attestors', name: 'attestors', component: Attestors, meta: { title: 'Attestors' },
    },
    {
      path: '/oracles', name: 'oracles', component: Oracles, meta: { title: 'Oracles' },
    },
    {
      path: '/dapps', name: 'dapps', component: Dapps, meta: { title: 'dApps' },
    },
    {
      path: '/bots', name: 'bots', component: Bots, meta: { title: 'Chatbots' },
    },
    {
      path: '/witnesses', name: 'witnesses', component: Witnesses, meta: { title: 'Witnesses' },
    },
    {
      path: '/login', name: 'login', component: Login, meta: { title: 'Log in' },
    },
    {
      path: '/create', name: 'create', component: Create, meta: { title: 'Create new account' },
    },
    {
      path: '/restore', name: 'restore', component: Restore, meta: { title: 'Restore account' },
    },
    {
      path: '/settings', name: 'settings', beforeEnter: requireAuth, component: Settings, meta: { title: 'Settings' },
    },
    {
      path: '/edit-profile', name: 'edit-profile', beforeEnter: requireAuth, component: EditProfile, meta: { title: 'Edit my profile' },
    },
    {
      path: '/wallet', name: 'wallet', beforeEnter: requireAuth, component: Wallet, meta: { title: 'Wallet' },
    },
    {
      path: '/editor', name: 'editor', beforeEnter: requireAuth, component: Editor, meta: { title: 'Editor' },
    },
    {
      path: '/poll/create', name: 'create-poll', beforeEnter: requireAuth, component: CreatePoll, meta: { title: 'Create a poll' },
    },
    { path: '*', name: '404', component: Error404 },
    { path: '/oops', name: 'error', component: Error404 },
  ],
});

router.beforeEach((to, from, next) => {
  const name = 'Obyte.io';
  document.title = to.meta.title ? `${to.meta.title} - ${name}` : name;
  window.scrollTo(0, 0);
  next();
});

export default router;
