import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login';
import Servicos from './components/Servicos';
import NotFound from './components/NotFound';



const router = createRouter({
  history: createWebHistory(),
  routes: [
    {path:'/', redirect:"/Login"},
    {path: '/Login',name: 'Login', component: Login},
    {path: '/Servicos', name: 'Servicos', component: Servicos},
    { path: '/:notFound(.*)*', name: 'NotFound', component: NotFound }
  ]
});

export default router;