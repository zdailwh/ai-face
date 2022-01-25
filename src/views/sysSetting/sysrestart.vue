<template>
  <div class="faceContainer">
    <p style="text-align: center;margin: 30px auto;">
      <a-button type="danger" :loading="loading" size="large" @click="toReboot">
        重启
      </a-button>
    </p>
  </div>
</template>
<script>
import api from '@/api/action'
export default {
  beforeRouteEnter (to, from, next) {
    next()
  },
  data () {
    return {
      loading: false
    }
  },
  mounted () {
  },
  methods: {
    toReboot () {
      var that = this
      this.$confirm({
        title: '您确定要重启设备吗？',
        content: '谨慎操作',
        okText: '继续重启',
        cancelText: '取消',
        onOk () {
          that.doReboot()
        },
        onCancel () {}
      })
    },
    doReboot () {
      this.loading = true
      api.deviceReboot().then(res => {
        this.loading = false
        var resBody = res.data
        if (resBody.code === 0) {
          this.$message.success('设备已重启！')
        } else {
          this.$message.error(resBody.message || '请求出错！')
        }
      }).catch(error => {
        this.loading = false
        if (error.response.status === 401) {
          this.$store.dispatch('authentication/resetToken').then(() => {
            this.$router.push({ path: '/login' })
          })
        }
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '设备重启出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
      })
    }
  }
}
</script>
<style scoped>
</style>
