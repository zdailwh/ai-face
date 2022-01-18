<template>
  <div class="faceContainer">
    <!--搜索-->
    <div class="searchWrap" :style="smallLayout? 'flex-direction: column;': ''">
      <a-form-model ref="filterForm" :model="filterForm" layout="inline">
        <a-form-model-item>
          <!-- <a-button type="primary" @click="handleFilter"><a-icon key="search" type="search"/>搜索</a-button>
          <a-button style="margin-left: 10px;" @click="resetForm('filterForm')">重置</a-button> -->
          <a-button style="margin-left: 10px;" type="primary" @click="dialogVisibleAdd = true"><a-icon key="plus" type="plus"/>配置角色接口权限</a-button>
          <a-button style="margin-left: 10px;" type="primary"><a-icon key="plus" type="plus"/>配置角色菜单权限</a-button>
          <!-- <a-popconfirm
            title="确定要删除所选关联记录吗？"
            ok-text="删除"
            cancel-text="取消"
            @confirm="delSome()"
          >
            <a-button style="margin-left: 10px;" type="danger" :disabled="!multipleSelection.length"><a-icon key="delete" type="delete"/>批量删除</a-button>
          </a-popconfirm> -->
        </a-form-model-item>
      </a-form-model>
    </div>
    <!--搜索 end-->

    <div class="tableWrap">
      <a-table :columns="columns" :data-source="listPermsOfRole" :scroll="{ x: true }" rowKey="id" :pagination="false">
        <span slot="role" slot-scope="role">
          {{ role && role.name }}
        </span>
        <div slot="perms" slot-scope="perms">
          <template v-if="perms.length">
            <span v-for="it in perms" :key="it.id"> {{ it.info }}、 </span>
          </template>
        </div>
        <span slot="create_time" slot-scope="create_time">
          {{create_time | dateFormat}}
        </span>
        <span slot="action" slot-scope="action, record, idx">
          <a @click="editHandle(record, idx)">编辑</a>
          <!-- <a-divider type="vertical" />
          <a-popconfirm
            title="确定要删除此关联吗？"
            ok-text="删除"
            cancel-text="取消"
            @confirm="delRolePerm(record.id, idx)"
          >
            <a>删除</a>
          </a-popconfirm> -->
        </span>
      </a-table>
      <div style="margin: 15px 0;text-align: right;">
        <a-pagination
          v-model="listQuery.page"
          :page-size-options="pageSizeOptions"
          :total="total"
          show-size-changer
          :page-size="listQuery.limit"
          @showSizeChange="onShowSizeChange"
          @change="onPageChange"
        >
          <template slot="buildOptionText" slot-scope="props">
            <span v-if="props.value !== total">{{ props.value }}条/页</span>
            <span v-if="props.value === total">全部</span>
          </template>
        </a-pagination>
      </div>
    </div>

    <Add :dialog-visible="dialogVisibleAdd" :options-permissions="optionsPermissions" :options-roles="optionsRoles" @changeVisible="changeAddVisible" @refresh="getPermsOfRole" />
    <Edit :edit-item="editItem" :dialog-visible="dialogVisibleEdit" :options-permissions="optionsPermissions" @changeVisible="changeEditVisible" @refresh="getPermsOfRole" />
  </div>
</template>

<script>
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
import Cookies from 'js-cookie'
import apiRole from '@/api/myrole'
import apiPermission from '@/api/mypermission'
import apiRoleperm from '@/api/roleperm'

import Add from './add.vue'
import Edit from './edit.vue'

var moment = require('moment')
const columns = [
  // {
  //   title: 'ID',
  //   dataIndex: 'id',
  //   key: 'id',
  //   width: 50
  // },
  {
    title: '角色名',
    dataIndex: 'role',
    key: 'role',
    scopedSlots: { customRender: 'role' },
    width: 100
  },
  {
    title: '权限名',
    dataIndex: 'perms',
    key: 'perms',
    scopedSlots: { customRender: 'perms' },
    width: 120
  },
  {
    title: '状态',
    dataIndex: 'statusstr',
    key: 'statusstr',
    scopedSlots: { customRender: 'statusstr' },
    width: 100
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
    scopedSlots: { customRender: 'create_time' },
    width: 120
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    width: 120
  }
]

export default {
  components: { Add, Edit },
  filters: {
    dateFormat (val) {
      if (val === '' || val === null) return ''
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  data () {
    return {
      locale,
      columns,
      pageSizeOptions: ['10', '20', '30', '40', '50'],
      smallLayout: false,
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
    var ele = document.querySelectorAll('.file-main')
    ele[0].style.backgroundColor = '#fff'
    var viewWidth = document.documentElement.clientWidth
    if (viewWidth < 540) {
      this.smallLayout = true
    }

    this.getAllPermissions()
    this.getAllRoles()
    // this.getList()
  },
  methods: {
    onPageChange (current) {
      this.listQuery.page = current
      this.getList()
    },
    onShowSizeChange (current, pageSize) {
      this.listQuery.limit = pageSize
      this.getList()
    },
    getList () {
      this.listLoading = true
      apiRoleperm.fetchList(this.listQuery).then(res => {
        this.listLoading = false
        var resBody = res.data
        if (resBody.code === 0) {
          this.list = resBody.data.item || []
          this.total = resBody.data.total
        } else {
          this.$message.error(resBody.message || '请求出错！')
        }
      }).catch((error) => {
        this.listLoading = false
        if (error.response.status === 401) {
          this.$store.dispatch('authentication/resetToken').then(() => {
            this.$router.push({ path: '/login' })
          })
        }
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || error.response.data)
        } else {
          this.$message.error('接口调用失败！')
        }
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
      apiPermission.getAllPermissions().then(res => {
        var resBody = res.data
        if (resBody.code === 0) {
          this.allPermissions = resBody.data.item || []
        } else {
          this.$message.error(resBody.message || '请求出错！')
        }
      }).catch(error => {
        if (error.response.status === 401) {
          this.$store.dispatch('authentication/resetToken').then(() => {
            this.$router.push({ path: '/login' })
          })
        }
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || error.response.data)
        } else {
          this.$message.error('接口调用失败！')
        }
      })
    },
    getAllRoles () {
      apiRole.getAllRoles().then(res => {
        var resBody = res.data
        if (resBody.code === 0) {
          this.allRoles = resBody.data.item || []
          // 分别获取各角色的权限列表
          this.getPermsOfRole()
        } else {
          this.$message.error(resBody.message || '请求出错！')
        }
      }).catch(error => {
        if (error.response.status === 401) {
          this.$store.dispatch('authentication/resetToken').then(() => {
            this.$router.push({ path: '/login' })
          })
        }
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || error.response.data)
        } else {
          this.$message.error('接口调用失败！')
        }
      })
    },
    delRolePerm (id, idx) {
      apiRoleperm.deleteRolePerm({ id: id }).then(res => {
        var resBody = res.data
        if (resBody.code === 0) {
          this.$message.success('删除成功！')
          this.getList()
        } else {
          this.$message.error(resBody.message || '请求出错！')
        }
      }).catch(error => {
        if (error.response.status === 401) {
          this.$store.dispatch('authentication/resetToken').then(() => {
            this.$router.push({ path: '/login' })
          })
        }
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || error.response.data)
        } else {
          this.$message.error('接口调用失败！')
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    delSome () {
      var requestList = this.multipleSelection.map(async item => {
        return new Promise((resolve, reject) => {
          apiRoleperm.deleteRolePerm({ id: item.id }).then(response => {
            var resBody = response.data
            if (resBody.code === 0) {
              resolve(response)
            } else {
              reject(resBody.message || '请求出错！')
            }
          }).catch((error) => {
            reject(error)
          })
        })
      })
      Promise.all(requestList).then(result => {
        console.log(result)
        this.$message.success('删除成功！')
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
          apiRoleperm.fetchList(listQuery).then(response => {
            var resBody = response.data
            if (resBody.code === 0) {
              var permissions = resBody.data.item.map(it => {
                return it.permission
              })
              resolve({ id: item.id, role: item, perms: permissions })
            } else {
              reject(resBody.message || '请求出错！')
            }
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
.faceContainer {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.tableWrap {
  width: 100%;
  margin-top: 20px;
}
</style>
