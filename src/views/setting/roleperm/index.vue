<template>
  <div class="app-container">
    <el-form ref="filterForm" :model="filterForm" :inline="true" class="filter-form">
      <!-- <el-form-item prop="roleId">
        <el-select v-model="filterForm.roleId" placeholder="角色">
          <el-option label="全部角色" value="" />
          <el-option v-for="item in optionsRoles" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="permissionId">
        <el-select v-model="filterForm.permissionId" placeholder="权限">
          <el-option label="全部权限" value="" />
          <el-option v-for="item in optionsPermissions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('filterForm')">重置</el-button>
      </el-form-item> -->
      <el-button v-if="!isVisitor" class="filter-item" type="primary" icon="el-icon-plus" @click="dialogVisibleAdd = true">
        创建关联记录
      </el-button>
      <!-- <el-button v-if="!isVisitor" class="filter-item" type="danger" icon="el-icon-delete" :disabled="!multipleSelection.length" @click="delSomeHandler">
        批量删除
      </el-button> -->
    </el-form>

    <el-table v-loading="listLoading" :data="listPermsOfRole" border fit highlight-current-row style="width: 856px;" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column label="角色名" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.role && row.role.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限名" align="center" width="555">
        <template v-if="row.perms && row.perms.length" slot-scope="{row}">
          <template v-for="it in row.perms">
            <span v-if="it" :key="it.id"> {{ it.info }}、 </span>
          </template>
        </template>
      </el-table-column>
      <!-- <el-table-column label="状态" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.statusstr }}</span>
        </template>
      </el-table-column> -->
      <el-table-column v-if="!isVisitor" label="操作" align="center" width="150">
        <template slot-scope="{row, $index}">
          <!-- <el-button type="text" size="medium" @click="delHandler(row.id, $index)">删除</el-button> -->
          <el-button type="text" size="medium" @click="editHandle(row, $index)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Add :dialog-visible-add="dialogVisibleAdd" :options-permissions="optionsPermissions" :options-roles="optionsRoles" @changeAddVisible="changeAddVisible" @refresh="getPermsOfRole" />
    <Edit :edit-item="editItem" :dialog-visible-edit="dialogVisibleEdit" :options-permissions="optionsPermissions" @changeEditVisible="changeEditVisible" @refresh="getPermsOfRole" />
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import apiRole from '@/api/myrole'
import apiPermission from '@/api/mypermission'
import apiRoleperm from '@/api/roleperm'

import Add from './add.vue'
import Edit from './edit.vue'

export default {
  components: { Add, Edit },
  data () {
    return {
      isVisitor: (Cookies.get('Programme-isVisitor') && JSON.parse(Cookies.get('Programme-isVisitor'))) || false,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      filterForm: {
        permissionId: '',
        roleId: ''
      },
      editItem: {},
      editIndex: '',
      dialogVisibleAdd: false,
      dialogVisibleEdit: false,
      allPermissions: [],
      optionsPermissions: [],
      allRoles: [],
      optionsRoles: [],
      multipleSelection: [],
      listPermsOfRole: []
    }
  },
  watch: {
    allPermissions: function (newVal) {
      if (newVal.length) {
        this.optionsPermissions = newVal.map((item, idx, arr) => {
          return {
            label: item.info,
            value: item.id,
            key: item.id
          }
        })
      }
    },
    allRoles: function (newVal) {
      if (newVal.length) {
        this.optionsRoles = newVal.map((item, idx, arr) => {
          return {
            label: item.name,
            value: item.id
          }
        })
      }
    }
  },
  created () {
    this.getAllPermissions()
    this.getAllRoles()
    // this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      apiRoleperm.fetchList(this.listQuery).then(data => {
        this.list = data.items || []
        this.total = data.total

        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilter () {
      this.listQuery = {
        page: 1,
        limit: 20
      }
      if (this.filterForm.permissionId !== '') {
        this.listQuery.permissionId = this.filterForm.permissionId
      }
      if (this.filterForm.roleId !== '') {
        this.listQuery.roleId = this.filterForm.roleId
      }
      this.getList()
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.handleFilter()
    },
    changeAddVisible (params) {
      this.dialogVisibleAdd = params
    },
    getAllPermissions () {
      apiPermission.getAllPermissions().then(data => {
        this.allPermissions = data.items || []
      }).catch(error => {
        this.$message({
          message: error.message || '操作失败！',
          type: 'error'
        })
      })
    },
    getAllRoles () {
      apiRole.getAllRoles().then(data => {
        this.allRoles = data.items || []
        // 分别获取各角色的权限列表
        this.getPermsOfRole()
      }).catch(error => {
        this.$message({
          message: error.message || '操作失败！',
          type: 'error'
        })
      })
    },
    delHandler (id, idx) {
      this.$confirm('确定要删除此关联吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delRolePerm(id, idx)
      })
    },
    delRolePerm (id, idx) {
      apiRoleperm.deleteRolePerm({ id: id }).then(response => {
        this.$message({
          message: response.message || '删除成功！',
          type: 'success'
        })
        this.getList()
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    delSomeHandler () {
      this.$confirm('确定要删除所选关联记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delSome()
      })
    },
    delSome () {
      var requestList = this.multipleSelection.map(async item => {
        return new Promise((resolve, reject) => {
          apiRoleperm.deleteRolePerm({ id: item.id }).then(response => {
            resolve(response)
          }).catch((error) => {
            reject(error)
          })
        })
      })
      Promise.all(requestList).then(result => {
        console.log(result)
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
        this.getList()
      }).catch((result) => {
        console.log(result)
        console.log('失败了')
      })
    },
    getPermsOfRole () {
      this.listLoading = true
      var requestList = this.allRoles.map(async item => {
        var listQuery = {
          page: 1,
          limit: 100,
          roleId: item.id
        }
        return new Promise((resolve, reject) => {
          apiRoleperm.fetchList(listQuery).then(data => {
            var permissions = data.items.map(it => {
              return it.permission
            })
            resolve({ id: item.id, role: item, perms: permissions })
          }).catch((error) => {
            reject(error)
          })
        })
      })

      Promise.all(requestList).then(result => {
        console.log(result)
        this.listPermsOfRole = result
        this.listLoading = false
      }).catch((result) => {
        this.listLoading = false
        console.log(result)
        console.log('获取角色权限失败！')
      })
    },
    editHandle (item, idx) {
      this.editItem = item
      this.editIndex = idx
      this.dialogVisibleEdit = true
    },
    changeEditVisible (params) {
      this.dialogVisibleEdit = params
    }
  }
}
</script>
<style scoped>
.deviceTabs {
  margin-bottom: 10px;
}
</style>
