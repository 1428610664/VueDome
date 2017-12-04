import Vue from 'vue'
import App from './App'
import VueLazyload from 'vue-lazyload'
import router from './router'
import store from './store'
import 'common/styles/common'

//import vConsole from 'vconsole'

import  { DatetimePlugin } from 'vux'
import  { ToastPlugin } from 'vux'
import  { LoadingPlugin } from 'vux'

Vue.use( DatetimePlugin )
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)


Vue.use(VueLazyload, {
	loading: require('common/images/logo.png')
})

new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App)
})