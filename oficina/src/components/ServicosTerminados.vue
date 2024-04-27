<template>
  <div class="service-page">
    <div v-if="user">
      <h1>Bem-vindo, {{ user.name }}</h1>
    </div>

    <!-- Cabeçalho adicionado -->
    <div class="header">
        <h2>Página de Serviços Terminados</h2>
    </div>

    <!-- Tabela de serviços -->
    <div class="table-container">
      <table class="services-table">
          <thead>
              <tr>
                  <th>Id</th>
                  <th>Automóvel</th>
                  <th>Serviço</th>
                  <th>Estado</th>
                  <th>Posto</th>
                  <th>Data</th>
                  <th>Data de Entrega</th>
                  <th>Duração</th>
              </tr>
          </thead>
          <tbody>
              <tr v-for="service in terminatedServices" :key="service.id">
                  <td>
                      <router-link :to="{ name: 'ServiceDetails', params: { serviceId: service.id }}">{{ service.id }}</router-link>
                  </td>
                  <td data-label="Id">{{ service.vehicleId }}</td>
                  <td data-label="Serviço">{{ getServiceDescription(service.servicedefinitionId) }}</td>
                  <td data-label="Estado">{{ service.estado }}</td>
                  <td data-label="Posto">{{ getPostoDescription(service.servicedefinitionId)}}</td>
                  <td data-label="Data">{{ formatDate(service.data) }}</td>
                  <td data-label="Data de Entrega">{{ formatDate(service.dataTerminado) }}</td>
                  <td data-label="Duração">{{ service.duracao }}</td>
              </tr>
          </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../stores';

export default {
  name: 'PainelTerminados',
  data() {
    return {
      user: null,
      terminatedServices: [],
      serviceDefinitions: [],
      vehicleTypes:[]
    };
  },
  methods: {
    async fetchServices() {
      if (!this.user || !this.user.id) {
        console.error("Usuário não está logado ou ID do usuário não está disponível.");
        return;
      }
      
      const url = `http://localhost:3000/services`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Erro ao buscar serviços: " + response.statusText);
        }
        const data = await response.json();
        this.terminatedServices = data.filter(service => service.estado === "realizado" && service.workerId === this.user.id);
      } catch (error) {
        console.error('Erro ao buscar os serviços:', error.message);
      }
    },

    async fetchServiceDefinitions() {
      const url = `http://localhost:3000/service-definitions`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Erro ao buscar as definições de serviço: " + response.statusText);
        }
        const data = await response.json();
        this.serviceDefinitions = data;
      } catch (error) {
        console.error("Erro ao buscar as definições de serviço:", error.message);
      }
    },
    async fetchVehicleTypes() {
      const url = 'http://localhost:3000/vehicle-types';
      try {
          const response = await fetch(url);
          if (!response.ok) {
              throw new Error("Erro ao buscar os tipos de veículos: " + response.statusText);
          }
          this.vehicleTypes = await response.json();
      } catch (error) {
          console.error("Erro ao buscar os tipos de veículos:", error.message);
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
    }

  },
   async created() {
    const userStore = useUserStore();
    if (userStore.isLoggedIn) {
        this.user = userStore.user;
        await Promise.all([
            this.fetchServiceDefinitions(),
            this.fetchServices(),
            this.fetchVehicleTypes(),
        ]);
    } else {
        console.log("Nenhum usuário logado para buscar serviços.");
        this.$router.push('/Login');
    }
  }
};
</script>

<style scoped>
.service-page {
  max-width: 1000px;
  margin: auto;
  text-align: center;
}

.services-table {
    width: 100%;
    border-collapse: collapse;
    margin: 40px 0;
}

.services-table th,
.services-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.services-table th {
  background-color: #006400;
  color: white;
}

.services-table tr:nth-child(even) {
  background-color: #aec4ae;
}

.services-table tr:hover {
  background-color: #ddd;
}

.service-page h1 {
  color: #333;
  padding: 0px;
  font-size: 35px;
  margin-top: 10;
}

.header h2 {
  color: #333;
  padding: 0px;
  font-size: 25px;
}

@media screen and (max-width: 600px) {
  /* Faz com que cada célula da tabela seja exibida como um bloco, 
     o que as coloca em uma coluna única */
  .services-table, .services-table tbody, .services-table th, .services-table td, .services-table tr {
    display: block;
  }

  /* Esconde os cabeçalhos da tabela na vista de tela pequena */
  .services-table thead {
    display: none;
  }

  .services-table td {
    /* Cada célula ocupa 100% da largura da tela disponível */
    width: 100%;
    /* As células têm uma borda na parte inferior para separá-las visualmente */
    border-bottom: 1px solid #ddd;
    /* Posiciona o texto no início (esquerda) da célula */
    text-align: left;
    /* Adiciona um espaço antes do texto da célula para o rótulo */
    padding-left: 35%;
    /* Mantém o texto alinhado verticalmente ao centro */
    position: relative;
    /* Espaçamento interno no topo e na base de cada célula */
    padding-top: 0.5em;
    padding-bottom: 0.5em;
  }

  .services-table td:before {
    /* Usa o pseudo-elemento ::before para adicionar o nome do cabeçalho 
       antes de cada célula */
    content: attr(data-label);
    /* Posiciona o pseudo-elemento no início (esquerda) da célula */
    position: absolute;
    /* Posiciona o pseudo-elemento na esquerda da célula com algum espaço */
    left: 0;
    /* Espaçamento interno no topo do pseudo-elemento */
    padding-top: 0.5em;
    /* Define a largura do rótulo para 30% da célula */
    width: 30%;
    /* Alinha o texto à esquerda */
    text-align: left;
    /* Negrito para destacar que é o rótulo */
    font-weight: bold;
  }

  /* Ajusta o posicionamento da célula para que ela não sobreponha o rótulo */
  .services-table td {
    padding-left: 40%;
  }
}

</style>