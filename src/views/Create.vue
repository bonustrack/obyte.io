<template>
  <div class="container-md p-responsive" style="max-width: 460px;">
    <div class="py-8 text-center">
      <h1>Create new account</h1>
      <p>Sign up for a free account below or <router-link to="/restore">restore an account</router-link> from a backup</p>
    </div>
    <form
      @submit="submitForm"
      @change="checkForm"
      method="post"
    >
      <div class="text-left mb-4">
        <p>Account name</p>
        <input
          v-model="name"
          type="text"
          class="form-control input-lg input-block mb-2"
        >
        <p>Protect your account with a new password</p>
        <input
          type="password"
          v-model="password"
          class="form-control input-lg input-block mb-2"
        >
        <p>Confirm password</p>
        <input
          type="password"
          v-model="passwordConfirm"
          class="form-control input-lg input-block mb-2"
        >
      </div>
      <ul v-if="errors.length" class="flash flash-error text-left pl-5 mb-4">
        <li v-for="error in errors">{{ error }}</li>
      </ul>
      <button
        :disabled="!!errors.length || password === null || passwordConfirm === null"
        class="btn btn-large btn-blue input-block"
        type="submit"
      >
        Continue
      </button>
    </form>
    <p v-if="hasUserList" class="text-center my-4">
      Or
      <router-link to="/login">sign in</router-link>
      to a saved account
    </p>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data () {
    return {
      errors: [],
      name: null,
      password: null,
      passwordConfirm: null,
    };
  },
  computed: {
    hasUserList () {
      return this.$store.state.app.hasUserList;
    },
  },
  methods: {
    ...mapActions([
      'createAccount',
    ]),
    checkForm () {
      this.errors = [];
      if (!this.password && this.password !== null) this.errors.push('Password is required');
      if (this.password.length < 8) this.errors.push('Password must be at least 8 characters');
      if (!this.passwordConfirm && this.passwordConfirm !== null) this.errors.push('Password confirm is required');
      if (this.passwordConfirm !== this.password && this.passwordConfirm !== null) this.errors.push('Password confirm not match password');
    },
    submitForm (e) {
      if (!this.errors.length) {
        this.createAccount({
          password: this.password,
          name: this.name,
        });
        const redirect = this.$route.query.redirect;
        this.$router.push(redirect || '/settings');
      }
      e.preventDefault();
    },
  },
}
</script>

<style lang="less">
@import url('../styles.less');

.seed {
  font-weight: bold;
  color: @link-color;
}
</style>
