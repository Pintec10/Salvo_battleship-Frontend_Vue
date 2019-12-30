import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
const proxi = "https://infinite-shore-25867.herokuapp.com"
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    logged: false,
    loggedUser: {
      id: null,
      name: null
    },
    loadingLogin: false,
    loadingRegister: false,
    loadingDemo: false,
    alertPopup: {
      visible: false,
      message: ""
    },
    shipPlacementList: [],
    salvoPlacementList: []
  },

  getters: {
    logged: state => { return state.logged; },
    loggedUser: state => { return state.loggedUser; },
    loadingLogin: state => { return state.loadingLogin },
    loadingDemo: state => { return state.loadingDemo },
    loadingRegister: state => { return state.loadingRegister },
    alertPopup: state => { return state.alertPopup },
    shipPlacementList: state => { return state.shipPlacementList },
    salvoPlacementList: state => { return state.salvoPlacementList }
  },

  mutations: {
    login: (state, payload) => {
      state.loggedUser = payload;
      if (payload.id === null) {
        state.logged = false;
      } else state.logged = true;
    },
    logout: (state) => {
      state.loggedUser.id = null;
      state.loggedUser.name = null;
      state.logged = false;
    },
    setLoadingLogin: (state, payload) => {
      state.loadingLogin = payload;
    },
    setLoadingDemo: (state, payload) => {
      state.loadingDemo = payload;
    },
    setLoadingRegister: (state, payload) => {
      state.loadingRegister = payload;
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
    updateShipPlacementList: (state, payload) => {
      state.shipPlacementList = payload;
    },
    updateSalvoPlacementList: (state, payload) => {
      let salvoList = state.salvoPlacementList;
      if (salvoList.some(oneCell => oneCell === payload)) {
        document.getElementById("cancel").play();
        salvoList.splice(salvoList.indexOf(payload), 1);
      } else if (payload === "reset") {
        salvoList.splice(0, salvoList.length);
      } else {
        let itemsToRemove = 0;
        if (salvoList.length > 4) {
          itemsToRemove = salvoList.length - 4;
        }
        salvoList.splice(0, itemsToRemove, payload);
        document.getElementById("target").play();
      }
    }
  },

  actions: {
    login: (context, payload) => {
      //display loaders on buttons
      if (payload.username === "demoplayer@salvo") {
        context.commit("setLoadingDemo", true)
      } else { context.commit("setLoadingLogin", true) }

      //build JSON for posting to backend
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

      //posting to backend
      fetch(proxi + "/api/login", {
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
        .then(() => {
          context.dispatch("fetchActiveUserContent");
          router.push("/game_list");
        })
        .catch(() => {
          context.commit("setLoadingDemo", false);
          context.commit("setLoadingLogin", false);
          context.commit("alertPopupOn", { type: "error", message: "Please check username and password" })
          setTimeout(() => {
            context.commit("alertPopupOff");
          }, 6000);
        });
    },

    fetchActiveUserContent(context) {
      fetch(proxi + "/api/games", {
        credentials: 'include',
      })
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
      fetch(proxi + "/api/logout", { method: "POST", credentials: 'include' })
        .then(() => {
          context.commit("logout");
          router.push("/login");
        });
    },

    createUser(context, payload) {
      fetch(proxi + "/api/players", {
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
            context.commit("alertPopupOn", { type: "success", message: "Account successfully created!" })
            setTimeout(() => {
              context.commit("alertPopupOff");
              context.dispatch("login", payload);
            }, 2000);
          }
        })
        .catch(error => {
          alert("Could not create new user", error);
        })
    }
  }
})
