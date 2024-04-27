<template>
    <nav id="nav" :class="{ 'login-nav': isLoginPage }">
      <h3>E.S.Ideal</h3>
      <div class="nav-items">
        <div class="links-container">
          <router-link to="/Perfil">Perfil</router-link>
          <router-link to="/ServicosAtribuidos">Serviços Atribuídos</router-link>
          <router-link to="/ServicosAgendados">Serviços Agendados</router-link>
          <router-link to="/ServicosTerminados">Serviços Terminados</router-link>
        </div>
      </div>
      <div class="logout">
          <router-link to="/Login">Logout</router-link>
        </div>
    </nav>
  </template>

<script>
//import router from '@/router';

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
    background-color: #a9fdac;
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
  }

  a.router-link-active {
    background-color: var(--color-accent);
    color: var(--color-light);
  }

  a:hover{
    background-color: black;
    color: white;
  }

  .logout a{
    display: flex;
    flex-wrap: wrap;
    color: black;
    border: none;
  }
  .logout a:hover{
    cursor: pointer;
    background-color: #a9fdac;
  }

</style>