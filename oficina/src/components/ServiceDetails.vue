<template>
  <div>
    <h1>Detalhes do Serviço</h1>
    <p>ID do Serviço: {{ $route.params.serviceId }}</p>
    <p>Matrícula: {{ $route.params.vehicleId }}</p>
    <p>Serviço: {{ $route.params.serviceId }}</p>
    <p>Estado: {{ $route.params.estado }}</p>
    <p>Duração: {{ $route.params.duracao }}</p>
    <p>Descrição: {{ $route.params.descrição }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
    
      user: null,
      services: [],
    
    };
  },
  mounted() {
    this.fetchServiceDetails();
  },
  methods: {
    fetchServiceDetails() {
      const serviceId = this.$route.params.serviceId;
      console.log("Fetching details for service ID:", serviceId);

      const vehicleId = this.$route.params.vehicleId;
      console.log("Fetching details for vehicle ID:", vehicleId);
    }
  }
};
</script>