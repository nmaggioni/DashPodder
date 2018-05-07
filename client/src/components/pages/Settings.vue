<template lang="pug">
  div
    ModalSpinner(id='loadingModal' title='Loading settings...')
    ModalSpinner(id='savingModal' title='Saving settings...')
    ModalEditSetting(:id='"editingModal"'
    :editKey='editingKey'
    :editValue='editingValue'
    :originalValue='settings[editingKey]'
    @editDone='editSettingDone'
    )
    .uk-flex.uk-flex-center.uk-margin-medium-bottom(v-if='Object.keys(modifiedSettings).length')
      input.uk-button.uk-button-large.uk-button-success(
      type='button'
      value='Save changes'
      @click='saveSettings'
      )
      input.uk-button.uk-button-large.uk-button-danger.uk-margin-left(
      type='button'
      value='Discard changes'
      @click='resetSettings'
      )
    table.uk-table.uk-table-hover.centered
      tr
        th.uk-table-shrink Key
        th.uk-table-expand Value
        th.uk-table-shrink Edit
      tr(v-for='setting in sortedSettings' :key='setting.key'
      :class='{ "uk-text-bold": modifiedSettings.hasOwnProperty(setting.key) }'
      )
        td(v-text='setting.key')
        td(v-if='modifiedSettings[setting.key]') {{ modifiedSettings[setting.key] }}
        td(v-else) {{ setting.value }}
        td
          span(uk-icon='icon: pencil' @click='editSetting(setting.key)').edit-icon
</template>

<script>
  import ModalSpinner from '@components/ModalSpinner';
  import ModalEditSetting from '@components/ModalEditSetting';

  export default {
    name: 'Settings',
    components: {
      ModalSpinner,
      ModalEditSetting,
    },
    data: function() {
      return {
        settings: {},
        modifiedSettings: {},
        editingKey: '',
        editingValue: '',
      };
    },
    computed: {
      sortedSettings: function() {
        let sortedSettings = [];
        for (let setting in this.settings) {
          if (this.settings.hasOwnProperty(setting)) {
            sortedSettings.push({ key: setting, value: this.settings[setting] });
          }
        }
        sortedSettings.sort(function(a, b) {
          if (a.key < b.key) return -1;
          if (a.key > b.key) return 1;
          return 0;
        });
        return sortedSettings;
      },
    },
    mounted: function() {
      this.getSettings();
    },
    methods: {
      getSettings: function() {
        let modal = this.$UIkit.modal(document.getElementById('loadingModal'));
        modal.show();
        this.$http.get('gpo/set')
          .then((res) => {
            return res.json();
          }).then((jres) => {
          this.settings = jres;
          modal.hide();
        });
      },
      editSetting(key) {
        this.editingKey = key;
        this.editingValue = this.modifiedSettings[this.editingKey] || this.settings[this.editingKey];
        let modal = this.$UIkit.modal(document.getElementById('editingModal'));
        modal.show();
      },
      editSettingDone(obj) {
        let modal = this.$UIkit.modal(document.getElementById('editingModal'));
        modal.hide();
        this.editingKey = '';
        this.editingValue = '';

        if (obj.value === this.settings[obj.key]) {
          if (this.modifiedSettings[obj.key]) {
            delete this.modifiedSettings[obj.key];
          }
        } else {
          this.modifiedSettings[obj.key] = obj.value;

          this.$UIkit.notification({
            message: 'Setting edited successfully',
            status: 'success',
            pos: 'top-center',
            timeout: 3000,
          });
        }
      },
      saveSettings: function() {
        this.$UIkit.modal.confirm('Do you really want to <b>save</b> all changes?').then(() => {
          let modal = this.$UIkit.modal(document.getElementById('savingModal'));
          modal.show();
          this.$http.post('gpo/setall', this.modifiedSettings)
            .then(() => {
              this.modifiedSettings = {};
              modal.hide();
              this.$UIkit.notification({
                message: 'Setting saved successfully, reloading...',
                status: 'success',
                pos: 'top-center',
                timeout: 1500,
              });
              this.getSettings();
            })
            .catch(() => {
              this.$UIkit.notification({
                message: 'Could not save settings',
                status: 'danger',
                pos: 'top-center',
                timeout: 5000,
              });
            });
        }, () => {
          this.$UIkit.notification({
            message: 'No changes made',
            status: 'primary',
            pos: 'top-center',
            timeout: 3000,
          });
        });
      },
      resetSettings: function() {
        this.$UIkit.modal.confirm('Do you really want to <b>discard</b> all changes?').then(() => {
          this.modifiedSettings = {};
        }, () => {
        });
      },
    },
  };
</script>

<style scoped lang="stylus">
  .edit-icon
    cursor pointer
</style>
