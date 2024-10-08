import { defineStore } from "pinia";

export const useMessageStore = defineStore('message',{
    state: () => ({ message: ''
    }),
    actions: {
        async setMessage(message) {
            this.message = message;
        }
    }
});

export const  useUserStore = defineStore('user',{
    state: () => ({ 
        user: null,
        workerId: null,
        isLoggedIn: false
    }),
    actions: {
        setUser(user){
            this.user= user;
            this.isLoggedIn = true;
        },
        logout() {
            this.user = null;
            this.isLoggedIn = false;
        },
        setWorkerId(id) {
            this.workerId = id;
        }
    },
    getters: {
      getUser: (state) => state.user,
      getWorkerId: (state) => state.workerId
    }
});