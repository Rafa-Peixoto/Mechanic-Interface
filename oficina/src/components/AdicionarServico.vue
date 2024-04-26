<template>
     <div id="app">
        <div class="form-container">
            <h2>Adicionar Cliente</h2>
            <form @submit.prevent="addCliente">
                <label for="nome">Nome:</label>
                <input type="text" id="nome" v-model="novoCliente.nome" required>

                <label for="morada">Morada:</label>
                <input type="text" id="morada" v-model="novoCliente.morada" required>

                <label for="telefone">Número de Contacto:</label>
                <input type="text" id="telefone" v-model="novoCliente.telefone" required>

                <button type="submit">Adicionar Cliente</button>
            </form>
        </div>

        <div class="form-container">
            <h2>Adicionar Veículo</h2>
            <form @submit.prevent="addVeiculo">
                <label for="matricula">Matrícula:</label>
                <input type="text" id="matricula" v-model="novoVeiculo.matricula" required>

                <label for="tipoMotor">Tipo de Motor:</label>
                <select id="tipoMotor" v-model="novoVeiculo.tipoMotor" required>
                    <option value="">Selecione o Tipo de Motor</option>
                    <option value="gasolina">Gasolina</option>
                    <option value="gasoleo">Gasóleo</option>
                    <option value="eletrico">Elétrico</option>
                    <option value="hibrido">Híbrido</option>
                </select>

                <label for="marca">Marca:</label>
                <input type="text" id="marca" v-model="novoVeiculo.marca" required>

                <label for="modelo">Modelo:</label>
                <input type="text" id="modelo" v-model="novoVeiculo.modelo" required>

                <label for="jantes">Jantes:</label>
                <input type="text" id="jantes" v-model="novoVeiculo.jantes">

                <label for="potencia">Potência de Motor (se elétrico):</label>
                <input type="text" id="potencia" v-model="novoVeiculo.potencia">

                <button type="submit">Adicionar Veículo</button>
            </form>
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
  }
};
</script>

<style scoped>
         body {
            font-family: Arial, sans-serif;
            padding: 20px;
            display: flex;
            justify-content: space-around;
        }
        .form-container {
            background: #f0f0f0;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h2 {
            color: #333;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input, select {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border-radius: 4px;
            border: 1px solid #ccc;
        }
        button {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background-color: #45a049;
        }
</style>