<template>
  <el-dialog
    title="编辑用户角色关联"
    :visible.sync="dialogVisibleEdit"
    width="50%"
    :before-close="handleClose"
  >
    <div>
      <el-form ref="form" :model="editform" :rules="ruleValidate" label-width="100px">
        <el-form-item prop="roleId" label="角色">
          <el-select v-model="editform.roleId" placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in optionsRoles" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="reset">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="commit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import apiRoleuser from '@/api/roleuser'
export default {
  props: {
    dialogVisibleEdit: {
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
      this.editform.roleId = val.role && val.role.id
    }
  },
  mounted () {
  },
  methods: {
    commit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.updateRoleUser()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateRoleUser () {
      this.loading = true
      apiRoleuser.updateRoleUser({ id: this.editItem.id, roleId: this.editform.roleId }).then(response => {
        this.$message({
          message: '编辑成功！',
          type: 'success'
        })
        this.loading = false
        this.$emit('changeEditVisible', false)
        this.$emit('refresh')
      }).catch(() => {
        this.loading = false
      })
    },
    reset () {
      this.$refs.form.resetFields()
      this.$emit('changeEditVisible', false)
    },
    handleClose (done) {
      this.$emit('changeEditVisible', false)
      // done()
    }
  }
}
</script>
