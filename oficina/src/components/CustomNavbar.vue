<template>
    <nav id="nav" :class="{ 'login-nav': isLoginPage }">
      <h3>E.S.Ideal</h3>
      <div class="nav-items">
        <router-link to="/Perfil">Perfil</router-link>
        <router-link to="/Servicos">Serviço Agendado</router-link>
        <router-link to="/Servicoterminado">Serviço Terminado</router-link>
      </div>
    </nav>
  </template>

<script>
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
    padding: 0 50px;
    background-color: #a9fdac;
  }
  
  h3{
    font-size: 30px;
  }
  
  a {
    text-decoration: none;
    padding: 0.5rem 1.5rem;
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

</style>