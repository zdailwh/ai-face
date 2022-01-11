<template>
  <el-dialog
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
  </el-dialog>
</template>
<script>
import apiRoleperm from '@/api/roleperm'
export default {
  props: {
    dialogVisibleEdit: {
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
    updateRolePerm () {
      var params = {
        roleId: this.editItem.role.id,
        permissionIds: this.checkedPerm
      }
      apiRoleperm.updateRolePerm(params).then(response => {
        this.$message({
          message: '编辑成功！',
          type: 'success'
        })
        this.$emit('changeEditVisible', false)
        this.$emit('refresh')
      })
    },
    reset () {
      this.$emit('changeEditVisible', false)
    },
    handleClose (done) {
      this.$emit('changeEditVisible', false)
      // done()
    }
  }
}
</script>
