<template>
  <a-modal
    title="修改用户角色"
    v-model="dialogVisibleResetRole"
  >
    <div>
      <a-form-model :model="editform" :rules="ruleValidate" :label-col="{span:4}" :wrapper-col="{span:14}">
        <a-form-model-item label="角色">
          <a-select v-model="editform.roleId" :allowClear="true">
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
export default {
  props: {
    dialogVisibleResetRole: {
      type: Boolean,
      default: false
    },
    editItem: {
      type: Object,
      default () {
        return {}
      }
    },
    optionsRoles: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      loading: false,
      userRoleItem: {},
      editform: {
        roleId: ''
      },
      ruleValidate: {
        roleId: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    editItem (val) {
      this.getUserRole()
    }
  },
  mounted () {
  },
  methods: {
    getUserRole () {
      apiAdmin.getUserRole({ id: this.editItem.id }).then(response => {
        if (response.id) {
          this.userRoleItem = response
          this.editform.roleId = response.role.id
        }
      }).catch((error) => {
        console.log(error.message)
      })
    },
    commit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.userRoleItem && this.userRoleItem.id) {
            this.updateRoleUser()
          } else {
            this.createRoleUser()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateRoleUser () {
      this.loading = true
      apiRoleuser.updateRoleUser({ id: this.userRoleItem.id, roleId: this.editform.roleId }).then(response => {
        this.$message({
          message: '用户角色关联编辑成功！',
          type: 'success'
        })
        this.loading = false
        this.$emit('changeResetRoleVisible', false)
        this.$emit('refresh')
      }).catch(() => {
        this.loading = false
      })
    },
    createRoleUser () {
      this.loading = true
      apiRoleuser.createRoleUser({ userId: this.editItem.id, roleId: this.editform.roleId }).then(response => {
        this.$message({
          message: '用户角色关联创建成功！',
          type: 'success'
        })
        this.loading = false
        this.$emit('changeResetRoleVisible', false)
        this.$emit('refresh')
      }).catch(() => {
        this.loading = false
      })
    },
    reset () {
      this.$refs.form.resetFields()
      this.$emit('changeResetRoleVisible', false)
    },
    handleClose (done) {
      this.$emit('changeResetRoleVisible', false)
      // done()
    }
  }
}
</script>
