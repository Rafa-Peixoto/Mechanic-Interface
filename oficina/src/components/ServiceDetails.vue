<template>
  <div class="service-page">
    <h1>Detalhes do Serviço</h1>
    <p>ID do Serviço: {{ $route.params.serviceId }}</p>
    <p>Matrícula: {{ serviceDetails && serviceDetails.vehicleId }}</p>
    <p>Serviço: {{ getServiceDescription(serviceDetails && serviceDetails.servicedefinitionId) }}</p>
    <p>Estado: {{ serviceDetails && serviceDetails.estado }}</p>
    <p>Duração: {{ serviceDetails && serviceDetails.duracao }}</p>
    <p>Descrição: {{ serviceDetails && serviceDetails.descrição }}</p>
  </div>
</template>

<script>

export default {
  data() {
    return {
      serviceDetails: null,
      serviceDefinitions: []
    };
  },
  
  methods: {
    async fetchServiceDetails() {
      const serviceId = this.$route.params.serviceId;
      try {
        const response = await fetch(`http://localhost:3000/services/${serviceId}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar os detalhes do serviço.");
        }
        const data = await response.json();
        this.serviceDetails = data; // Atualiza o estado do componente com os detalhes do serviço
      } catch (error) {
        console.error('Erro ao buscar os detalhes do serviço:', error.message);
      }
    },

    async fetchServiceDefinitions(){
      const url = "http://localhost:3000/service-definitions";
      try{
            const response = await fetch(url);
            if(!response.ok){
                throw new Error("Erro ao buscar as definições de serviço: " + response.statusText);
            }
            const data = await response.json();
            this.serviceDefinitions = data;
        }catch(error){
            console.error("Erro ao buscar as definições de serviço:", error.message);
        }
    },

    getServiceDescription(serviceId) {
        
        if (this.serviceDefinitions) {
            const serviceDef = this.serviceDefinitions.find(def => def.id === serviceId);
            return serviceDef ? serviceDef.descr : "Desconhecido";
        }
        return "Desconhecido";
        },
  },
  created() {
    this.fetchServiceDetails();
      this.fetchServiceDefinitions();
  }
};
</script>

<style scoped>
    .service-page {
    max-width: 500px;
    margin-left: 20px;
    margin-top: 100px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    text-align: left;
    }

    .service-page h1 {
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
    .service-page h1 {
        font-size: 16px;
    }
    console;
    }
</style>