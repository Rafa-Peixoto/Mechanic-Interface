import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login';
import Servicos from './components/Servicos';
import NotFound from './components/NotFound';
import Perfil from './components/Perfil.vue';
import ServiceDetails from './components/ServiceDetails.vue';



const router = createRouter({
  history: createWebHistory(),
  routes: [
    {path:'/', redirect:"/Login"},
    {path: '/Login',name: 'Login', component: Login},
    {path: '/Servicos', name: 'Servicos', component: Servicos},
    { path: '/:notFound(.*)*', name: 'NotFound', component: NotFound },
    { path: '/Servicos/:serviceId', name: 'ServiceDetails', component: ServiceDetails, props: true },
    { path: '/Perfil', name: 'Perfil', component: Perfil }
  ]
});

export default router;