import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import App from './App.vue';
import router from './router';
import store from './store';

import 'webrtc-adapter';
import 'element-plus/lib/theme-chalk/index.css';
import '@/assets/styles/common.less';

createApp(App).use(store).use(router).use(ElementPlus)
  .mount('#app');
