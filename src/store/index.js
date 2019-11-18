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
    },
    alertPopup: {
      visible: false,
      message: ""
    }
  },

  getters: {
    logged: state => { return state.logged; },
    loggedUser: state => { return state.loggedUser; },
    alertPopup: state => { return state.alertPopup }
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
    },
    alertPopupOn: (state, payload) => {
      state.alertPopup.visible = true;
      state.alertPopup.type = payload.type;
      state.alertPopup.message = payload.message;
    },
    alertPopupOff: (state) => {
      state.alertPopup.visible = false;
      setTimeout(() => {
        state.alertPopup.message = "";
        state.alertPopup.type = "info";
      }, 1000);
    },
  },

  actions: {
    login: (context, payload) => {
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
        .then((response) => {
          console.log('Request was successful! ', response);
          context.dispatch("fetchActiveUserContent");
          router.push("/game_list");
        })
        .catch(function (error) {
          context.commit("alertPopupOn", { type: "error", message: error })
          setTimeout(() => {
            context.commit("alertPopupOff");
          }, 6000);
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
        .then(response => response.json())
        .then(json => {
          context.commit("login", json.current_user);
        })
        .catch(error => {
          context.commit("alertPopupOn", { type: "error", message: error })
          setTimeout(() => {
            context.commit("alertPopupOff");
          }, 6000);
        })
    },

    logout(context) {
      fetch("/api/logout", { method: "POST" })
        .then(() => {
          context.commit("logout");
          router.push("/leaderboard");
        });
    },

    createUser(context, payload) {
      fetch("/api/players", {
        credentials: 'include',
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: payload.username, password: payload.password })
      })
        .then(response => {
          if ((response.status >= 200 && response.status < 300) || response.status === 403) {
            return Promise.resolve(response.json());
          } else { return Promise.reject(new Error(response.statusText)) }
        })
        .then(data => {
          if ("error" in data) {
            context.commit("alertPopupOn", { type: "error", message: data.error })
            setTimeout(() => {
              context.commit("alertPopupOff");
            }, 6000);
          } else {
            console.log("successfully created, now proceeding to login")
            console.log(data);
            context.commit("alertPopupOn", { type: "success", message: "Account successfully created!" })
            setTimeout(() => {
              context.commit("alertPopupOff");
              context.dispatch("login", payload);
            }, 2000);
          }
        })
        .catch(error => {
          console.log("error in creating user", error);
          console.log(error);
        })
    }
  },

  modules: {
  }
})
