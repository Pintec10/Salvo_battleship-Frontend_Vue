import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'

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
    logout: (state) => {
      state.loggedUser.id = null;
      state.loggedUser.name = null;
      state.logged = false;
    }
  },

  actions: {
    login: (context, payload) => {
      console.log("called login, sending this:");
      console.log(payload);
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
        .then(response => {
          if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
          } else { return Promise.reject(new Error(response.statusText)) }
        })
        //.then(response => {
        //  context.dispatch("responseStatusCheck", response);
        //})
        .then((response) => {
          console.log('Request was successful! ', response);
          context.dispatch("fetchActiveUserContent");
          router.push("/leaderboard");
        })
        .catch(function (error) {
          console.log('Request failure: ', error);
          alert("Login did not succeed! " + error)
        });
    },

    fetchActiveUserContent(context) {
      console.log("dispatching fetchActiveUserContent");
      fetch("/api/games")
        .then(response => {
          if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
          } else { return Promise.reject(new Error(response.statusText)) }
        })
        //.then(response => {
        //  context.dispatch("responseStatusCheck", response);
        //})
        .then(response => response.json())
        .then(json => {
          context.commit("login", json.current_user);
        })
        .catch(error => {
          alert("There was a problem in retrieving user data. " + error);
        })
    },

    //REMOVE IF NOT USED IN THE END
    responseStatusCheck(response) {
      console.log("checking status...");
      if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
      } else {
        console.log("it's NOT ok!");
        return Promise.reject(new Error(response.statusText));
      }
    },

    logout(context) {
      fetch("/api/logout", { method: "post" })
        .then(response => {
          console.log("logging off");
          console.log(response);
          context.commit("logout");
        });
    }
  },

  modules: {
  }
})
