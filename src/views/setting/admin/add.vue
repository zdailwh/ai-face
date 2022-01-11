<template>
  <a-modal
    title="创建用户"
    v-model="dialogVisibleAdd"
  >
    <div>
      <a-form-model :model="formadd" :rules="ruleValidate" :label-col="{span:4}" :wrapper-col="{span:14}">
        <a-form-model-item label="用户名">
          <a-input v-model="formadd.username" />
        </a-form-model-item>
        <a-form-model-item label="密码">
          <a-input v-model="formadd.password" />
        </a-form-model-item>
        <a-form-model-item label="手机号">
          <a-input v-model="formadd.mobile" />
        </a-form-model-item>
        <a-form-model-item label="角色">
          <a-select v-model="roleId" :allowClear="true">
            <a-select-option :value="item.value" v-for="item in optionsRoles" v-bind:key="item.value">
              {{item.label}}
            </a-select-option>
          </a-select>
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
import apiRoleuser from '@/api/roleuser'
import Cookies from 'js-cookie'
export default {
  props: {
    dialogVisibleAdd: {
      type: Boolean,
      default: false
    },
    optionsRoles: {
      type: Array,
      default: function () {
        return []
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
        callback(new Error('密码不能为空'))
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
        username: '',
        password: '',
        mobile: ''
      },
      roleId: null,
      ruleValidate: {
        username: [
          { required: true, type: 'string', message: '姓名不能为空', trigger: 'blur' }
          // { type: 'string', message: '用户名为2-8位字符', min: 2, max: 8, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePwd, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          { type: 'string', message: '手机号格式不正确', length: 11, pattern: /^1[3|5|8|7]([0-9]{9})$/, trigger: 'blur' }
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
          if (!this.roleId) {
            this.$message({
              message: '请选择用户角色！',
              type: 'error'
            })
            return false
          }
          this.createUser()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    createUser () {
      console.log(this.formadd)
      this.loading = true
      apiAdmin.createUser(this.formadd).then(response => {
        this.$message({
          message: '用户创建成功！',
          type: 'success'
        })
        this.createRoleUser(response.id, this.roleId)
        this.formadd = {
          username: '',
          password: '',
          mobile: ''
        }
        this.loading = false
        // this.$emit('changeAddVisible', false)
        // this.$emit('refresh')
      }).catch(error => {
        this.loading = false
        console.log(error.response.data)
      })
    },
    reset () {
      this.$refs.form.resetFields()
      this.$emit('changeAddVisible', false)
    },
    handleClose (done) {
      this.$emit('changeAddVisible', false)
      // done()
    },
    createRoleUser (userId, roleId) {
      apiRoleuser.createRoleUser({ userId: userId, roleId: roleId }).then(response => {
        this.$message({
          message: '用户角色关联创建成功！',
          type: 'success'
        })
        this.$emit('changeAddVisible', false)
        this.$emit('refresh')
      }).catch(() => {
      })
    }
  }
}
</script>
