<template>
  <div class="faceContainer">
    <a-descriptions bordered title="软件信息" size="middle" style="margin-top: 20px;">
      <a-descriptions-item label="名称">
        {{ devideInfo && devideInfo.software && devideInfo.software.name }}
      </a-descriptions-item>
      <a-descriptions-item label="版本">
        {{ devideInfo && devideInfo.software && devideInfo.software.version }}
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions bordered title="系统信息" size="middle" style="margin-top: 20px;">
      <a-descriptions-item label="uptime">
        {{ devideInfo && devideInfo.system && devideInfo.system.uptime }}
      </a-descriptions-item>
      <a-descriptions-item label="CPU">
        <template v-for="(it, k) in (devideInfo && devideInfo.system && devideInfo.system.CPU.split(','))">
          <p :key="k">{{it}}</p>
        </template>
      </a-descriptions-item>
      <a-descriptions-item label="存储">
        <template v-for="(it, k) in (devideInfo && devideInfo.system && devideInfo.system.Mem.split(','))">
          <p :key="k">{{it}}</p>
        </template>
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions bordered title="人像信息" size="middle" style="margin-top: 20px;">
      <a-descriptions-item label="总数">
        {{ devideInfo && devideInfo.facedata && devideInfo.facedata.total }}
      </a-descriptions-item>
      <a-descriptions-item label="图片总数">
        {{ devideInfo && devideInfo.facedata && devideInfo.facedata.total_images }}
      </a-descriptions-item>
      <a-descriptions-item label="版本">
        {{ devideInfo && devideInfo.facedata && devideInfo.facedata.version }}
      </a-descriptions-item>
      <a-descriptions-item label="更新时间">
        {{ devideInfo && devideInfo.facedata && devideInfo.facedata.update_time | dateFormat }}
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
      devideInfo: {}
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
          this.devideInfo = resBody.data
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
