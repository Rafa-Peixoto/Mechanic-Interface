<template>
   <div id="app" class="container">
    <div>
      <h2>Agendar Serviço</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Veículo</th>
            <th>Serviço</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input type="text" v-model="newService.nif" placeholder="NIF do Cliente">
            </td>
            <td>
              <input type="text" v-model="newService.vehicleId" placeholder="Matrícula do Veículo">
            </td>
            <td>
              <select v-model="selectedService">
                <option v-for="service in serviceDefinitions" :key="service.id" :value="service.id">{{ service.descr }}</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <button @click="scheduleService">Agendar Serviço</button>
    </div>
    
    <div>
      <h2>Adicionar Veículo</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Matrícula</th>
            <th>Tipo</th>
            <th>Kilómetros</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="text" v-model="newVehicle.matricula"></td>
            <td>
              <select v-model="newVehicle.tipo">
                <option value="gasolina">Gasolina</option>
                <option value="gasoleo">Gasóleo</option>
                <option value="eletrico">Elétrico</option>
                <option value="hibrido">Híbrido</option>
              </select>
            </td>
            <td><input type="text" v-model="newVehicle.kms"></td>
          </tr>
        </tbody>
      </table>
      <button @click="addVehicle">Adicionar Veículo</button>
    </div>
    
    <div>
      <h2>Adicionar Cliente</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="text" v-model="newClient.nome"></td>
            <td><input type="text" v-model="newClient.email"></td>
            <td><input type="text" v-model="newClient.telefone"></td>
          </tr>
        </tbody>
      </table>
      <button @click="addClient">Adicionar Cliente</button>
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
      services: [],
      vehicles: [],
      clients: [],
      serviceDefinitions: [],
      vehicleTypes: [],
      workers: [],
      newClient: {
        id: "",
        nif: "",
        nome: "",
        telefone: "",
        veiculos: [],
      },
      newVehicle: {
        id: "",
        clientId: "",
        vehicletypeId: "",
        cilindrada: "",
        kms: ""
      },
      newService: {
        nif: "",
        vehicleId: "",
        },
      selectedService: null,
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
    async fetchClients(){
      const url = "http://localhost:3000/clients";
      try{
            const response = await fetch(url);
            if(!response.ok){
                throw new Error("Erro ao buscar os clients: " + response.statusText);
            }
            const data = await response.json();
            this.clients = data;
        }catch(error){
            console.error("Erro ao buscar os clients:", error.message);
        }
    },
    async fetchVehicles() {
      const url = 'http://localhost:3000/vehicles';
      try {
          const response = await fetch(url);
          if (!response.ok) {
              throw new Error("Erro ao buscar veículos: " + response.statusText);
          }
          this.vehicles = await response.json();
      } catch (error) {
          console.error("Erro ao buscar veículos:", error.message);
      }
    },
    async fetchVehicleTypes(){
      const url = 'http://localhost:3000/vehicle-types';
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
    async fetchWorkers() {
      const url = 'http://localhost:3000/workers';
      try {
          const response = await fetch(url);
          if (!response.ok) {
              throw new Error("Erro ao buscar os mecânicos: " + response.statusText);
          }
          const data = await response.json();
          this.workers = data;
      } catch (error) {
          console.error("Erro ao buscar os mecânicos:", error.message);
      }
    },
    getServiceDescription(serviceId) {
        
        if (this.serviceDefinitions) {
            const serviceDef = this.serviceDefinitions.find(def => def.id === serviceId);
            return serviceDef ? serviceDef.descr : "Desconhecido";
        }
        return "Desconhecido";
    },
    getPostoDescription(serviceDefinitionId) {
      const isGeneral = this.vehicleTypes.some(vt => vt.id == 'gerais' && vt.serviços.includes(serviceDefinitionId));
      const isGasolineDiesel = this.vehicleTypes.some(vt => (vt.id == 'gasolina' || vt.id == 'gasoleo') && vt.serviços.includes(serviceDefinitionId));
      const isElectricHybrid = this.vehicleTypes.some(vt => (vt.id == 'eletrico' || vt.id == 'hibrido') && vt.serviços.includes(serviceDefinitionId));
      console.log("Isgeneral",isGeneral);
      // Retorna um valor com base na condição encontrada
      if (isGeneral) {
        return 1;  // Presente nos tipos de veículos gerais
      } else if (isGasolineDiesel) {
        return 2;  // Presente nos tipos de veículos de gasolina e gasóleo
      } else if (isElectricHybrid) {
        return 3;  // Presente nos tipos de veículos elétricos e híbridos
      }

      return 0;  // Não encontrado em nenhuma lista específica
    },

    formatDate(data) {
      if (data) {
          return `${data.dia}/${data.mes}/${data.ano} ${data.hora}:${data.minutos}`;
      }
      return "-";
    },
    sortByDate(services) {
      return services.sort((a, b) => {
        // Verifica se ambos os serviços têm data.
        const dateA = a.data ? new Date(`${a.data.ano}-${a.data.mes.toString().padStart(2, '0')}-${a.data.dia.toString().padStart(2, '0')}T${a.data.hora}:${a.data.minutos}`) : null;
        const dateB = b.data ? new Date(`${b.data.ano}-${b.data.mes.toString().padStart(2, '0')}-${b.data.dia.toString().padStart(2, '0')}T${b.data.hora}:${b.data.minutos}`) : null;

        // Ordena os serviços de acordo com as datas, colocando os mais antigos primeiro.
        if (dateA && dateB) {
          return dateA - dateB;
        } else if (!dateA && !dateB) {
          return 0;
        } else if (!dateA) {
          return 1; // Se não houver data em 'a', colocamos 'a' após 'b'.
        } else {
          return -1; // Se não houver data em 'b', colocamos 'a' antes de 'b'.
        }
      });
    },
    addClient() {
          // Implementar adição de cliente
    },
    addVehicle() {
      // Implementar adição de veículo
    },
    scheduleService() {
    // Verificar se o NIF inserido corresponde a algum cliente na base de dados
    const client = this.clients.find(client => client.nif === this.newService.nif);
    if (!client) {
      alert("É necessário criar um novo cliente com este NIF.");
      return;
    }

    // Verificar se o veículo está na base de dados
    console.log("matricula",this.newService.vehicleId);
    const vehicle = this.vehicles.find(vehicle => vehicle.id === this.newService.vehicleId);
    if (!vehicle) {
      alert("É necessário adicionar este veículo à base de dados.");
      return;
    }

    // Se ambas as verificações forem bem-sucedidas, enviar a solicitação POST para adicionar o serviço à base de dados
    const newServiceData = {
      id: "",
      vehicleId: vehicle.id,
      servicedefinitionId: this.selectedService, // Considerando que o serviço selecionado já está definido corretamente
      workerId: "", // Preencher com o ID do trabalhador responsável, se necessário
      estado: "agendado", // Preencher com o estado adequado, se necessário
      data: {
        dia: "",
        mes: "",
        ano: "",
        hora: "",
        minutos: "",
      },
      duracao: "", // Preencher com a duração do serviço, se necessário
      descricao: "", // Considerando que a descrição do serviço foi inserida corretamente
      servicosextra: "" // Preencher com serviços extras, se necessário
    };

    // Enviar solicitação POST para adicionar o serviço à base de dados
    fetch('http://localhost:3000/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newServiceData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao adicionar o serviço.');
      }
      alert('Serviço agendado com sucesso!');
    })
    .catch(error => {
      console.error('Erro ao adicionar o serviço:', error.message);
      alert('Erro ao agendar o serviço. Por favor, tente novamente mais tarde.');
    });
  }
  },
  async created() {
    const userStore = useUserStore();
    if (userStore.isLoggedIn) {
      this.user = userStore.user;
      try {
        await Promise.all([
          this.fetchServices(),
          this.fetchServiceDefinitions(),
          this.fetchVehicles(),
          this.fetchClients(),
          this.fetchVehicleTypes(),
          this.fetchWorkers(),
        ]);
        console.log("Carros",this.vehicles);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    } else {
      this.$router.push('/Login');
    }
  }
};
</script>

<style scoped>
    body {
      font-family: Arial, sans-serif;
    }

    .container {
      display: block;
      margin-top: 50px;
    }

    .container > div {
      text-align: center; /* Alinha o texto dos títulos ao centro */
      margin-bottom: 20px; /* Espaçamento entre as seções */
    }

    .table {
      margin: auto;
      border-collapse: collapse;
      width: 60%; /* Ajuste a largura conforme necessário */
    }

    .table th,
    .table td {
      border: 1px solid #ddd;
      padding: 8px;
    }

    .table th {
      background-color: #f2f2f2;
    }

    .table td input[type="text"], .table td select {
      width: 100%;
      padding: 5px;
      box-sizing: border-box;
    }

    button {
      padding: 10px 15px;
      background-color: #007bff;
      color: #fff;
      border: none;
      cursor: pointer;
      margin-top: 10px; /* Espaço acima do botão */
    }

    button:hover {
      background-color: #0056b3;
    }

    /* Estilos adicionados para centralizar os botões */
    .button-container {
      display: flex;
      justify-content: center; /* Alinha horizontalmente ao centro */
      align-items: center; /* Alinha verticalmente ao centro */
      margin-top: 10px; /* Espaço acima do contêiner do botão */
    }

    /* Estilo para inputs e selects para ocuparem 100% da célula da tabela */
    .table td input, .table td select {
      width: 100%;
    }
</style>
