<template>
  <div class="height-full pb-12">
    <form
      v-if="step === 1"
      @submit="submitForm"
      @change="checkForm"
      method="post"
      class="height-full"
    >
      <div
        id="editor"
        class="columns"
      >
        <textarea
          v-model="payload"
          class="border-right p-4 column one-half"
        ></textarea>
        <Markdown
          :text="payload"
          className="p-4 column one-half"
        />
      </div>
      <div
        v-if="step === 1"
        class="border-top p-responsive py-2 text-right"
      >
        <button
          :disabled="!!errors.length || !payload.length || isLoading"
          type="submit"
          class="btn btn-large">
          Publish
        </button>
      </div>
    </form>
    <PostSuccess
      v-if="step === 2"
      :unit="unit"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      step: 1,
      errors: [],
      payload: `# Hello world

Delete this and write something using [markdown](https://guides.github.com/features/mastering-markdown/)

## This is an <h2> tag
### This is an <h3> tag

*This text will be italic*
_This will also be italic_

**This text will be bold**
__This will also be bold__

_You **can** combine ~~it~~ them_

\`\`\`
   ____  __          __
  / __ \\/ /_  __  __/ /____
 / / / / __ \\/ / / / __/ _ \\
/ /_/ / /_/ / /_/ / /_/  __/
\\____/_.___/\\__, /\\__/\\___/
           /____/
\`\`\`
http://obyte.org/
`,
      unit: null,
      isLoading: false,
    };
  },
  methods: {
    ...mapActions([
      'post',
    ]),
    checkForm() {
      this.errors = [];
      if (!this.payload && this.payload !== null) this.errors.push('Payload is required');
    },
    submitForm(e) {
      e.preventDefault();
      // console.log(this.payload);
      this.checkForm();
      if (!this.errors.length) {
        this.isLoading = true;
        this.post({ app: 'text', payload: this.payload }).then((result) => {
          this.unit = result;
          this.step = 2;
          this.isLoading = false;
        }).catch((err) => {
          this.isLoading = false;
          alert(`Error post_joint: ${err}`); // eslint-disable-line no-alert
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
#editor {
  margin: 0;
  height: 100%;
}

textarea, #editor div {
  display: inline-block;
  height: 100%;
  vertical-align: top;
  box-sizing: border-box;
  overflow-y: scroll;
}

textarea {
  border: none;
  resize: none;
  outline: none;
  background-color: #f6f6f6;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
}

code {
  color: #f66;
}
</style>
