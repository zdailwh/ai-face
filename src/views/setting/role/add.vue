<template>
  <el-dialog
    title="创建角色"
    :visible.sync="dialogVisibleAdd"
    width="50%"
    :before-close="handleClose"
  >
    <div class="channelForm">
      <el-form ref="form" :model="formadd" :rules="ruleValidate" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formadd.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色等级" prop="level">
          <el-select v-model="formadd.level" placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in levelArr" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="formadd.description" placeholder="请输入角色描述" />
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
import apiRole from '@/api/myrole'

export default {
  props: {
    dialogVisibleAdd: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      formadd: {
        name: '',
        level: '',
        description: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '角色等级不能为空', trigger: 'change' }
        ]
      },
      levelArr: [
        // { label: '最高', value: 5 },
        { label: '高', value: 4 },
        { label: '中', value: 3 },
        { label: '低', value: 2 }
        // { label: '最低', value: 1 }
      ]
    }
  },
  mounted () {
  },
  methods: {
    commit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.createRole()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    createRole () {
      this.loading = true
      apiRole.createRole(this.formadd).then(response => {
        this.$message({
          message: '创建成功！',
          type: 'success'
        })
        this.formadd = {
          name: '',
          description: ''
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
