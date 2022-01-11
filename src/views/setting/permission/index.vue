<template>
  <div class="app-container">
    <el-form ref="filterForm" :model="filterForm" :inline="true" class="filter-form">
      <el-form-item prop="name">
        <el-input v-model="filterForm.name" placeholder="权限名称" style="width:120px" />
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
        创建权限
      </el-button>
      <el-button v-if="!isVisitor" class="filter-item" type="danger" icon="el-icon-delete" :disabled="!multipleSelection.length" @click="delSomeHandler">
        批量删除
      </el-button>
    </el-form>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 1196px;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="接口地址" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限描述" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.info }}</span>
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

    <Add :dialog-visible-add="dialogVisibleAdd" :routes-data="routesData" @changeAddVisible="changeAddVisible" @refresh="getList" />
    <Edit :edit-item="editItem" :dialog-visible-edit="dialogVisibleEdit" :routes-data="routesData" @changeEditVisible="changeEditVisible" @refresh="getList" />
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import apiPermission from '@/api/mypermission'
import { routes } from './routes.js'
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
      dialogVisibleEdit: false,
      routes: [],
      multipleSelection: []
    }
  },
  computed: {
    routesData () {
      return this.routes
    }
  },
  created () {
    this.getRoutes()
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      apiPermission.fetchList(this.listQuery).then(data => {
        this.list = data.items || []
        this.list.map(item => {
          item.menu = item.menu.split(',').filter(it => { return it.indexOf('_') === -1 })
        })
        this.total = data.total

        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    async getRoutes () {
      this.serviceRoutes = routes
      this.routes = this.generateRoutes(routes)
    },

    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes (routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          title: route.title,
          name: route.name
        }
        if (route.parent) {
          data.parent = route.parent
        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    onlyOneShowingChild (children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { title: parent.title, name: parent.name }
        return onlyOneChild
      }

      return false
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
      this.$confirm('确定要删除此权限吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delRole(id, idx)
      })
    },
    delRole (id, idx) {
      apiPermission.deletePermission({ id: id }).then(response => {
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
          apiPermission.deletePermission({ id: item.id }).then(response => {
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
