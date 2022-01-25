<template>
  <div class="faceContainer mydesc">
    <a-descriptions bordered title="设备存储信息" size="middle" :column="{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }" style="margin-top: 20px;">
      <a-descriptions-item label="space_limit">
        {{ deviceInfo && deviceInfo.space_limit }}
      </a-descriptions-item>
      <a-descriptions-item label="space_enable">
        {{ deviceInfo && deviceInfo.space_enable === 1 ? '启用' : '禁用' }}
      </a-descriptions-item>
      <a-descriptions-item label="days_limit">
        {{ deviceInfo && deviceInfo.days_limit }}
      </a-descriptions-item>
      <a-descriptions-item label="days_enable">
        {{ deviceInfo && deviceInfo.days_enable === 1 ? '启用' : '禁用' }}
      </a-descriptions-item>
    </a-descriptions>
    <p style="text-align: center;margin: 20px 0;"><a-button key="submit" type="primary" @click="toEdit">修改配置</a-button></p>

    <!--编辑模板-->
    <a-modal
      title="编辑设备存储配置"
      width="600px"
      v-model="editVisible"
    >
      <div>
        <a-form-model ref="editform" :model="editForm" :rules="ruleValidate" :label-col="{span:5}" :wrapper-col="{span:14}">
          <a-form-model-item label="space_limit" prop="space_limit">
            <a-input-number v-model="editForm.space_limit" :min="30" :max="90" />
          </a-form-model-item>
          <a-form-model-item label="space_enable" prop="space_enable">
            <a-radio-group v-model="editForm.space_enable" default-value="a" button-style="solid">
              <a-radio-button :value="1">启用</a-radio-button>
              <a-radio-button :value="0">禁用</a-radio-button>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="days_limit" prop="days_limit">
            <a-input-number v-model="editForm.days_limit" :min="15" :max="90" />
          </a-form-model-item>
          <a-form-model-item label="days_enable" prop="days_enable">
            <a-radio-group v-model="editForm.days_enable" default-value="a" button-style="solid">
              <a-radio-button :value="1">启用</a-radio-button>
              <a-radio-button :value="0">禁用</a-radio-button>
            </a-radio-group>
          </a-form-model-item>
        </a-form-model>
      </div>
      <template slot="footer">
        <a-button key="back" @click="reset">
          取消
        </a-button>
        <a-button key="submit" type="primary" :loading="editLoading" @click="handleEdit">
          更新
        </a-button>
      </template>
    </a-modal>
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
      deviceInfo: {},
      editLoading: false,
      editVisible: false,
      editForm: {},
      ruleValidate: {
        space_limit: [
          { required: true, message: 'Bspace_limit不能为空', trigger: 'blur' }
        ],
        space_enable: [
          { required: true, message: 'space_enable不能为空', trigger: 'change' }
        ],
        days_limit: [
          { required: true, message: 'days_limit不能为空', trigger: 'blur' }
        ],
        days_enable: [
          { required: true, message: 'days_enable不能为空', trigger: 'change' }
        ]
      }
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

    this.getDeviceStorage()
  },
  methods: {
    getDeviceStorage () {
      this.spinning = true
      api.getDeviceStorage().then(res => {
        var resBody = res.data
        if (resBody.code === 0) {
          this.deviceInfo = resBody.data
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
    },
    toEdit () {
      this.editVisible = true
      this.editForm = this.deviceInfo
    },
    reset () {
      this.$refs.editform.resetFields()
      this.editVisible = false
    },
    handleEdit () {
      this.$refs.editform.validate((valid) => {
        if (valid) {
          var params = {
            space_limit: this.editForm.space_limit,
            space_enable: this.editForm.space_enable,
            days_limit: this.editForm.days_limit,
            days_enable: this.editForm.days_enable
          }

          this.editLoading = true
          api.editStorage(params).then(res => {
            if (res.data.code === 0) {
              this.page_no = 1
              this.getDeviceStorage()

              this.editVisible = false
              this.editLoading = false
              this.editForm = {}
              this.$message.success('设备存储信息编辑成功')
            } else {
              this.$message.error(res.data.message || '请求出错！')
            }
          }).catch(error => {
            this.editLoading = false
            if (error.response.status === 401) {
              this.$store.dispatch('authentication/resetToken').then(() => {
                this.$router.push({ path: '/login' })
              })
            }
            if (error.response && error.response.data) {
              this.$message.error(error.response.data.message || '更新出错！')
            } else {
              this.$message.error('接口调用失败！')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}

</script>
<style scoped>
</style>
