import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    logged: false,
    loggedUser: {
      id: null,
      name: null
    }
  },

  getters: {
    logged: state => { return state.logged; },
    loggedUser: state => { return state.loggedUser; }
  },

  mutations: {
    login: (state, payload) => {
      console.log("called mutation, sending this:");
      console.log(payload);
      state.loggedUser = payload;
      state.logged = true;
    },
  },

  actions: {
    login: (context, payload) => {
      console.log("called login, sending this:");
      console.log(payload);
      console.log(payload.username);
      var credentials = {
        username: payload.username,
        password: payload.password
      }

      function getBody(jsondata) {
        var body = [];
        for (var key in jsondata) {
          var encKey = encodeURIComponent(key);
          var encVal = encodeURIComponent(jsondata[key]);
          body.push(encKey + "=" + encVal);
        }
        return body.join("&");
      }

      fetch("/api/login", {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        body: getBody(credentials)
      })
        .then((data) => {
          console.log('Request was successful! ', data);
          context.dispatch("fetchActiveUser");
        })
        .catch(function (error) {
          console.log('Request failure: ', error);
        });
    },

    fetchActiveUser(context) {
      console.log("dispatching fetchActiveUser");
      fetch("/api/games")
        .then(response => response.json())
        .then(json => {
          console.log("jsonized response: ");
          console.log(json.current_user);
          context.commit("login", json.current_user);
        })
        .catch(error => {
          console.log("Errore trying to fetch user: ", error);
        })
    }
  },

  modules: {
  }
})
