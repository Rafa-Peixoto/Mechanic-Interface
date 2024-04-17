import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login';
import NotFound from './components/NotFound';



const router = createRouter({
  history: createWebHistory(),
  routes: [
    {path:'/', redirect:"/Login"},
    {path: '/Login',name: 'Login', component: Login},
    { path: '/:notFound(.*)*', name: 'NotFound', component: NotFound }
  ]
});

export default router;