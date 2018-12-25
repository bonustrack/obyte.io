<template>
  <div
    class="container-md p-responsive"
    style="max-width: 460px;"
  >
    <div v-if="step === 1" class="py-8 text-center">
      <h1>Welcome back</h1>
      <p>Sign in to your wallet below or <router-link to="/create">create a new account</router-link></p>
    </div>
    <div v-if="step === 2" class="py-8 text-center">
      <h1>Protect your account</h1>
      <p>
        Protect your account with a new password or
        <a @click="step = 1" href="#">go back</a>
      </p>
    </div>
      <form
        v-if="step === 1"
        @submit="submitForm"
        @change="checkForm"
        method="post"
      >
        <p>Your wallet seed</p>
        <textarea
          rows="6"
          class="form-control input-lg input-block mb-4"
          placeholder="Your seed is the 12 words you saved when creating your account"
          v-model="seed"
        />
        <FormErrors :errors="errors"/>
        <button
          :disabled="!!errors.length || seed === null"
          type="submit"
          class="btn btn-large btn-blue input-block">
          Continue
        </button>
      </form>
      <form
        v-if="step === 2"
        @submit="submitStep2Form"
        @change="checkStep2Form"
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
        <FormErrors :errors="errors"/>
        <button
          :disabled="!!errors.length || password === null || passwordConfirm === null"
          class="btn btn-large btn-blue input-block"
          type="submit"
        >
          Log in
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
import utils from '@/helpers/utils';

export default {
  data () {
    return {
      step: 1,
      errors: [],
      seed: null,
      name: null,
      password: null,
      passwordConfirm: null,
    }
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
      if (!this.seed || !utils.isSeedValid(this.seed)) {
        this.errors.push('Seed is not valid');
      }
    },
    checkStep2Form () {
      this.errors = [];
      if (!this.password && this.password !== null) this.errors.push('Password is required');
      if (this.password.length < 8) this.errors.push('Password must be at least 8 characters');
      if (!this.passwordConfirm && this.passwordConfirm !== null) this.errors.push('Password confirm is required');
      if (this.passwordConfirm !== this.password && this.passwordConfirm !== null) this.errors.push('Password confirm not match password');
    },
    submitForm (e) {
      e.preventDefault();
      this.checkForm();
      if (!this.errors.length) {
        this.step = 2;
      }
    },
    submitStep2Form (e) {
      if (!this.errors.length) {
        this.createAccount({
          seed: this.seed,
          password: this.password,
          name: this.name,
        });
        this.$router.push('/settings');
      }
      e.preventDefault();
    },
  },
}
</script>
