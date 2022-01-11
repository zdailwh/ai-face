<template>
  <el-dialog
    title="编辑权限"
    :visible.sync="dialogVisibleEdit"
    width="50%"
    :before-close="handleClose"
  >
    <div class="channelForm">
      <el-form ref="form" :model="editItem" :rules="ruleValidate" label-width="80px">
        <el-form-item label="接口地址" prop="name">
          <el-input v-model="editItem.name" placeholder="请输入接口地址" />
        </el-form-item>
        <el-form-item label="权限描述" prop="info">
          <el-input v-model="editItem.info" placeholder="请输入权限描述" />
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
          this.updatePermission()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updatePermission () {
      this.loading = true
      apiPermission.updatePermission(this.editItem).then(response => {
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
