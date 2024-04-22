<template>
  <div>
    <h1>Detalhes do Serviço</h1>
    <p>ID do Serviço: {{ $route.params.serviceId }}</p>
    <!-- Adicione mais detalhes conforme necessário -->
  </div>
</template>

<script>
export default {
  data() {
    return {
    
      user: null,
      services: []
    
    };
  },
  mounted() {
    this.fetchServiceDetails();
  },
  methods: {
    fetchServiceDetails() {
      const serviceId = this.$route.params.serviceId;
      // Implementar chamada fetch para obter detalhes usando serviceId
      console.log("Fetching details for service ID:", serviceId);
      // Suponha que esta chamada fetch popule os dados necessários
    }
  }
};
</script>