import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store'
import Home from '@/views/Home';
import Profile from '@/views/Profile';
import ProfileAttestations from '@/views/ProfileAttestations';
import Unit from '@/views/Unit';
import About from '@/views/About';
import Attestors from '@/views/Attestors';
import Bots from '@/views/Bots';
import Witnesses from '@/views/Witnesses';
import Polls from '@/views/Polls';
import Timeline from '@/views/Timeline';
import Assets from '@/views/Assets';
import Settings from '@/views/Settings';
import EditProfile from '@/views/EditProfile';
import Wallet from '@/views/Wallet';
import Create from '@/views/Create';
import Login from '@/views/Login';
import Editor from '@/views/Editor';
import CreatePoll from '@/views/CreatePoll';
import Restore from '@/views/Restore';
import Error404 from '@/views/Error404';
import client from '@/helpers/client';

Vue.use(Router);

const requireAuth = (to, from, next) => {
  if (!store.state.app.address) {
    next({ path: '/login', query: { redirect: to.fullPath }});
  } else {
    next();
  }
};

const redirectToAddress = (to, from, next) => {
  client.api.getAttestation({
    attestor_address: 'JEDZYC2HMGDBIDQKG3XSTXUSHMCBK725',
    field: 'steem_username',
    value: to.params.username,
  }, (err, unit) => {
    if (err || !unit)
      return next();
    client.api.getJoint(unit, (err, joint) => {
      if (err || !joint)
        return next();
      const address = joint.joint.unit.messages
        .find(message => message.app === 'attestation')
        .payload.address;
      if (!address)
        return next();
      next({ name: 'profile', params: { address }});
    });
  });
};

const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/steem/:username', name: 'profile-steem', beforeEnter: redirectToAddress },
    { path: '/@:address', name: 'profile', component: Profile, meta: { title: 'Profile' } },
    { path: '/@:address/attestations', name: 'profile-attestations', component: ProfileAttestations, meta: { title: 'Profile' } },
    { path: '/u/*', name: 'unit', component: Unit, meta: { title: 'Unit' } },
    { path: '/about', name: 'about', component: About, meta: { title: 'About' } },
    { path: '/polls', name: 'polls', component: Polls, meta: { title: 'Polls' } },
    { path: '/timeline', name: 'timeline', component: Timeline, meta: { title: 'Timeline' } },
    { path: '/assets', name: 'assets', component: Assets, meta: { title: 'Assets' } },
    { path: '/attestors', name: 'attestors', component: Attestors, meta: { title: 'Attestors' } },
    { path: '/bots', name: 'bots', component: Bots, meta: { title: 'Bots' } },
    { path: '/witnesses', name: 'witnesses', component: Witnesses, meta: { title: 'Witnesses' } },
    { path: '/login', name: 'login', component: Login, meta: { title: 'Log in' } },
    { path: '/create', name: 'create', component: Create, meta: { title: 'Create new account' } },
    { path: '/restore', name: 'restore', component: Restore, meta: { title: 'Restore account' } },
    { path: '/settings', name: 'settings', beforeEnter: requireAuth, component: Settings, meta: { title: 'Settings' } },
    { path: '/edit-profile', name: 'edit-profile', beforeEnter: requireAuth, component: EditProfile, meta: { title: 'Edit my profile' } },
    { path: '/wallet', name: 'wallet', beforeEnter: requireAuth, component: Wallet, meta: { title: 'Wallet' } },
    { path: '/editor', name: 'editor', beforeEnter: requireAuth, component: Editor, meta: { title: 'Editor' } },
    { path: '/poll/create', name: 'create-poll', beforeEnter: requireAuth, component: CreatePoll, meta: { title: 'Create a poll' } },
    { path: '*', name: '404', component: Error404 },
  ],
});

router.beforeEach((to, from, next) => {
  const name = 'Byteball.co';
  document.title = to.meta.title ? `${to.meta.title} - ${name}` : name;
  window.scrollTo(0, 0);
  next();
});

export default router;
