<template>
  <a-modal
    :title="'编辑角色权限-' + editItem && editItem.role && editItem.role.name"
    v-model="visible"
  >
    <div>
      <a-form-model ref="form" :model="editItem" :label-col="{span:4}" :wrapper-col="{span:14}">
      </a-form-model>
    </div>
    <template slot="footer">
      <a-button key="back" @click="reset">
        取消
      </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="commit">
        确定
      </a-button>
    </template>
  </a-modal>
  <!-- <el-dialog
    :title="'编辑角色权限-' + editItem && editItem.role && editItem.role.name"
    :visible.sync="dialogVisibleEdit"
    width="680px"
    :before-close="handleClose"
  >
    <div>
      <el-transfer
        v-model="checkedPerm"
        :data="optionsPermissions"
        :titles="['所有权限', '已选权限']"
      />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="reset">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="updateRolePerm">确 定</el-button>
    </span>
  </el-dialog> -->
</template>
<script>
import apiRoleperm from '@/api/roleperm'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    optionsPermissions: {
      type: Array,
      default: function () {
        return []
      }
    },
    editItem: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    visible: {
      get () {
        return this.dialogVisible
      },
      set (val) {
        this.$emit('changeVisible', false)
      }
    }
  },
  data () {
    return {
      loading: false,
      checkedPerm: []
    }
  },
  watch: {
    editItem (newVal) {
      if (newVal && newVal.role && newVal.perms.length) {
        this.checkedPerm = newVal.perms.map(item => {
          return item && item.id
        })
      }
    }
  },
  mounted () {
  },
  methods: {
    commit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.updateRolePerm()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateRolePerm () {
      var params = {
        roleId: this.editItem.role.id,
        permissionIds: this.checkedPerm
      }
      apiRoleperm.updateRolePerm(params).then(response => {
        this.loading = false
        var resBody = response.data
        if (resBody.code === 0) {
          this.$message.success('编辑成功！')
          this.$emit('changeVisible', false)
          this.$emit('refresh')
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
    },
    reset () {
      this.$refs.form.resetFields()
      this.$emit('changeVisible', false)
    },
    handleClose (done) {
      this.$emit('changeVisible', false)
      // done()
    }
  }
}
</script>
