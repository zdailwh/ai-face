<template>
  <el-dialog
    title="创建角色权限关联"
    :visible.sync="dialogVisibleAdd"
    width="780px"
    :before-close="handleClose"
  >
    <div>
      <el-form ref="form" :model="formadd" :rules="ruleValidate" label-width="100px">
        <el-form-item prop="roleId" label="角色">
          <el-select v-model="formadd.roleId" placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in optionsRoles" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="permissionIds" label="权限分配">
          <!-- <el-select v-model="formadd.permissionIds" multiple placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in optionsPermissions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select> -->
          <el-transfer
            v-model="formadd.permissionIds"
            :data="optionsPermissions"
            :titles="['所有权限', '已选权限']"
          />
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
import apiRoleperm from '@/api/roleperm'
export default {
  props: {
    dialogVisibleAdd: {
      type: Boolean,
      default: false
    },
    optionsPermissions: {
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
        permissionIds: [],
        roleId: ''
      },
      ruleValidate: {
        permissionId: [
          { required: true, message: '请选择权限', trigger: 'change' }
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
          this.loading = true
          var requestList = this.formadd.permissionIds.map(async item => {
            return this.createRolePerm({ permissionId: item, roleId: this.formadd.roleId })
          })
          Promise.all(requestList).then(result => {
            console.log(result)
            this.loading = false
            this.$message({
              message: '创建成功！',
              type: 'success'
            })
            this.formadd = {
              permissionIds: [],
              roleId: ''
            }

            this.$emit('changeAddVisible', false)
            this.$emit('refresh')
          }).catch((result) => {
            console.log(result)
            this.loading = false
            console.log('失败了')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    createRolePerm (formdata) {
      return new Promise((resolve, reject) => {
        apiRoleperm.createRolePerm(formdata).then(response => {
          resolve(response)
        }).catch((error) => {
          reject(error)
        })
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
