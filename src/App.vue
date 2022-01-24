<template>
  <div id="app">
    <div class="lager-layout">
      <div class="header">
        <div class="opt">
          <div class="logo" v-show="smallLayout === false"><!-- <img src="./assets/ks_logo.png"> --><span class="logo_title">广电专业人像检索系统</span></div>
        </div>
        <!-- <div v-if="$router.options.routes.length" class="opt mymenu" style="justify-content: center;">
          <a-menu theme="dark" v-model="current" mode="horizontal">
            <a-menu-item key="/taskbatch/batch">离线任务</a-menu-item>
            <a-menu-item key="/facegroup/face">人脸库</a-menu-item>
            <a-sub-menu key="/setting">
              <span slot="title">基础配置</span>
              <a-menu-item key="/setting/admin/index">用户设置</a-menu-item>
              <a-menu-item key="/setting/role/index">角色配置</a-menu-item>
              <a-menu-item key="/setting/permission/index">权限配置</a-menu-item>
              <a-menu-item key="/setting/roleuser/index">用户角色</a-menu-item>
              <a-menu-item key="/setting/roleperm/index">角色权限</a-menu-item>
            </a-sub-menu>
          </a-menu>
        </div> -->
        <div class="opt" style="justify-content: flex-end;flex:1;margin-right: 10px;">
          <a-dropdown v-if="currUser.id">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              <img src="./assets/user.png" alt=""> {{currUser.username}} <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <router-link to="/my/admin/edit">编辑个人信息</router-link>
              </a-menu-item>
              <a-menu-item>
                <router-link to="/my/admin/updatePwd">修改密码</router-link>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;" @click="logout">退出登录</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="file-page">
        <div v-if="$route.path !== '/login'" class="file-slider">
          <a-menu theme="dark" v-model="current" @click="menuClick">
            <template v-if="permission_routes.length">
              <a-menu-item v-if="!route.hidden" v-for="route in permission_routes" :key="route.meta.active">
                <router-link :to="route.redirect" :data-top-route="JSON.stringify(route)"><a-icon :type="route.meta.icon" />{{route.meta.title}}</router-link>
              </a-menu-item>
            </template>
          </a-menu>
        </div>
        <div class="file-main" :style="{ paddingLeft: $route.path !== '/login'? '150px': '0px' }">
          <a-menu v-if="topRoute && topRoute.children && topRoute.children.length" v-model="currentChild" mode="horizontal">
            <a-menu-item v-if="!rou.hidden" v-for="rou in topRoute.children" :key="`${topRoute.path}/${rou.path}`">
              {{rou.meta.title}}
            </a-menu-item>
          </a-menu>
          <router-view/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  data: function () {
    return {
      smallLayout: false,
      showMenus: false,
      topRoute: {}
    }
  },
  computed: {
    currUser: {
      get () {
        var token = this.$store.state.authentication.token
        return token ? JSON.parse(token) : {}
      },
      set (val) {
        // this.$router.push({ path: val[0] || '/' })
      }
    },
    current: {
      get () {
        return [this.$route.meta.active || '']
      },
      set (val) {
        // this.$router.push({ path: val[0] || '/' })
      }
    },
    currentChild: {
      get () {
        return [this.$route.path]
      },
      set (val) {
        this.$router.push({ path: val[0] || '/' })
      }
    },
    ...mapGetters([
      'permission_routes'
    ])
  },
  watch: {
    '$route' (val) {
      var topRouteName = val.matched[0].name
      this.topRoute = this.permission_routes.filter(item => {
        return item.name === topRouteName
      })[0]
    }
  },
  mounted () {
    var viewWidth = document.documentElement.clientWidth
    if (viewWidth < 540) {
      this.smallLayout = true
    }
  },
  methods: {
    menuClick ({domEvent, item, key, keyPath}) {
      // console.log(item)
      // console.log(key)
      // console.log(keyPath)
      var currTopRoute = domEvent.target.dataset.topRoute
      this.topRoute = JSON.parse(currTopRoute)
    },
    logout () {
      this.showMenus = false
      this.$store.dispatch('authentication/logout').then((res) => {
        if (res.data.code === 0) {
          this.$router.push({ path: '/login' })
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((error) => {
        if (error.response.status === 401) {
          this.$store.dispatch('authentication/resetToken').then(() => {
            this.$router.push({ path: '/login' })
          })
        }
        this.$message.error(error.response.data.message || error.response.data || '接口调用失败！')
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /*background-color: #171819;*/
  overflow: hidden;
}
.header {
  height: 60px;
  width: 100%;
  background-color: #303234;
  display: flex;
  position: fixed;
  z-index: 1000;
  line-height: 60px;
  padding: 0;
  align-self: center;
}
.header .opt {
  display: flex;
}
.header .logo {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.header .logo img {
  max-height: 60px;
  margin-right: 10px;
}
.header .logo .logo_title {
  height: 60px;
  line-height: 60px;
  display: inline-block;
  font-size: 20px;
  color: #fff;
  /*letter-spacing: 1px;*/
  margin-left: 10px;
  margin-right: 10px;
}

.mymenu .ant-menu-horizontal {
  line-height: 58px !important;
  background-color: transparent !important;
  border-bottom: none;
}
/*.mymenu .ant-menu-horizontal .ant-menu-submenu-horizontal .ant-menu-submenu-selected .ant-menu-submenu-title {
  background-color: #1890ff;
}*/

.person-info {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.person-info .avatar {
  display: flex;
  justify-content: center;
}
.person-info .avatar img {
  width: 28px;
  height: 28px;
  margin-right: 5px;
}
.person-info .my-name {
  position: relative;
  font-size: 16px;
  color: #fff;
  text-align: center;
  cursor: pointer;
  height: 60px;
  padding-right: 17px;
}
.person-info .my-name .userName_title {
  display: inline-block;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.person-info .my-name:after {
  content: "";
  position: absolute;
  right: 0;
  top: 28px;
  display: inline-block;
  height: 0;
  width: 0;
  border: 6px solid transparent;
  border-top-color: #fff;
}
.person-info .my-name .my-opt {
  width: 136px;
  position: absolute;
  right: 0;
  top: 60px;
  margin-left: -45px;
  background-color: #2a2c2e;
  box-shadow: 0 0 1px 0 rgba(10, 31, 68, 0.08), 0 8px 10px 0 rgba(10, 31, 68, 0.1);
  border-radius: 4px;
  padding: 6px 0;
}
.person-info .my-name .my-opt li {
  color: #fff;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  text-align: left;
}
.person-info .my-name .my-opt li:hover {
  background-color: #2a92fe;
}
.person-info .my-name .my-opt li span {
  display: block;
  margin: 0 10px;
  padding-left: 10px;
  border-bottom: 1px solid #434547;
}
.person-info .my-name .my-opt li:last-child span {
  border-bottom: none;
}
.container {
  height: 100%;
  width: 100%;
  margin: 0 auto;
  margin-bottom: 0px;
  flex: 1;
  display: flex;
  position: relative;
  /*background-color: #171819;*/
}
.file-page {
  width: 100%;
  height: 100%;
  padding-top: 60px;
}
.file-slider {
  width: 150px;
  height: 100%;
  overflow: auto;
  background: #001529;
  color: #fff;
  position: fixed;
  left: 0;
  z-index: 9;
  padding-top: 70px;
  bottom: 0;
  letter-spacing: 1px;
}
.file-page .file-main {
  width: 100%;
  height: 100%;
  /*background-color: #171819;*/
  overflow: auto;
  padding: 0 0 0 0;
}

/* 覆盖ant样式 */
/*.mymenu .ant-menu {
  color: #a2a2a2;
}
.mymenu .ant-menu-horizontal > .ant-menu-item > a {
  color: #a2a2a2;
}
.mymenu .ant-menu-horizontal > .ant-menu-item-selected > a {
  color: #1890ff;
}*/
.login-form .ant-input, .cut_catalog_dropdown .ant-input {
  background-color: #161616;
  border: 1px solid #3c3c3c;
  border-radius: 4px;
  font-size: 14px;
  color: #fff;
}
.desc-box .ant-descriptions-item-label {
  color: #fff;
}
.desc-box .ant-descriptions-item-content {
  color: #a2a2a2;
}
.desc-box .ant-descriptions-row > th, .desc-box .ant-descriptions-row > td {
  padding-bottom: 5px;
}

.d-right .ant-tabs {
  color: #a2a2a2;
}
.d-right .ant-tabs-tab-prev, .d-right .ant-tabs-tab-next {
  color: #a2a2a2;
}
.d-right .ant-tabs-bar {
  border-bottom: 1px solid #555;
}
.d-right .ant-tabs-nav .ant-tabs-tab-active {
  color: #fff;
}
.d-right .ant-tabs-nav .ant-tabs-tab:hover {
  color: #fff;
}
.d-right .ant-tabs-ink-bar {
  background-color: #fff;
}
.searchWrap_video .ant-form-item-label > label {
  color: #fff;
}
.searchWrap_video .ant-select-selection {
  background-color: #161616;
  border: 1px solid #3c3c3c;
  border-radius: 4px;
  font-size: 14px;
  color: #fff;
}
.searchWrap_video .ant-select-selection--multiple .ant-select-selection__choice {
  background-color: #000;
  color: #989898;
  border: 1px solid #989898;
}
.searchWrap_video .ant-select-selection--multiple .ant-select-selection__choice__remove {
  color: #989898;
}
.searchWrap_video .ant-input {
  background-color: #161616;
  border: 1px solid #3c3c3c;
  border-radius: 4px;
  font-size: 14px;
  color: #fff;
}
.searchWrap_video .ant-input-clear-icon,.searchWrap_video .ant-select-arrow {
  color: rgba(255,255,255,.5);
}

.ant-card-cover {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 75%;
  overflow: hidden;
}
.taskContainer .ant-card-cover {
  padding-top: 57% !important;
}
.ant-card-cover img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  height: auto;
}
.ant-card-cover video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  height: auto;
}

.cardList {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.cardList .cardItem {
  width: 200px;
  height: auto;
  margin: 5px;
}

/* 定位时显示详细信息 */
.vcp-slider {
  opacity: 1;
}
.absDetailWrap {
  position: absolute;
  top: 0;
  left: 120%;
  padding: 15px;
  width: 250px;
  height: 300px;
  overflow-y: scroll;
  font-size: 14px;
  text-align: left;
  background-color: #fff;
  border-radius: 15px;
  z-index: 9999;
}
.absDetailWrap p {
  word-break: break-all;
}
/*穿梭框*/
.ant-transfer-customize-list {
  flex-wrap: wrap;
}
.ant-transfer-list-body-customize-wrapper {
  height: calc(260px - 40px - 44px);
  overflow-y: scroll;
}
/*左侧tab*/
.sliderWrap .ant-tabs {
  color: #a2a2a2;
}
.sliderWrap .ant-tabs-tab-prev, .sliderWrap .ant-tabs-tab-next {
  color: #a2a2a2;
}
</style>
