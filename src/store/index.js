import { createStore } from 'vuex';
import * as types from '@/store/mutation-types';
import settingsDefault from '@/configs/settingsDefault';

export default createStore({
  state: {
    windowWidth: 0,
    windowHeight: 0,
    setting: settingsDefault,
  },
  mutations: {
    [types.RESIZE](state, data) {
      state.windowWidth = data.windowWidth;
      state.windowHeight = data.windowHeight;
    },
    [types.SET_SETTINGS](state, data) {
      state.setting = data;
    },
  },
  actions: {
  },
  modules: {
  },
});
