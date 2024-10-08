<template>
  <div class="main-container">
    <div class="service-page">
      <h1>Detalhes do Serviço</h1>
      <p>ID do Serviço: {{ $route.params.serviceId }}</p>
      <p>Matrícula: {{ serviceDetails && serviceDetails.vehicleId }}</p>
      <p>Serviço: {{ getServiceDescription(serviceDetails && serviceDetails.servicedefinitionId) }}</p>
      <p>Estado: 
        <select v-model="serviceDetails.estado" @change="handleEstadoChange" class="estado">
          <option v-for="estado in estados" :value="estado" :key="estado" :disabled="checkEstadoDisabled(estado)">{{ estado }}</option>
        </select>
      </p>
      <p>Duração: {{ serviceDetails && serviceDetails.duracao }}</p>
      <p>Hora prevista de término: {{ endTime }}</p>
      <p>Descrição:
         <textarea v-model="serviceDetails.descrição" @blur="updateServiceDetails"></textarea>
      </p>
      <p>Serviços Extra:
        <select v-model="serviceDetails.selectedExtraServices" @change="handleCreateServicoExtra" ref="servicoExtraSelect" class="estado">
          <option v-for="serviceDef in serviceDefinitions" :value="serviceDef.id" :key="serviceDef.id">{{ serviceDef.descr }}</option>
        </select>
      </p>
      <button @click="confirmDeleteService">Eliminar Serviço</button>
    </div>
    
    <div class="client-info">
      <h1>Detalhes do Cliente:</h1>
      <p>Nome: {{ getClientName() }}</p>
      <p>Contacto: {{ getClientContact() }}</p>
    </div>

    <div class="vehicle-info">
      <h1>Detalhes do Veículo:</h1>
      <p>Matrícula: {{ getVehicleDetails()?.id || 'Desconhecido' }}</p>
      <p>Marca: {{ getVehicleDetails()?.marca || 'Desconhecido' }}</p>
      <p>Modelo: {{ getVehicleDetails()?.modelo || 'Desconhecido' }}</p>
      <p>Cilindrada: {{ getVehicleDetails()?.cilindrada || 'Desconhecido' }}</p>
      <p>Potencia: {{ getVehicleDetails()?.potencia || 'Desconhecido' }}</p>
      <p>Jantes: {{ getVehicleDetails()?.jantes || 'Desconhecido' }}</p>
      <p>Kilómetros: {{ getVehicleDetails()?.kms || 'Desconhecido' }}</p>
    </div>
  </div>
</template>


<script>
import { useUserStore } from '../stores';

export default {
  data() {
    return {
      serviceDetails: {
         dataTerminado: {
        dia: "",
        mes: "",
        ano: "",
        hora: "",
        minutos: ""
      },
      },
      serviceDefinitions: [],
      clients: [],
      vehicles: [],
      vehicleTypes: [],
      estados: ['atribuido', 'agendado', 'parado', 'realizado', 'iniciado'],
      endTime: "",
      previousEstado: '',
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

    checkEstadoDisabled(estado) {
      // Desabilitar todas as opções exceto a atual se o estado é 'realizado'
      return this.serviceDetails.estado === 'realizado' && this.serviceDetails.estado !== estado;
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
        if (this.serviceDetails.estado === 'realizado') {
          const currentDate = new Date();
          this.serviceDetails.dataTerminado = {
            dia: String(currentDate.getDate()).padStart(2, '0'),
            mes: String(currentDate.getMonth() + 1).padStart(2, '0'), // Meses são baseados em zero
            ano: String(currentDate.getFullYear()),
            hora: String(currentDate.getHours()).padStart(2, '0'),
            minutos: String(currentDate.getMinutes()).padStart(2, '0')
          };
        }
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
      if (this.serviceDetails.estado === 'realizado') {
        await this.updateWorkerServicesDone(serviceId);
      }
        console.log('Estado do serviço atualizado com sucesso.');
      } catch (error) {
        console.error('Erro ao atualizar o estado do serviço:', error.message);
      }
    },

    async updateWorkerServicesDone(serviceId) {
    try {
      const workerId = this.serviceDetails.workerId; 
        
      this.clearOptions
      const workerResponse = await fetch(`http://localhost:3000/workers/${workerId}`);
      if (!workerResponse.ok) {
        throw new Error("Erro ao buscar os detalhes do trabalhador.");
      }
      const workerData = await workerResponse.json();

      // Adicione o ID do serviço aos servicesDone do trabalhador
      workerData.servicesDone.push(serviceId);

      // Atualize os detalhes do trabalhador no servidor
      const updateResponse = await fetch(`http://localhost:3000/workers/${workerId}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(workerData)
        });
        if (!updateResponse.ok) {
          throw new Error("Erro ao atualizar os serviços realizados do trabalhador.");
        }

        console.log('Serviço adicionado aos serviços realizados do trabalhador com sucesso.');
      } catch (error) {
          console.error('Erro ao adicionar serviço aos serviços realizados do trabalhador:', error.message);
      }
    },

    // handleEstadoChange() {
    //   if (['agendado'].includes(this.serviceDetails.estado)) {
    //     this.serviceDetails.workerId = "";
    //   }
    //   if (['atribuido', 'iniciado', 'parado'].includes(this.serviceDetails.estado)) {
    //     this.serviceDetails.workerId = this.user.id;
    //   }
    //     this.updateServiceStatus();
    // },

    handleEstadoChange() {
      // Armazena o estado anterior em caso de necessidade de reversão
      const estadoAnterior = this.serviceDetails.estado;

      // Condicionais para ajustar o `workerId` baseado no estado
      if (['agendado'].includes(this.serviceDetails.estado)) {
        this.serviceDetails.workerId = "";
      }
      if (['atribuido', 'iniciado', 'parado'].includes(this.serviceDetails.estado)) {
        this.serviceDetails.workerId = this.user.id;
      }

      // Verifica se o novo estado é 'realizado' e pede confirmação
      if (this.serviceDetails.estado === 'realizado') {
        if (!window.confirm("Tem a certeza que deseja marcar o serviço como realizado?")) {
          // Reverte para o estado anterior se o usuário cancelar a ação
          this.$nextTick(() => {
            this.serviceDetails.estado = estadoAnterior;
          });
          return; // Sai da função para não atualizar o estado
        }
      }

      // Procede com a atualização do serviço após a confirmação ou se a mudança de estado não necessitar confirmação
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
                throw new Error("Erro ao buscar as informações do cliente: " + response.statusText);
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

    async fetchVehicleTypes() {
      const url = "http://localhost:3000/vehicle-types";
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Erro ao buscar os tipos de veículos: " + response.statusText);
        }
        const data = await response.json();
        this.vehicleTypes = data;
      } catch (error) {
        console.error("Erro ao buscar os tipos de veículos:", error.message);
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
    handleAvailableServices() {
      // Limpa as opções do select antes de adicionar as opções disponíveis
      this.clearOptions();

      // Obtém o tipo de veículo do serviço atual
      const vehicleId = this.serviceDetails.vehicleId;
      const vehicle = this.vehicles.find(vehicle => vehicle.id === vehicleId);
      const vehicleTypeId = vehicle['vehicle-typeId'];

      // Encontra o tipo de veículo correspondente
      const vehicleType = this.vehicleTypes.find(type => type.id === vehicleTypeId);

      if (!vehicleType) {
        console.error('Tipo de veículo não encontrado:', vehicleTypeId);
        return;
      }

      // Obtém os serviços extras disponíveis para o tipo de veículo
      const availableServices = this.serviceDefinitions.filter(service => vehicleType['serviços'].includes(service.id));

      // Adiciona as opções disponíveis ao select
      availableServices.forEach(service => {
        const option = document.createElement('option');
        option.value = service.id;
        option.text = service.descr;
        this.$refs.servicoExtraSelect.appendChild(option);
      });
    },
    async handleCreateServicoExtra(event) {
      const selectedServiceId = event.target.value;
      await this.addExtraService(selectedServiceId);
    },
    getVehicleDetails() {
      if (this.serviceDetails && this.serviceDetails.vehicleId && this.vehicles.length > 0) {
        return this.vehicles.find(vehicle => vehicle.id === this.serviceDetails.vehicleId);
      }
      return null; // Se o veículo não for encontrado ou a lista de veículos ainda não estiver carregada
    },

    clearOptions() {
      // Remove todas as opções do select
      const select = this.$refs.servicoExtraSelect;
      while (select.firstChild) {
        select.removeChild(select.firstChild);
      }
    },
    confirmDeleteService() {
      if (window.confirm("Tem a certeza que deseja eliminar este serviço?")) {
        this.deleteService();
      }
    },
    deleteService() {
      const serviceId = this.$route.params.serviceId;
      fetch(`http://localhost:3000/services/${serviceId}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao eliminar o serviço.');
        }
        alert('Serviço eliminado com sucesso!');
        this.$router.push('/ServicosAtribuidos');  // Redirecionar o usuário para outra página, por exemplo, a lista de serviços
      })
      .catch(error => {
        console.error('Erro ao eliminar o serviço:', error.message);
        alert('Não foi possível eliminar o serviço. Por favor, tente novamente mais tarde.');
      });
    },
    updateServiceDetails() {
      const serviceId = this.$route.params.serviceId;
      fetch(`http://localhost:3000/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.serviceDetails)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao atualizar os detalhes do serviço.');
        }
        alert('Detalhes do serviço atualizados com sucesso.');
      })
      .catch(error => {
        console.error('Erro ao atualizar os detalhes do serviço:', error.message);
      });
    }
    
  },
  async created() {
    const userStore = useUserStore();
    if (userStore.isLoggedIn) {
      this.user = userStore.user;
      await this.fetchServiceDetails();
      await this.fetchServiceDefinitions();
      await this.fetchClients();
      await this.fetchVehicles();
      await this.fetchVehicleTypes();
      this.endTime = await this.calculateEndTime();
      this.handleAvailableServices();
    }
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

textarea {
  width: 100%;
  height: 100px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  resize: none;
  box-sizing: border-box;
}

textarea:focus {
  outline: none;
  border-color: #007bff;
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


.vehicle-info {
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  text-align: left;
}

.vehicle-info h1 {
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