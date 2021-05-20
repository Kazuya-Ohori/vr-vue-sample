import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const state = {
  isLoading: false,
  showMap: false,
  showIntro: false,
  panoData: [],
  map: [],
  intro: [],
  panos: [],
  viewer: "",
  currentPano: "",
  playingVideo: "",
  options: {
    booth_id: null,
    title: null,
    logo: null,
    logo_link: null,
    infoSpotIcon: null,
    linkIcon: null
  },
  currentModal: {
    panoId: "",
    soptId: ""
  }
};

const mutations = {
  toggleLoading(state, flg) {
    state.isLoading = flg;
  },
  toggleMap(state, flg) {
    if (flg !== undefined) {
      state.showMap = flg;
    } else {
      state.showMap = !state.showMap;
    }
  },
  toggleIntro(state, flg){
    if (flg !== undefined) {
      state.showIntro = flg;
    } else {
      state.showIntro = !state.showIntro;
    }
  },
  setMapData(state, res) {
    state.map = res.data.map;
  },
  setIntroData(state, res) {
    state.intro = res.data.intro;
    if(res.data.intro && res.data.intro.text && res.data.intro.image){
      state.showIntro = true;
    }
  },
  setPanoData(state, res) {
    state.panoData = res.data.panoramas;
    state.options = res.data.options;
  },
  setViewer(state, viewer) {
    state.viewer = viewer;
  },
  setPanos(state, panos) {
    state.panos = panos;
  },
  setCurrentPano(state, panoId) {
    state.currentPano = panoId;
  },
  setVideo(state, video) {
    state.playingVideo = video;
  },
  setCurrentModal(state, { panoId, spotId }) {
    state.currentModal = { panoId, spotId };
  },
  updatePanoData(state, { panoId, spotId, flg }) {
    state.panoData.forEach((el, index) => {
      if (el.id === panoId) {
        for (let i = 0; i < el.infoSpots.length; i++) {
          if (el.infoSpots[i].id === spotId) {
            state.panoData[index].infoSpots[i].modalShow = flg;
          }
        }
      }
    });
  }
};

const actions = {};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules: {}
});
