<template>
  <div class="login-container">
    <h1>Página de Login</h1>
    <form @submit.prevent="submitLogin">
      <div>
        <label for="identifier">Identificador:</label>
        <input type="text" id="identifier" v-model="credentials.identifier" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="credentials.password" required>
      </div>
      <div class="actions">
        <button type="submit">Login</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      credentials: {
        identifier: '',
        password: ''
      }
    };
  },
  methods: {
    submitLogin() {
      // Implementar lógica de login
      console.log('Login realizado com:', this.credentials);
    },
  }
};
</script>

<style scoped>
.login-container {
  max-width: 300px;
  margin: auto;
  border: 1px solid #000;
  padding: 20px;
  text-align: center;
}

.login-container h1 {
  margin-bottom: 20px;
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
}

button {
  padding: 10px 15px;
  cursor: pointer;
}

button[type="submit"] {
  background-color: blue;
  color: white;
}

button[type="button"] {
  background-color: red;
  color: white;
}
</style>
