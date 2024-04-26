import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login';
import ServicosAtribuidos from './components/ServicosAtribuidos';
import ServicosAgendados from './components/ServicosAgendados';
import ServicosTerminados from './components/ServicosTerminados';
import NotFound from './components/NotFound';
import Perfil from './components/Perfil.vue';
import ServiceDetails from './components/ServiceDetails.vue';
import AdicionarServico from './components/AdicionarServico.vue';



const router = createRouter({
  history: createWebHistory(),
  routes: [
    {path:'/', redirect:"/Login"},
    {path: '/Login',name: 'Login', component: Login},
    {path: '/ServicosAtribuidos', name: 'ServicosAtribuidos', component: ServicosAtribuidos},
    {path: '/ServicosAgendados', name: 'ServicosAgendados', component: ServicosAgendados},
    {path: '/ServicosTerminados', name: 'ServicosTerminados', component: ServicosTerminados},
    { path: '/Servicos/:serviceId', name: 'ServiceDetails', component: ServiceDetails, props: true },
    { path: '/Perfil', name: 'Perfil', component: Perfil },
    { path: '/:notFound(.*)*', name: 'NotFound', component: NotFound },
    { path: '/AdicionarServico', name: 'AdicionarServico', component: AdicionarServico },

  ]
});

export default router;