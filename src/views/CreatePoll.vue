<template>
  <div>
    <div
      v-if="step === 1"
      class="container-md p-responsive"
      style="max-width: 460px;"
    >
      <div class="py-8 text-center">
        <h1>Create a poll</h1>
      </div>
      <form
        @submit="submitForm"
        @change="checkForm"
        method="post"
        class="mb-8"
      >
        <div class="mb-4">
          <p>Question</p>
          <input
            v-model="question"
            type="text"
            class="form-control input-lg input-block mb-2"
          />
          <p>Choices</p>
          <input
            v-for="(choice, i) in choices"
            v-model="choices[i]"
            type="text"
            class="form-control input-lg input-block mb-2"
          />
        </div>
        <FormErrors :errors="errors"/>
        <div v-if="success" class="flash flash-success text-left pl-5 mb-4">
          Your poll has been successfully published
        </div>
        <button
          :disabled="!!errors.length || this.question === null  || this.choices[0] === null || this.choices[1] === null || isLoading"
          type="submit"
          class="btn btn-large btn-blue input-block">
          Publish
        </button>
      </form>
    </div>
    <PostSuccess
      v-if="step === 2"
      :unit="unit"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import constants from 'byteballcore/constants';

export default {
  data () {
    return {
      step: 1,
      unit: null,
      isLoading: false,
      errors: [],
      success: null,
      question: null,
      choices: [null, null],
    }
  },
  methods: {
    ...mapActions([
      'post',
    ]),
    checkForm () {
      this.errors = [];

      const lastChoice = this.choices.slice().reverse()[0];
      if (!this.question && this.question !== null) this.errors.push('Question is required');
      if ((!this.choices[0] && this.choices[0] !== null) || (!this.choices[1] && this.choices[1] !== null)) this.errors.push('At least 2 choices are required');

      if (lastChoice !== '' && lastChoice !== null && this.choices.length <= constants.MAX_CHOICES_PER_POLL) {
        this.choices.push('');
      }
    },
    submitForm (e) {
      e.preventDefault();
      if (!this.errors.length) {
        const choices = this.choices
          .map(Function.prototype.call, String.prototype.trim)
          .filter(c => c);
        if (choices.length >= 2) {
          this.isLoading = true;
          const payload = {
            question: this.question,
            choices,
          };
          this.post({ app: 'poll', payload }).then(result => {
            this.unit = result;
            this.step = 2;
            this.isLoading = false;
          }).catch(err => {
            this.isLoading = false;
            console.log('Error post_joint', err);
          });
        }
      }
    },
  },
}
</script>
