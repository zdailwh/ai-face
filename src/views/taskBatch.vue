<template>
  <div style="padding: 5px 15px 0;">
    <a-menu v-model="current" mode="horizontal">
      <a-menu-item key="/taskBatch/batch"><router-link to="/taskBatch/batch">批次</router-link></a-menu-item>
      <a-menu-item key="/taskBatch/task"><router-link to="/taskBatch/task">任务</router-link></a-menu-item>
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
