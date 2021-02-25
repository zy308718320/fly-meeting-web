import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/home.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/meeting',
    name: 'meeting',
    component: () => import(/* webpackChunkName: "about" */ '../views/meeting.vue'),
  },
  {
    path: '/example',
    name: 'example',
    component: () => import(/* webpackChunkName: "about" */ '../views/example.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
