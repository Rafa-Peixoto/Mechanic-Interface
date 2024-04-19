<template>
  <div class="service-page">
    <div v-if="user">
        <h1>Bem-vindo, {{ user.nome }}</h1>
        <!-- outras partes do template -->
    </div>
    <h2>Serviços Agendados:</h2>
    <ul>
      <li v-for="service in services" :key="service.id">
        {{ service.descricao }} - Estado: {{ service.estado }}
      </li>
    </ul>
  </div>
</template>

<script>
import { useUserStore } from '../stores';

export default {
  name: 'PainelServicos',
  data() {
    return {
      user: {},
      services: []
    };
  },
  methods: {
   
    
    async fetchServices() {
         console.log("fetch");
      if (!this.user || !this.user.id) {
        console.error("Usuário não está logado ou ID do usuário não está disponível.");
        return;
      }
      
      const url = `http://localhost:3000/services?clientId=${this.user.id}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Erro ao buscar serviços: " + response.statusText);
        }
        const data = await response.json();
        this.services = data;
      } catch (error) {
        console.error('Erro ao buscar os serviços:', error.message);
      }
    },

    async created() {
        const userStore = useUserStore();
        this.user = userStore.user;
        if (this.user && this.user.id) {
        await this.fetchServices();
        } else {
        console.log("Nenhum usuário logado para buscar serviços.");
        }
    },

    mounted() {
    const userStore = useUserStore();
    console.log("mounteed");
    if (userStore.isLoggedIn && userStore.user) {
      this.user = userStore.user;
      console.log("user");
      console.log(userStore.user);
      this.fetchServices(); // Não precisa ser await se não dependemos imediatamente do resultado
    } else {
      console.log("Usuário não está logado ou as informações do usuário não estão disponíveis.");
      this.$router.push('/Login');
    }
  }
  }
};


</script>

<style scoped>
.service-page {
  max-width: 500px;
  margin: auto;
  text-align: center;
}
</style>
