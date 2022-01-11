<template>
  <el-dialog
    title="创建权限"
    :visible.sync="dialogVisibleAdd"
    width="50%"
    :before-close="handleClose"
  >
    <div class="channelForm">
      <el-form ref="form" :model="formadd" :rules="ruleValidate" label-width="100px">
        <el-form-item label="接口地址" prop="name">
          <el-input v-model="formadd.name" placeholder="请输入接口地址（如：userUpdatePhone）" />
        </el-form-item>
        <el-form-item label="权限描述" prop="info">
          <el-input v-model="formadd.info" placeholder="请输入权限描述" />
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
import apiPermission from '@/api/mypermission'

export default {
  props: {
    dialogVisibleAdd: {
      type: Boolean,
      default: false
    },
    routesData: {
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
        name: '',
        info: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '接口地址不能为空', trigger: 'blur' }
        ],
        info: [
          { required: true, message: '权限描述不能为空', trigger: 'blur' }
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
          this.createPermission()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    createPermission () {
      console.log(this.formadd)
      this.loading = true
      apiPermission.createPermission(this.formadd).then(response => {
        this.$message({
          message: '创建成功！',
          type: 'success'
        })
        this.formadd = {
          name: '',
          info: ''
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
<style scoped>
.permission-tree {
  margin-bottom: 30px;
}
</style>
