<template>
  <div class="service-page">
      <div v-if="user && user.name">
          <h3>Nome: {{ user.name }}</h3>
          <h3>Idade: {{ user.age }}</h3>
          <h3>Profissão: {{ user.profession }}</h3>
          <h3>Localização: {{ user.localization }}</h3>
          <h3>Educação: {{ user.education }}</h3>
          <h3>Especialização: {{ user.specialization }}</h3>
          <h3>Interesses: {{ user.interests }}</h3>
          <h3>Objetivos: {{ user.objectives }}</h3>
          <h3>Desafios: {{ user.challenges }}</h3>
          <h3>Soluções: {{ user.solutions }}</h3>
          <h3>Citação: {{ user.quotes }}</h3>
      </div>
  </div>
</template>

<script>
import { useUserStore } from '../stores';

export default {
name: 'PainelServicos',
data() {
  return {
    user: null,
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
}
};
</script>

<style scoped>
  .service-page {
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  text-align: left;
  }

  .service-page h3 {
  color: #333;
  font-size: 18px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 4px;
  margin-bottom: 12px;
  }

  .service-page h3:last-child { /* Citação */
  font-style: italic;
  }

  @media (max-width: 768px) {
  .service-page {
      margin: 20px;
      padding: 10px;
  }
  .service-page h3 {
      font-size: 16px;
  }
  }
</style>