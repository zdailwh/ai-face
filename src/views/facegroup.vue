<template>
  <div style="padding: 5px 15px 0;">
    <!-- <a-tabs :activeKey="activeKey" @change="callback">
      <a-tab-pane key="group" tab="人脸组">
        <Group></Group>
      </a-tab-pane>
      <a-tab-pane key="face" tab="人脸">
        <Face></Face>
      </a-tab-pane>
    </a-tabs> -->
    <a-menu v-model="current" mode="horizontal">
      <a-menu-item key="/facegroup/group"><router-link to="/facegroup/group">人脸库</router-link></a-menu-item>
      <a-menu-item key="/facegroup/face"><router-link to="/facegroup/face">人脸</router-link></a-menu-item>
    </a-menu>
    <div style="margin-top: 10px;">
      <router-view/>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  computed: {
    current () {
      return [this.$route.path]
    }
  }
}
</script>
