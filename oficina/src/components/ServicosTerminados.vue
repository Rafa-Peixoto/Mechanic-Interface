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
    <table class="services-table">
        <thead>
            <tr>
                <th>Id</th>
                <th>Automóvel</th>
                <th>Serviço</th>
                <th>Estado</th>
                <th>Posto</th>
                <th>Data</th>
                <th>Duração</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="service in terminatedServices" :key="service.id">
                <td>
                    <router-link :to="{ name: 'ServiceDetails', params: { serviceId: service.id }}">{{ service.id }}</router-link>
                </td>
                <td>{{ service.vehicleId }}</td>
                <td>{{ getServiceDescription(service.servicedefinitionId) }}</td>
                <td>{{ service.estado }}</td>
                <td>Posto</td>
                <td>{{ formatDate(service.data) }}</td>
                <td>{{ service.duracao }}</td>
            </tr>
        </tbody>
    </table>
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

    getServiceDescription(serviceId) {
    
      if (this.serviceDefinitions) {
        const serviceDef = this.serviceDefinitions.find(def => def.id === serviceId);
        return serviceDef ? serviceDef.descr : "Desconhecido";
      }
      return "Desconhecido";
    },

     formatDate(data) {
      if (data) {
        return `${data.dia}/${data.mes}/${data.ano} ${data.hora}:${data.minutos}`;
      }
      return "-";
    },

  },
  created() {
    console.log("console log.");
    const userStore = useUserStore();
    if (userStore.isLoggedIn) {
      this.user = userStore.user;
      this.fetchServiceDefinitions();
      this.fetchServices();
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
  background-color: #4CAF50;
  color: white;
}

.services-table tr:nth-child(even) {
  background-color: #f2f2f2;
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
  .services-table, .services-table th, .services-table td {
    display: block;
  }

  .services-table th, .services-table td {
    text-align: right;
    padding-left: 50%;
    text-indent: -25px;
  }

  .services-table th {
    position: absolute;
    left: 0;
    width: 45%;
    top: auto;
    background-color: #4CAF50;
  }
}
</style>