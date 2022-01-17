<template>
  <div style="padding: 5px 15px 0;">
    <a-menu v-model="current" mode="horizontal">
      <a-menu-item key="/taskbatch/batch"><router-link to="/taskbatch/batch">批次</router-link></a-menu-item>
      <a-menu-item key="/taskbatch/task"><router-link to="/taskbatch/task">任务</router-link></a-menu-item>
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
