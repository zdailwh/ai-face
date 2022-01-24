<template>
  <div class="faceContainer">
    <div class="formWrap">
      <a-form-model ref="form" :model="formadd" :rules="ruleValidate" :label-col="{span:4}" :wrapper-col="{span:20}">
        <a-form-model-item label="原密码" prop="old">
          <a-input v-model="formadd.old" type="password" />
        </a-form-model-item>
        <a-form-model-item label="新密码" prop="new">
          <a-input v-model="formadd.new" type="password" />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" :loading="loading" @click="commit">
            确定
          </a-button>
        </a-form-model-item>
      </a-form-model>

      <!-- <el-form ref="form" :model="formadd" :rules="ruleValidate" label-width="80px">
        <el-form-item label="原密码" prop="old">
          <el-input v-model="formadd.old" type="password" />
        </el-form-item>
        <el-form-item label="新密码" prop="new">
          <el-input v-model="formadd.new" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" @click="commit">
            确定
          </el-button>
        </el-form-item>
      </el-form> -->
    </div>
  </div>
</template>
<script>
import apiAdmin from '@/api/admin'
import Cookies from 'js-cookie'
export default {
  data () {
    var validatePwd = (rule, value, callback) => {
      var len = this.pwdset.length
      var complexity = this.pwdset.complexity
      var reg = new RegExp('^.*(?=.{8,})(?=.*[0-9])(?=.*[a-zA-Z]).*$')
      var regMsg = '至少8位字母数字'
      if (complexity === 1) {
        // 字母数字
        reg = new RegExp('^.*(?=.{' + len + ',})(?=.*[0-9])(?=.*[a-zA-Z]).*$')
        regMsg = `至少${len}位字母数字`
      } if (complexity === 2) {
        // 大小写及数字
        reg = new RegExp('^.*(?=.{' + len + ',})(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).*$')
        regMsg = `至少${len}位大小写字母加数字`
      } if (complexity === 3) {
        // 大小写、数字及特殊符号
        reg = new RegExp('^.*(?=.{' + len + ',})(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$')
        regMsg = `至少${len}位大小写字母加数字加特殊符号`
      }
      if (value === '') {
        callback(new Error('新密码不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error(regMsg))
      } else {
        callback()
      }
    }
    return {
      isVisitor: (Cookies.get('MultiDisplay-isVisitor') && JSON.parse(Cookies.get('MultiDisplay-isVisitor'))) || false,
      pwdset: (Cookies.get('MultiDisplay-pwdset') && JSON.parse(Cookies.get('MultiDisplay-pwdset'))) || { length: 8, complexity: 1, changespace: 30 },
      loading: false,
      formadd: {
        old: '',
        new: ''
      },
      ruleValidate: {
        old: [
          { required: true, message: '原密码不能为空', trigger: 'blur' }
        ],
        new: [
          { required: true, validator: validatePwd, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
  },
  methods: {
    commit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.updatePwd()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updatePwd () {
      this.loading = true
      apiAdmin.updatePwd(this.formadd).then(async response => {
        this.loading = false
        var resBody = response.data
        if (resBody.code === 0) {
          this.$message.success('密码修改成功，请重新登录！')
          this.formadd = {
            old: '',
            new: ''
          }

          await this.$store.dispatch('authentication/logout')
          this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        } else {
          this.$message.error(resBody.message || '请求出错！')
        }
      }).catch((error) => {
        this.loading = false
        if (error.response.status === 401) {
          this.$store.dispatch('authentication/resetToken').then(() => {
            this.$router.push({ path: '/login' })
          })
        }
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || error.response.data)
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
.formWrap {
  width: 500px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #DCDFE6;
  border-radius: 10px;
}
</style>
