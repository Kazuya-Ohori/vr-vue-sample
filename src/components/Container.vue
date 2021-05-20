<template>
  <div id="wrapper">
    <div
      v-if="isLoading"
      class="loading"
    >
      <img src="../assets/img/loading.svg" />
    </div>
    <div class="panel">
      <div
        id="container"
        @click="closeMap"
      />
      <div
        v-if="options.logo"
        class="logo"
      >
        <a
          v-if="options.logo_link"
          class="logo__link"
          :target="options.is_blank == 1 ? '_blank' : false"
          :href="options.logo_link"
        >
          <img
            v-if="options.logo"
            :src="options.logo"
            alt="logo"
          />
        </a>
        <img
          v-if="!options.logo_link && options.logo"
          :src="options.logo"
          alt="logo"
        />
      </div>
      <div class="controller-bar">
        <div class="controller-bar--inner">
          <div class="controller-bar--direction">
            <span
              class="ctrl ctrl-direction"
              data-ctrl="left"
            >
              <fontAwesomeIcon icon="chevron-left" />
            </span>
            <span
              class="ctrl ctrl-direction"
              data-ctrl="right"
            >
              <fontAwesomeIcon icon="chevron-right" />
            </span>
            <span
              class="ctrl ctrl-direction"
              data-ctrl="up"
            >
              <fontAwesomeIcon icon="chevron-up" />
            </span>
            <span
              class="ctrl ctrl-direction"
              data-ctrl="down"
            >
              <fontAwesomeIcon icon="chevron-down" />
            </span>
          </div>
          <span
            class="ctrl ctrl-zoom"
            data-ctrl="zoomIn"
          >
            <fontAwesomeIcon icon="plus" />
          </span>
          <span
            class="ctrl ctrl-zoom"
            data-ctrl="zoomOut"
          >
            <fontAwesomeIcon icon="minus" />
          </span>
          <span
            v-if="intro && intro.text && intro.image"
            class="ctrl ctrl-intro"
            data-target="intro"
            @click="toggleIntro();modalClose();closeMap();"
          ><fontAwesomeIcon class="only-sp" icon="info-circle" /><div class="only-pc">{{ intro.text }}</div></span>
          <span
            v-if="map && map.image"
            class="ctrl ctrl-map"
            data-target="map"
            @click="toggleMap();modalClose();"
          ><fontAwesomeIcon class="only-sp" icon="map-marker-alt" /><div class="only-pc">{{map.text}}</div></span>
        </div>
      </div>
    </div>

    <div
      v-for="item in panoData"
      :key="item.id"
    >
      <div
        v-for="spotItem in item.infoSpots"
        :key="spotItem.id"
        :class="currentModal.spotId === spotItem.id ? 'modal active' : 'modal'"
      >
        <div class="modal__header">
          <a
            href="#"
            class="modal__close-btn"
            @click.prevent="modalClose(); stop();"
          />
        </div>
        <div class="modal__inner modal__inner--info">
          <div class="modal__body">
            <div :class="[spotItem.type === 'youtube' || spotItem.type === 'iframe' || spotItem.type === 'snapwidget' ? 'modal__movie' : 'modal__figure',spotItem.type === 'snapwidget' ? 'modal__snapwidget' : '']">
              <div
                v-if="spotItem.type === 'normal'"
                class="modal__img"
                :style="{ backgroundImage: `url(${spotItem.image})` }"
              />
              <youtube
                v-if="spotItem.youtubeId"
                ref="youtube"
                class="youtube"
                :video-id="spotItem.youtubeId"
                :playerVars="playerVars"
                :mute="true"
                @playing="start"
              />
              <div
                v-if="spotItem.type === 'iframe'"
                class="youtube"
                v-html="spotItem.iframe"
              />
              <div
                v-if="spotItem.type === 'snapwidget'"
                class="snapwidget"
                v-html="spotItem.snapwidget"
              />
            </div>
            <h3 class="modal__title">{{spotItem.title}}</h3>
            <p style="white-space: pre-wrap;">{{spotItem.context}}</p>
          </div>
          <div
            v-if="spotItem.url && spotItem.link_text"
            class="modal__footer"
          >
            <a
              class="modal__link"
              :href="spotItem.url"
              :target="spotItem.external? '_blank':false">{{spotItem.link_text}}</a>
          </div>
          <div
            v-if="spotItem.url2 && spotItem.link_text2"
            class="modal__footer"
          >
            <a
              class="modal__link"
              :href="spotItem.url2"
              :target="spotItem.external? '_blank':false"
            >{{spotItem.link_text2}}</a>
          </div>
          <div
            v-if="spotItem.url3 && spotItem.link_text3"
            class="modal__footer"
          >
            <a
              class="modal__link"
              :href="spotItem.url3"
              :target="spotItem.external? '_blank':false"
            >{{spotItem.link_text3}}</a>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="map"
      id="map"
      :key="map.id"
      class="modal modal--map"
      :class="{active : showMap}"
    >
      <div class="modal__header">
        <a
          href="#"
          class="modal__close-btn"
          @click="toggleMap"
        />
      </div>
      <div class="modal__inner">
        <div class="modal__figure">
          <img
            :src="map.image"
          />
          <a
            v-for="item in map.pins"
            :key="item.id"
            class="map-pin"
            href="#"
            :class="[item.id, (currentPano === item.targetId) ? 'current' : '']"
            :style="{ top: item.position[1], left: item.position[0] }"
            @click="onClickLink(item.targetId)"
          >
            <fontAwesomeIcon icon="map-marker-alt" />
          </a>
        </div>
      </div>
    </div>

    <div
      v-if="intro"
      class="modal-overlay"
      :class="{active : showIntro}"
      @click="toggleIntro"
    />
    <div
      v-if="intro"
      id="intro"
      :key="intro.id"
      class="modal modal--intro"
      :class="{active : showIntro}"
    >
      <div class="modal__header">
        <a
          href="#"
          class="modal__close-btn"
          @click="toggleIntro"
        />
      </div>
      <div class="modal__inner">
        <div class="modal__figure">
          <img
            :src="intro.image"
          />
        </div>
      </div>
      <div
        v-if="intro.url && intro.link_text"
        class="modal__footer"
      >
        <a
          class="modal__link"
          :href="intro.url"
          target="_blank"
        >{{intro.link_text}}</a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
// plugin
import * as THREE from "three";
import Panolens from "../lib/panolens";
const PANOLENS = Panolens.PANOLENS;
import { gsap } from "gsap";
import "../lib/requestAnimationFrame";
import { Math as _Math } from "three/build/three.module.js";
import { addListenerMulti } from "../lib/utils";
const TWEEN = window.TWEEN;
import axios from "axios";
const filePath = (function() {
    if (document.currentScript) {
        const src = document.currentScript.src;
        const fileName = src.split('/').reverse()[0]
        const path = src.replace(`/js/${fileName}`, '');
        return path;
    } else {
      var scripts = document.getElementsByTagName('script'),
      script = scripts[scripts.length-1];
      if (script.src){
        return script.src;
      }
    }
})();

export default {
  name: "Container",
  props: {},
  data() {
    return {
      playerVars: {
        rel: 0
      }
    };
  },
  computed: {
    ...mapState([
      "isLoading",
      "options",
      "showMap",
      "showIntro",
      "panoData",
      "map",
      "intro",
      "panos",
      "currentPano",
      "viewer",
      "playingVideo",
      "currentModal"
    ]),
    play() {
      return this.$refs.youtube.player;
    }
  },
  mounted() {
    axios.get(`${filePath}/data/data.json`).then(response => {
      if (response.status === 200) {
        if (typeof response.data === "string") {
          response.data = JSON.parse(response.data);
        }
        this.$store.commit("setMapData", response);
        this.$store.commit("setIntroData", response);
        this.$store.commit("setPanoData", response);
        this.init();
      } else {
        console.log("xhr error");
      }
    });
  },
  methods: {
    ...mapMutations([
      "toggleMap",
      "toggleIntro",
      "toggleLoading",
      "setMapData",
      "setIntroData",
      "setPanoData",
      "setPanos",
      "setCurrentPano",
      "setViewer",
      "setPlayer",
      "setVideo",
      "setCurrentModal"
    ]),
    init() {
      let viewer, canvas;

      canvas = document.getElementById("container");

      viewer = new PANOLENS.Viewer({
        container: canvas,
        controlBar: false,
        autoHideInfospot: false,
        viewIndicator: false,
        cameraFov: 50,
        output: "console",
        autoRotate: false,
        autoRotateSpeed: 1,
        autoRotateActivationDuration: 3000
      });

      viewer.OrbitControls.minPolarAngle = Math.PI / 3;
      viewer.OrbitControls.maxPolarAngle = (Math.PI * 2) / 3;

      viewer.OrbitControls.minFov = 50;
      viewer.OrbitControls.maxFov = 80;

      const camera = viewer.getCamera();
      const scene = viewer.getScene();

      const panoData = this.$store.state.panoData;
      const infoIcon = this.$store.state.options.infoSpotIcon
        ? this.$store.state.options.infoSpotIcon
        : PANOLENS.DataImage.Info;
      const linkIcon = this.$store.state.options.linkIcon
        ? this.$store.state.options.linkIcon
        : PANOLENS.DataImage.Arrow;

      let panos = [];
      panoData.forEach(item => {
        const itemId = item.id;
        if (this.$store.state.currentPano === "") {
          this.$store.commit("setCurrentPano", itemId);
        }
        panos[itemId] = new PANOLENS.ImagePanorama(`./img/${item.image}`);
        panos[itemId].name = item.id;
        panos[itemId].addEventListener("progress", this.onProgress);
        panos[itemId].autorotate = item.autorotate;
        const position = item.position ? JSON.parse(item.position) : [0, 0, 0];
        const lookAtPositions = new THREE.Vector3(
          position[0],
          position[1],
          position[2]
        );

        panos[itemId].addEventListener("enter-fade-start", () => {
          this.onResetFocus();
          viewer.OrbitControls.minAzimuthAngle = -Infinity;
          viewer.OrbitControls.maxAzimuthAngle = Infinity;
          viewer.tweenControlCenter(
            lookAtPositions,
            0,
            ''
          );
        });
        panos[itemId].addEventListener("enter-fade-complete", () => {
          if (item.angleLimit) {
            const centerPos = _Math.radToDeg(
              viewer.OrbitControls.getAzimuthalAngle()
            );
            const deg = 90;
            viewer.OrbitControls.minAzimuthAngle = _Math.degToRad(
              centerPos - deg
            );
            viewer.OrbitControls.maxAzimuthAngle = _Math.degToRad(
              centerPos + deg
            );
          } else {
            viewer.OrbitControls.minAzimuthAngle = -Infinity;
            viewer.OrbitControls.maxAzimuthAngle = Infinity;
          }
          if(panos[itemId].autorotate){
            viewer.enableAutoRate();
          } else {
            viewer.disableAutoRate();
          }
        });

        const infoSpots = item.infoSpots;
        const infoSpotsLength = infoSpots ? infoSpots.length : [];
        let infoSpotItems = [];

        for (let i = 0; i < infoSpotsLength; i++) {
          const spotItem = infoSpots[i];
          const spotPos = spotItem.position;
          const spotId = spotItem.id;
          const spotSize = spotItem.size ? spotItem.size : 400;
          const infoIconImage = spotItem.iconImage ? `./img/${spotItem.iconImage}` : infoIcon;
          infoSpotItems[spotId] = new PANOLENS.Infospot(spotSize, infoIconImage);
          infoSpotItems[spotId].name = spotId;
          infoSpotItems[spotId].position.set(
            spotPos[0],
            spotPos[1],
            spotPos[2]
          );
          infoSpotItems[spotId].addEventListener("click", () => {
            this.onFocus(infoSpotItems[spotId]);
            this.$store.commit("updatePanoData", {
              panoId: itemId,
              spotId: spotId,
              flg: true
            });
            this.$store.commit("setCurrentModal", {
              panoId: itemId,
              spotId: spotId
            });
          });
          panos[itemId].add(infoSpotItems[spotId]);
        }

        const links = item.links;
        const linksLength = links ? links.length : [];
        let linkItems = [];

        for (let a = 0; a < linksLength; a++) {
          const linkItem = links[a];
          const linkPos = linkItem.position;
          const linkId = linkItem.id;
          const linkTargetId = linkItem.targetId;
          const linkSize = linkItem.size ? linkItem.size : 400;
          const linkIconImage = linkItem.iconImage ? `./img/${linkItem.iconImage}` : linkIcon;
          linkItems[linkId] = new PANOLENS.Infospot(linkSize, linkIconImage);
          linkItems[linkId].position.set(linkPos[0], linkPos[1], linkPos[2]);
          linkItems[linkId].type = 'linkSpot';
          linkItems[linkId].addEventListener("hoverenter", () => {
            linkItems[linkId].material.opacity = 0.9;
          });
          linkItems[linkId].addEventListener("click", () => {
            if(linkItem.type === "normal"){
              const url = linkItem.url;
              if(linkItem.isBlank){
                const winopen = window.open();
                winopen.opener = null;
                winopen.location = url;
              }else{
                location.href = url;
              }
            }else{
              this.onFocus(linkItems[linkId]);
              this.onClickLink(linkTargetId);
            }
          });
          panos[itemId].add(linkItems[linkId]);
        }
        viewer.add(panos[itemId]);
      });

      this.$store.commit("setViewer", viewer);
      this.$store.commit("setPanos", panos);

      viewer.update();
      document.addEventListener("mousedown", () => {
        document.onmousemove = () => {
          this.modalClose();
        };
      });

      document.addEventListener("mouseup", () => {
        document.onmousemove = null;
      });

      this.zoomCamera(camera, scene);

    },

    zoomCamera(camera) {
      let rafId = "";
      let ctrType = "";

      function startAnimate() {
        rafId = requestAnimationFrame(startAnimate);
        onMouseDown();
      }

      function stopAnimate() {
        cancelAnimationFrame(rafId);
      }

      const minFov = 50;
      const maxFov = 80;

      function onMouseDown() {
        const fov = camera.fov;
        // console.log(y);
        let zoom;

        switch (ctrType) {
          case "zoomIn":
            zoom = fov > minFov ? fov - 1 : minFov;
            break;
          case "zoomOut":
            zoom = fov < maxFov ? fov + 1 : maxFov;
            break;
        }
        camera.fov = zoom;
        camera.updateProjectionMatrix();
      }

      const directionCtrs = document.querySelectorAll(".ctrl-direction");

      directionCtrs.forEach(directionCtr => {
        addListenerMulti(directionCtr, "mousedown touchstart", e => {
          e.preventDefault();
          this.modalClose();
        });
      });

      const ctrs = document.querySelectorAll(".ctrl-zoom");
      ctrs.forEach(ctrs => {
        addListenerMulti(ctrs, "mousedown touchstart", e => {
          e.preventDefault();
          ctrType = e.currentTarget.getAttribute("data-ctrl");
          stopAnimate();
          startAnimate();
          this.modalClose();
        });
        addListenerMulti(ctrs, "mouseup touchend", e => {
          e.preventDefault();
          stopAnimate();
        });
      });

    },

    onClickLink(targetId) {
      const { viewer, currentPano, panos } = this.$store.state;
      if (targetId !== currentPano) {
        this.$store.commit("toggleMap", false);
        viewer.setPanorama(panos[targetId]);
        this.$store.commit("setCurrentPano", targetId);
      }
    },

    onProgress(event) {
      var progress = (event.progress.loaded / event.progress.total) * 100;
      this.$store.commit("toggleLoading", true);
      if (progress === 100) {
        event.target.addEventListener("load", () => {
          this.$store.commit("toggleLoading", false);
        });
      }
    },

    modalClose() {
      const { panoId, spotId } = this.$store.state.currentModal;
      if (panoId && spotId) {
        this.$store.commit("updatePanoData", {
          panoId: panoId,
          spotId: spotId,
          flg: false
        });
      }
      this.$store.commit("setCurrentModal", {
        panoId: null,
        spotId: null
      });
      this.stop();
    },

    onResetFocus() {
      const { viewer } = this.$store.state;
      const camera = viewer.getCamera();
      const scene = viewer.getScene();
      gsap.to(camera, 0, {
        fov: "80",
        onUpdate: function() {
          camera.updateProjectionMatrix();
          camera.lookAt(scene.position);
        }
      });
    },

    onFocus(e) {
      const parameters = {
        amount: 50,
        duration: 1000,
        curve: "Exponential",
        easing: "Out",
        iterative: false
      };
      e.focus(
        parameters.duration,
        TWEEN.Easing[parameters.curve][parameters.easing]
      );
    },

    start(event) {
      this.$store.commit("setVideo", event);
    },

    stop() {
      const { playingVideo } = this.$store.state;
      if (playingVideo) {
        playingVideo.stopVideo();
        this.$store.commit("setVideo", "");
      }
    },

    toggleMap() {
      this.$store.commit("toggleMap");
      setTimeout(() => {
        const { viewer, showMap } = this.$store.state;
        if(showMap){
          viewer.disableAutoRate();
        }
      }, 500);
    },

    toggleIntro() {
      this.$store.commit("toggleIntro");
      setTimeout(() => {
        const { viewer, showIntro } = this.$store.state;
        if(showIntro){
          viewer.disableAutoRate();
        }
      }, 500);
    },

    closeMap() {
      this.$store.commit("toggleMap", false);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- <style scoped lang="sass"></style> -->
