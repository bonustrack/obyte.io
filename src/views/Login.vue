<template>
  <div class="container-md p-responsive" style="max-width: 460px;">
    <div class="py-8 text-center">
      <h1>Log in</h1>
      <p>Sign in again or <router-link to="/create">create a new account</router-link></p>
    </div>
    <form
      @submit="submitForm"
      @change="checkForm"
      method="post"
    >
      <div class="mb-4">
        <p>Account name / address</p>
        <input name="username" v-model="address" type="text" style="display: none;" />
        <select v-model="address" class="form-select input-block mb-2">
          <option v-for="(user, index) in userList" :value="user.address" :key="index">
            {{user.name ? user.name + ' / ' + user.address : user.address}}
          </option>
        </select>
        <p>Password</p>
        <input
          name="password"
          v-model="password"
          type="password"
          class="form-control input-lg input-block mb-2"
        />
      </div>
      <FormErrors :errors="errors"/>
      <button
        :disabled="!!errors.length || password === null"
        type="submit"
        class="btn btn-large btn-blue input-block">
        Log in
      </button>
    </form>
    <p class="text-center my-4">Or <router-link to="/restore">restore account</router-link> from backup</p>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data () {
    return {
      errors: [],
      address: null,
      password: null,
    }
  },
  computed: {
    userList () {
      let userList = [];
      try {
        userList = localStorage.getItem('userList');
        userList = JSON.parse(userList);
      } catch (e) {
        console.log(e);
      }
      if (userList[0]) {
        this.address = userList[0].address;
      }
      return userList;
    },
  },
  methods: {
    ...mapActions([
      'login',
    ]),
    checkForm () {
      this.errors = [];
      if (!this.password && this.password !== null) this.errors.push('Password is required');
    },
    submitForm (e) {
      e.preventDefault();
      if (!this.errors.length) {
        this.login({
          address: this.address,
          password: this.password,
        }).then(() => {
          const redirect = this.$route.query.redirect;
          this.$router.push(redirect || '/settings');
        }).catch(e => {
          this.errors.push('Password is wrong');
        });
      }
    },
  },
}
</script>
