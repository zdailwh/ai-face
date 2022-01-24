<template>
  <div class="faceContainer">
    <a-descriptions bordered title="软件信息" size="middle" style="margin-top: 20px;">
      <a-descriptions-item label="名称">
        {{ deviceInfo && deviceInfo.software && deviceInfo.software.name }}
      </a-descriptions-item>
      <a-descriptions-item label="版本">
        {{ deviceInfo && deviceInfo.software && deviceInfo.software.version }}
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions bordered title="系统信息" size="middle" style="margin-top: 20px;">
      <a-descriptions-item label="uptime">
        {{ deviceInfo && deviceInfo.system && deviceInfo.system.uptime }}
      </a-descriptions-item>
      <a-descriptions-item label="CPU">
        <template v-for="(it, k) in (deviceInfo && deviceInfo.system && deviceInfo.system.CPU)">
          <p :key="k">{{k}} : {{it}}</p>
        </template>
      </a-descriptions-item>
      <a-descriptions-item label="存储">
        <template v-for="(it, k) in (deviceInfo && deviceInfo.system && deviceInfo.system.Mem)">
          <p :key="k">{{k}} : {{it}}</p>
        </template>
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions bordered title="人像信息" size="middle" style="margin-top: 20px;">
      <a-descriptions-item label="总数">
        {{ deviceInfo && deviceInfo.facedata && deviceInfo.facedata.total }}
      </a-descriptions-item>
      <a-descriptions-item label="图片总数">
        {{ deviceInfo && deviceInfo.facedata && deviceInfo.facedata.total_images }}
      </a-descriptions-item>
      <a-descriptions-item label="版本">
        {{ deviceInfo && deviceInfo.facedata && deviceInfo.facedata.version }}
      </a-descriptions-item>
      <a-descriptions-item label="更新时间">
        {{ deviceInfo && deviceInfo.facedata && deviceInfo.facedata.update_time | dateFormat }}
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>
<script>
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
import api from '@/api/action'

var moment = require('moment')

export default {
  beforeRouteEnter (to, from, next) {
    next()
  },
  data () {
    return {
      locale,
      smallLayout: false,
      spinning: false,
      deviceInfo: {}
    }
  },
  filters: {
    dateFormat (val) {
      if (val === '' || val === null) return ''
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  mounted () {
    var viewWidth = document.documentElement.clientWidth
    if (viewWidth < 540) {
      this.smallLayout = true
    }

    this.getDeviceInfo()
  },
  methods: {
    getDeviceInfo () {
      this.spinning = true
      api.getDeviceInfo().then(res => {
        var resBody = res.data
        if (resBody.code === 0) {
          this.deviceInfo = resBody.data
          console.log(this.deviceInfo)
          this.spinning = false
        } else {
          this.$message.error(resBody.message || '请求出错！')
        }
      }).catch(error => {
        this.spinning = false
        if (error.response.status === 401) {
          this.$store.dispatch('authentication/resetToken').then(() => {
            this.$router.push({ path: '/login' })
          })
        }
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '获取设备信息出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
      })
    }
  }
}

</script>
<style scoped>
.faceContainer {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
</style>
