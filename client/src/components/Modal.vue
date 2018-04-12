<template lang="pug">
  div(:uk-modal='`esc-close: ${closeable}; bg-close: ${closeable};`' :id='id')
    .uk-modal-dialog.uk-modal-body
      button.uk-modal-close-default(type='button' uk-close='' v-if='closeable')
      h2.uk-modal-title {{ title }}
      p {{ text }}
</template>

<script>
  export default {
    name: 'Modal',
    props: {
      id: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      closeable: {
        type: Boolean,
        required: true,
      },
    },
  };
</script>

<style scoped lang="stylus">
</style>
