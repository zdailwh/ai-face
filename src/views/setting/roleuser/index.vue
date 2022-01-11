<template>
  <div class="app-container">
    <el-form ref="filterForm" :model="filterForm" :inline="true" class="filter-form">
      <el-form-item prop="userId">
        <el-select v-model="filterForm.userId" placeholder="用户">
          <el-option label="全部用户" value="" />
          <el-option v-for="item in optionsUsers" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="roleId">
        <el-select v-model="filterForm.roleId" placeholder="角色">
          <el-option label="全部角色" value="" />
          <el-option v-for="item in optionsRoles" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('filterForm')">重置</el-button>
      </el-form-item>
      <!-- <el-button v-if="!isVisitor" class="filter-item" type="primary" icon="el-icon-plus" @click="dialogVisibleAdd = true">
        创建关联记录
      </el-button> -->
      <el-button v-if="!isVisitor" class="filter-item" type="danger" icon="el-icon-delete" :disabled="!multipleSelection.length" @click="delSomeHandler">
        批量删除
      </el-button>
    </el-form>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 656px;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="用户名" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.user && row.user.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.role && row.role.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.statusstr }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="!isVisitor" label="操作" align="center" width="150">
        <template slot-scope="{row, $index}">
          <!-- <el-button type="text" size="medium" @click="editHandle(row, $index)">编辑</el-button> -->
          <el-button type="text" size="medium" @click="delHandler(row.id, $index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Add :dialog-visible-add="dialogVisibleAdd" :options-users="optionsUsers" :options-roles="optionsRoles" @changeAddVisible="changeAddVisible" @refresh="getList" />
    <Edit :edit-item="editItem" :dialog-visible-edit="dialogVisibleEdit" :options-roles="optionsRoles" @changeEditVisible="changeEditVisible" @refresh="getList" />
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import apiAdmin from '@/api/admin'
import apiRole from '@/api/myrole'
import apiRoleuser from '@/api/roleuser'

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
        userId: '',
        roleId: ''
      },
      dialogVisibleAdd: false,
      allUsers: [],
      optionsUsers: [],
      allRoles: [],
      optionsRoles: [],
      editItem: {},
      editIndex: '',
      dialogVisibleEdit: false,
      multipleSelection: []
    }
  },
  watch: {
    allUsers: function (newVal) {
      if (newVal.length) {
        this.optionsUsers = newVal.map((item, idx, arr) => {
          return {
            label: item.username,
            value: item.id
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
    this.getAllUsers()
    this.getAllRoles()
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      apiRoleuser.fetchList(this.listQuery).then(data => {
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
      if (this.filterForm.userId !== '') {
        this.listQuery.userId = this.filterForm.userId
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
    editHandle (item, idx) {
      this.editItem = JSON.parse(JSON.stringify(item))
      this.editIndex = idx
      this.dialogVisibleEdit = true
    },
    changeEditVisible (params) {
      this.dialogVisibleEdit = params
    },
    getAllUsers () {
      apiAdmin.getAllUsers().then(data => {
        this.allUsers = data.items || []
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
        this.delRoleUser(id, idx)
      })
    },
    delRoleUser (id, idx) {
      apiRoleuser.deleteRoleUser({ id: id }).then(response => {
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
          apiRoleuser.deleteRoleUser({ id: item.id }).then(response => {
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
    }
  }
}
</script>
<style scoped>
.deviceTabs {
  margin-bottom: 10px;
}
</style>
