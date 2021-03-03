import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import optimizedResize from '@/utils/optimizedResize';
import App from './App.vue';
import router from './router';
import store from './store';
import * as types from './store/mutation-types';

import 'webrtc-adapter';
import 'element-plus/lib/theme-chalk/index.css';
import '@/assets/styles/common.less';
import './registerServiceWorker';

const resize = () => {
  store.commit(types.RESIZE, {
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
  });
};

optimizedResize.add(resize);
resize();

createApp(App).use(store).use(router).use(ElementPlus)
  .mount('#app');
