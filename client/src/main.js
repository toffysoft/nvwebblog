// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import { sync } from 'vuex-router-sync'
import store from './store'

// components
import MainHeader from '@/components/Header.vue'

Vue.config.productionTip = false

Vue.use(VueResource)
Vue.component('main-header', MainHeader)

sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
