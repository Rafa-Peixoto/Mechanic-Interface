<template>
  <div class="service-page">
    <h1>Detalhes do Serviço</h1>
    <p>ID do Serviço: {{ $route.params.serviceId }}</p>
    <p>Matrícula: {{ serviceDetails && serviceDetails.vehicleId }}</p>
    <p>Serviço: {{ getServiceDescription(serviceDetails && serviceDetails.servicedefinitionId) }}</p>
    <p>Estado: 
      <select v-model="serviceDetails.estado" @change="handleEstadoChange"  class="estado">
        <option v-for="estado in estados" :value="estado" :key="estado">{{ estado }}</option>
      </select>
    </p>
    <p>Duração: {{ serviceDetails && serviceDetails.duracao }}</p>
    <p>Hora prevista de término: {{  endTime }}</p>
    <p>Descrição: {{ serviceDetails && serviceDetails.descrição }}</p>
    <p>Serviços Extra:
      <select v-model="serviceDetails.selectedExtraServices" @change="handleServicoExtra" ref="servicoExtraSelect" class="estado">
        <option v-for="serviceDef in serviceDefinitions" :value="serviceDef.id" :key="serviceDef.id">{{ serviceDef.descr }}</option>
      </select>
    </p>

  </div>
  <div class="client-info">
    <h1>Detalhes do Cliente:</h1>
    <p>Nome: {{  getClientName() }}</p>
    <p>Contacto: {{  getClientContact() }}</p>
  </div>
</template>

<script>


export default {
  data() {
    return {
      serviceDetails: {},
      serviceDefinitions: [],
      clients: [],
      vehicles: [],
      estados: ['atribuido', 'agendado', 'parado', 'realizado'],
      endTime: "",
      selectedExtraServices: []
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
        this.serviceDetails = data;
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

    async updateServiceStatus() {
      const serviceId = this.$route.params.serviceId;
      try {
        const response = await fetch(`http://localhost:3000/services/${serviceId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...this.serviceDetails, // Mantém todas as outras informações intactas
            estado: this.serviceDetails.estado // Atualiza apenas o estado
          })
        });
        if (!response.ok) {
          throw new Error("Erro ao atualizar o estado do serviço.");
        }
        console.log('Estado do serviço atualizado com sucesso.');
      } catch (error) {
        console.error('Erro ao atualizar o estado do serviço:', error.message);
      }
    },

    handleEstadoChange() {
        this.updateServiceStatus();
    },

    getServiceDescription(serviceId) {
        
      if (this.serviceDefinitions) {
          const serviceDef = this.serviceDefinitions.find(def => def.id === serviceId);
          return serviceDef ? serviceDef.descr : "Desconhecido";
      }
      return "Desconhecido";
    },

    async fetchVehicles(){
      const url = "http://localhost:3000/vehicles";
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Erro ao buscar os veículos: " + response.statusText);
        }
        const data = await response.json();
        this.vehicles = data;
      } catch (error) {
        console.error("Erro ao buscar os veículos:", error.message);
      }
    },

    async fetchClients(){
      const url = "http://localhost:3000/clients";
      try{
            const response = await fetch(url);
            if(!response.ok){
                throw new Error("Erro ao buscar as informações d cliente: " + response.statusText);
            }
            const data = await response.json();
            this.clients = data;
        }catch(error){
            console.error("Erro ao buscar as informações do cliente:", error.message);
        }
    },

    getClientId() {
      if (this.serviceDetails && this.vehicles) {
        const vehicleId = this.serviceDetails.vehicleId;
        const vehicle = this.vehicles.find(vehicle => vehicle.id === vehicleId);
        return vehicle ? vehicle.clientId : "Desconhecido";
      }
      return "Desconhecido";
    },


    getClientName() {
      const clientId = this.getClientId();
      if (clientId && this.clients) {
        const client = this.clients.find(client => client.id === clientId);
        return client ? client.nome : "Desconhecido";
      }
      return "Desconhecido";
    },

    getClientContact() {
      const clientId = this.getClientId();
      if (clientId && this.clients) {
        const client = this.clients.find(client => client.id === clientId);
        return client ? client.telefone : "Desconhecido";
      }
      return "Desconhecido";
    },

    async calculateEndTime() {
      if (this.serviceDetails && this.serviceDetails.data && this.serviceDetails.duracao) {
        const { dia, mes, ano, hora, minutos } = this.serviceDetails.data;
        
        const startDate = new Date(ano, mes - 1, dia, hora, minutos);
        
        const endDate = new Date(startDate.getTime() + (this.serviceDetails.duracao * 60000));
        
        const formattedEndDate = `${endDate.getDate()}/${endDate.getMonth() + 1}/${endDate.getFullYear()}, ${endDate.getHours()}:${endDate.getMinutes().toString().padStart(2, '0')}`;

        return formattedEndDate;
      } else {
        return "Não foi possível calcular a hora prevista de término";
      }
    },

    getServiceDuration(serviceId) {
        
      if (this.serviceDefinitions) {
          const serviceDef = this.serviceDefinitions.find(def => def.id === serviceId);
          return serviceDef.duração;
      }
    },
    
    async addExtraService(serviceId) {
      const serviceDetails = this.serviceDetails;
      try {
        const response = await fetch('http://localhost:3000/services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            vehicleId: serviceDetails.vehicleId,
            workerId: '', 
            servicedefinitionId: serviceId,
            estado: 'agendado',
            duracao: this.getServiceDuration(serviceId),
            descrição: '',
            servicosextra: ''
          })
        });
        if (!response.ok) {
          throw new Error('Erro ao adicionar serviço extra.');
        }
        console.log('Serviço extra adicionado com sucesso.');
        // Recarregar os detalhes do serviço após adicionar o serviço extra
        await this.fetchServiceDetails();
      } catch (error) {
        console.error('Erro ao adicionar serviço extra:', error.message);
      }
    },

    handleServicoExtra() {
      // Atualiza a propriedade selectedExtraServices com os serviços extras selecionados
      const selectedOptions = Array.from(
        this.$refs.servicoExtraSelect.selectedOptions,
        option => option.value
      );
      this.serviceDetails.selectedExtraServices = selectedOptions;
      // Adiciona cada serviço extra selecionado
      selectedOptions.forEach(serviceId => {
        this.addExtraService(serviceId);
      });
    }

  },
  async created() {
    await this.fetchServiceDetails();
    await this.fetchServiceDefinitions();
    await this.fetchClients();
    await this.fetchVehicles();
    this.endTime = await this.calculateEndTime()
  }
};
</script>

<style scoped>
.service-page {
  max-width: 500px;
  margin: 40px auto;
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
}

.client-info {
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  text-align: left;
}

.client-info h1 {
  color: #333;
  font-size: 18px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 4px;
  margin-bottom: 12px;
}

.client-info h3:last-child { /* Citação */
  font-style: italic;
}

@media (max-width: 768px) {
  .client-info {
      margin: 20px;
      padding: 10px;
  }
  .client-info h1 {
      font-size: 16px;
  }
}

.estado {
  border-top: none;
  border-right: none;
  border-left: none;
  border-bottom: 1px solid black;
  padding: 5px;
  background-color: #f9f9f9;
  font-size: 15px;
}

</style>