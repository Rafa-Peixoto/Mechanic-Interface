<template>
  <div class="login-container">
    <h1>Página de Login</h1>
    <form @submit.prevent="submitLogin">
      <div>
        <label for="id">Identificador:</label>
        <input type="text" id="id" v-model="credentials.id" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="credentials.password" required>
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <div class="actions">
        <button type="submit">Login</button>
      </div>
    </form>
  </div>
</template>

<script>
import {useUserStore} from '../stores.js';
export default {
  name: 'LoginPage',
  data() {
    return {
      credentials: {
        id: '',
        password: ''
      },
      errorMessage: ''
    };
  },
  methods: {
     async submitLogin() {
      try {
        // Usando filtros para buscar o worker com identificador e password específicos
        const url = `http://localhost:3000/workers?id=${this.credentials.id}&password=${this.credentials.password}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.length > 0) {
          // Se login bem sucedido, redirecionar para a página principal
          const userStore = useUserStore();
          userStore.setUser(data[0]);
          this.$router.push('/ServicosAtribuidos'); // substitua '/main' pela rota da sua página principal
        } else {
          // Se nenhum usuário correspondente foi encontrado
          this.errorMessage = 'Identificador ou password incorretos.';
        }
      } catch (error) {
        // Se ocorrer um erro na chamada fetch (ex: rede)
        this.errorMessage = 'Erro de conexão.';
      }
    },
  }
};
</script>

<style scoped>
.login-container {
  max-width: 300px;
  margin: auto;
  padding: 80px;
  text-align: center;
  background-color: #f0fff0;
}

.login-container h1 {
  margin-bottom: 50px;
  color: #0e790e;
}

.login-container div {
  margin-bottom: 10px;
}

.login-container .actions {
  display: flex;
  justify-content: space-between;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 8px;
  border: 0;
  border-bottom: 1px solid black;
  background-color: #f0fff0;
  text-align: center;
}

button {
  padding: 10px 15px;
  justify-content: center;
  cursor: pointer;
}

button[type="submit"] {
  margin-top: 10px;
  border-radius: 5px;
  background-color: #006400;
  color: white;
  border: none;
}

button[type="button"] {
  background-color: red;
  color: white;
}

button[type="submit"]:hover {
  background-color: black; /* Cor do botão no hover */
}

.error-message {
  color: red;
}

.actions {
  margin-left: 115px;
  margin-top: 20px;
}

img {
  height: 70px; /* ou qualquer outra altura que você preferir */
}

</style>

