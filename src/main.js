import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VueDragDrop from 'vue-drag-drop';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  VueDragDrop,
  render: h => h(App)
}).$mount('#app')
