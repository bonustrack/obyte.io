<template>
  <div class="container-md p-responsive" style="max-width: 460px;">
    <div class="py-8 text-center">
      <h1>Edit my profile</h1>
    </div>
    <form
      @submit="submitForm"
      method="post"
      class="mb-8"
    >
      <div class="mb-4">
        <div class="mb-4 text-center">
          <Avatar
            :address="this.$store.state.app.address"
            size="100"
          />
        </div>
        <p>Name</p>
        <input
          v-model="name"
          type="text"
          class="form-control input-lg input-block mb-2"
        />
        <p>About</p>
        <textarea
          rows="2"
          class="form-control input-lg input-block mb-2"
          v-model="about"
          maxlength="160"
        />
        <p>Location</p>
        <input
          v-model="location"
          type="text"
          class="form-control input-lg input-block mb-2"
        />
        <p>Website</p>
        <input
          v-model="website"
          type="text"
          class="form-control input-lg input-block mb-2"
        />
        <p>Email</p>
        <input
          v-model="email"
          type="text"
          class="form-control input-lg input-block mb-2"
        />
      </div>
      <FormErrors :errors="errors"/>
      <div v-if="success" class="flash flash-success text-left pl-5 mb-4">
        Your profile has been successfully updated
      </div>
      <button
        :disabled="!!errors.length || Object.keys(this.profileDifference).length === 0 || isLoading"
        type="submit"
        class="btn btn-large btn-blue input-block">
        Save
      </button>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import difference from 'lodash/difference';

export default {
  data () {
    return {
      isLoading: false,
      errors: [],
      success: null,
      name: null,
      about: null,
      location: null,
      website: null,
      email: null,
    }
  },
  computed: {
    profile () {
      return this.$store.state.profiles[this.$store.state.app.address]
      && this.$store.state.profiles[this.$store.state.app.address].profile
        ? this.$store.state.profiles[this.$store.state.app.address].profile
        : {};
    },
    profileDifference () {
      const profile = {
        name: this.name,
        about: this.about,
        location: this.location,
        website: this.website,
        email: this.email,
      };
      Object.keys(profile).forEach((key) => {
        if (!profile[key] || profile[key] === this.profile[key]) {
          delete profile[key];
        }
      });
      return profile;
    }
  },
  methods: {
    ...mapActions([
      'getProfile',
      'post',
    ]),
    submitForm (e) {
      e.preventDefault();
      if (!this.errors.length) {
        if (Object.keys(this.profileDifference).length !== 0) {
          this.isLoading = true;
          this.post({ app: 'profile', payload: this.profileDifference }).then(result => {
            this.isLoading = false;
            this.success = true;
          }).catch(err => {
            this.isLoading = false;
            console.log('Error post_joint', err);
          });
        }
      }
    },
  },
  created () {
    if (Object.keys(this.profile).length !== 0) {
      this.name = this.profile.name;
      this.about = this.profile.about;
      this.location = this.profile.location;
      this.website = this.profile.website;
      this.email = this.profile.email;
    } else {
      this.getProfile(this.$store.state.app.address).then(profile => {
        this.name = profile.name;
        this.about = profile.about;
        this.location = profile.location;
        this.website = profile.website;
        this.email = profile.email;
      });
    }
  }
}
</script>
