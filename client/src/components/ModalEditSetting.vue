<template lang="pug">
  div(uk-modal='' :id='id')
    .uk-modal-dialog.uk-modal-body
      button.uk-modal-close-default(type='button' uk-close='')
      h2.uk-modal-title Edit setting
      form.uk-form(@submit.prevent='editDone')
        p
          | You are changing the value of the&nbsp;
          b {{ editKey }}
          | &nbsp;setting.
          br
          | It will be saved as a&nbsp;
          i string
          | &nbsp;and it can be empty.
        input.uk-width-1-2(type='text' :placeholder='editValue' v-model='newValue')
        input.uk-button.uk-button-danger.uk-margin-left(
          type='button'
          value='Reset'
          :disabled='!isValueOriginal'
          @click.prevent='resetValue'
        )
        input.uk-button.uk-margin-left(type='submit' value='Edit')
</template>

<script>
  export default {
    name: 'ModalEditSetting',
    props: {
      id: {
        type: String,
        required: true,
      },
      editKey: {
        type: String,
        required: false,
        default: '',
      },
      editValue: {
        type: String,
        required: false,
        default: '',
      },
      originalValue: {
        type: String,
        required: false,
        default: '',
      },
    },
    data: function() {
      return {
        newValue: '',
      };
    },
    computed: {
      isValueOriginal: function() {
        return this.newValue !== this.originalValue;
      },
    },
    watch: {
      originalValue: function() {
        this.newValue = this.editValue;
      },
    },
    methods: {
      editDone: function() {
        this.$emit('editDone', { key: this.editKey, value: this.newValue });
      },
      resetValue: function() {
        this.newValue = this.originalValue;
      },
    },
  };
</script>

<style scoped lang="stylus">
</style>
