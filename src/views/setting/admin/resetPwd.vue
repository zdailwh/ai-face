<template>
  <a-modal
    title="重置密码"
    v-model="dialogVisibleResetPwd"
  >
    <div>
      <a-form-model :model="formadd" :rules="ruleValidate" :label-col="{span:4}" :wrapper-col="{span:14}">
        <a-form-model-item label="新密码">
          <a-input v-model="formadd.password" />
        </a-form-model-item>
      </a-form-model>
    </div>
    <template slot="footer">
      <a-button key="back" @click="reset">
        取消
      </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="commit">
        创建
      </a-button>
    </template>
  </a-modal>
</template>
<script>
import apiAdmin from '@/api/admin'
import Cookies from 'js-cookie'
export default {
  props: {
    dialogVisibleResetPwd: {
      type: Boolean,
      default: false
    },
    editItem: {
      type: Object,
      default () {
        return {}
      }
    }
  },
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
      pwdset: (Cookies.get('MultiDisplay-pwdset') && JSON.parse(Cookies.get('MultiDisplay-pwdset'))) || { length: 8, complexity: 1, changespace: 30 },
      loading: false,
      formadd: {
        password: ''
      },
      ruleValidate: {
        password: [
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
          this.resetPwd()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetPwd () {
      this.loading = true
      this.formadd.id = this.editItem.id
      apiAdmin.resetPwd(this.formadd).then(response => {
        this.$message({
          message: '密码重置成功！',
          type: 'success'
        })
        this.formadd = {
          password: ''
        }
        this.loading = false
        this.$emit('changeResetPwdVisible', false)
      }).catch(() => {
        this.loading = false
      })
    },
    reset () {
      this.$refs.form.resetFields()
      this.$emit('changeResetPwdVisible', false)
    },
    handleClose (done) {
      this.$emit('changeResetPwdVisible', false)
      // done()
    }
  }
}
</script>
