<template>
  <div class="app-container">
    <el-form ref="filterForm" :model="filterForm" :inline="true" class="filter-form">
      <el-form-item prop="name">
        <el-input v-model="filterForm.name" placeholder="角色名称" style="width:120px" />
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('filterForm')">重置</el-button>
      </el-form-item>
      <el-button v-if="!isVisitor" class="filter-item" type="primary" icon="el-icon-plus" @click="dialogVisibleAdd = true">
        创建角色
      </el-button>
    </el-form>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 641px;">
      <el-table-column label="角色名称" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" width="200">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="等级" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.levelstr }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.statusstr }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="!isVisitor" label="操作" align="center" width="120">
        <template slot-scope="{row, $index}">
          <el-button type="text" size="medium" @click="editHandle(row, $index)">编辑</el-button>
          <el-button type="text" size="medium" @click="delHandler(row.id, $index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Add :dialog-visible-add="dialogVisibleAdd" @changeAddVisible="changeAddVisible" @refresh="getList" />
    <Edit :edit-item="editItem" :dialog-visible-edit="dialogVisibleEdit" @changeEditVisible="changeEditVisible" @refresh="getList" />
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import apiRole from '@/api/myrole'
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
        name: ''
      },
      editItem: {},
      editIndex: '',
      dialogVisibleAdd: false,
      dialogVisibleEdit: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      apiRole.fetchList(this.listQuery).then(data => {
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
      if (this.filterForm.name !== '') {
        this.listQuery.name = this.filterForm.name
      }
      this.getList()
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.handleFilter()
    },
    delHandler (id, idx) {
      this.$confirm('确定要删除此角色吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delRole(id, idx)
      })
    },
    delRole (id, idx) {
      apiRole.deleteRole({ id: id }).then(response => {
        this.$message({
          message: response.message || '删除成功！',
          type: 'success'
        })
        this.getList()
      })
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
    }
  }
}
</script>
