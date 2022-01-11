<template>
  <el-dialog
    title="创建用户角色关联"
    :visible.sync="dialogVisibleAdd"
    width="50%"
    :before-close="handleClose"
  >
    <div>
      <el-form ref="form" :model="formadd" :rules="ruleValidate" label-width="100px">
        <el-form-item prop="userId" label="用户">
          <el-select v-model="formadd.userId" placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in optionsUsers" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="roleId" label="角色">
          <el-select v-model="formadd.roleId" placeholder="请选择" style="width: 100%;">
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
    dialogVisibleAdd: {
      type: Boolean,
      default: false
    },
    optionsUsers: {
      type: Array,
      default: function () {
        return []
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
      formadd: {
        userId: '',
        roleId: ''
      },
      ruleValidate: {
        userId: [
          { required: true, message: '请选择用户', trigger: 'change' }
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: 'change' }
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
          this.createRoleUser()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    createRoleUser () {
      this.loading = true
      apiRoleuser.createRoleUser(this.formadd).then(response => {
        this.$message({
          message: '创建成功！',
          type: 'success'
        })
        this.formadd = {
          userId: '',
          roleId: ''
        }
        this.loading = false
        this.$emit('changeAddVisible', false)
        this.$emit('refresh')
      }).catch(() => {
        this.loading = false
      })
    },
    reset () {
      this.$refs.form.resetFields()
      this.$emit('changeAddVisible', false)
    },
    handleClose (done) {
      this.$emit('changeAddVisible', false)
      // done()
    }
  }
}
</script>
