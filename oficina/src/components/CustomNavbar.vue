<template>
  <nav id="nav" :class="{ 'login-nav': isLoginPage }">
    <img src="../../public/logo2.1.png" alt="Logo da E.S.Ideal" />
    <div class="nav-items">
      <div class="links-container">
        <router-link to="/Perfil">Perfil</router-link>
        <router-link to="/ServicosAtribuidos">Serviços Atribuídos</router-link>
        <router-link to="/ServicosAgendados">Serviços Agendados</router-link>          
        <router-link to="/ServicosTerminados">Serviços Terminados</router-link>
      </div>
    </div>
    <div class="logout">
      <button @click="handleLogout">Logout</button>
    </div>
  </nav>
</template>

<script>
import {useUserStore} from '../stores.js';
export default {
  data() {
    return {
      isLoginPage: false
    };
  },
  created() {
    if (this.$route.path === '/Login') {
      this.isLoginPage = true;
    }
  },
  methods: {
    async handleLogout() {
      try {
        const userStore = useUserStore();
        const workerId = userStore.workerId; // Recuperar o workerId
        await this.recordExit(workerId);
        this.$router.push('/Login');
      } catch (error) {
        console.error('Falha ao executar o logout:', error);
      }
    },

    async recordExit(workerId) {
      const response = await fetch(`http://localhost:3000/workers/${workerId}`);
      const worker = await response.json();

      const lastShift = worker.shifts.find(shift => !shift.exit);
      if (lastShift) {
        lastShift.exit = new Date().toISOString();
      }

      await fetch(`http://localhost:3000/workers/${workerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(worker)
      });
    }
  }
};

</script>

<style scoped>

.login-nav {
display: none;
}

#nav {
display: flex;
justify-content: space-between;
align-items: center;
padding: 10px 10px;
background-color: #86ff86;
width: 100%;
position: relative;
top: -8px;
left: -8px;
}

h3{
font-size: 30px;
}

.links-container {
display: flex;
flex-wrap: wrap;
}

a {
text-decoration: none;
padding: 0.5rem 1rem;
font-weight: 600;
border: 1px solid rgb(0, 0, 0);
border-radius: 5px;
color: var(--color-accent);
transition: all 0.3s ease-in;
margin: 5px;
font-size: 20px;
background-color: #86ff86;
}

a.router-link-active {
background-color: var(--color-accent);
color: var(--color-light);
background-color: #86ff86;
}

a:hover{
background-color: black;
color: white;
}

img {
height: 60px; /* ou qualquer outra altura que você preferir */
}

.logout button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 1rem;
  font-weight: 600;
  border: 1px solid rgb(0, 0, 0);
  border-radius: 5px;
  color: rgb(255, 255, 255);
  background-color: #188830;
  border-color:#188830;
  margin-right: 20px;
  cursor: pointer;
  transition: all 0.3s ease-in;
}

.logout button:hover {
  background-color: #a9fdac;
}

</style>