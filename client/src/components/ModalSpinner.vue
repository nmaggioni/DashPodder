<template lang="pug">
  div(uk-modal='esc-close: false; bg-close: false;' :id='id')
    .uk-modal-dialog.uk-modal-body
      h2.uk-modal-title {{ title }}
      .uk-flex.uk-flex-center.uk-margin
        div(uk-spinner='ratio: 2').uk-margin
</template>

<script>
  export default {
    name: 'ModalSpinner',
    props: {
      id: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
    },
  };
</script>

<style scoped lang="stylus">
</style>
