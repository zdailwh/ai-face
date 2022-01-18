<template>
  <div class="faceContainer">
    <!--搜索-->
    <div class="searchWrap" :style="smallLayout? 'flex-direction: column;': ''">
      <a-form-model ref="searchForm" :model="searchForm" layout="inline">
        <a-form-model-item label="帧率" prop="frame_rate">
          <a-select v-model="searchForm.frame_rate" placeholder="选择帧率" style="width: 120px">
            <a-select-option :value="1">1</a-select-option>
            <a-select-option :value="2">2</a-select-option>
            <a-select-option :value="5">5</a-select-option>
            <a-select-option :value="25">25</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="优先级" prop="prority">
          <a-select v-model="searchForm.prority" placeholder="选择优先级" style="width: 120px">
            <a-select-option :value="item" :key="k" v-for="(item, k) in 3">{{item}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="创建时间" prop="createTime" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD">
          <a-range-picker :locale="locale" v-model="searchForm.createTime" style="width: 220px;" />
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="searchHandleOk"><a-icon key="search" type="search"/>搜索</a-button>
          <a-button style="margin-left: 10px;" @click="searchHandleReset('searchForm')">重置</a-button>
          <a-button style="margin-left: 10px;" type="primary" @click="addVisible = true"><a-icon key="plus" type="plus"/>创建模板</a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
    <!--搜索 end-->
    <div class="tableWrap">
      <a-table :columns="columns" :data-source="datalist" :scroll="{ x: true }" rowKey="id" :pagination="false">
        <span slot="groups" slot-scope="groups">
          <template v-for="(it, k) in groups">
            <router-link :to="{ path: '/facegroup/face', query: { groupId: it.id }}" :key="k">{{it.name}}|</router-link>
          </template>
        </span>
        <span slot="users" slot-scope="users">
          <template v-for="(it, k) in users">
            <span :key="k">{{it.username}}|</span>
            <!-- <router-link :to="{ path: '/setting/admin/index', query: { groupId: it }}" :key="k">{{it}}、</router-link> -->
          </template>
        </span>
        <span slot="create_time" slot-scope="create_time">
          {{create_time | dateFormat}}
        </span>
        <span slot="action" slot-scope="record, index, idx">
          <a @click="toEdit(record, idx)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定要删除该模板吗?"
            ok-text="删除"
            cancel-text="取消"
            @confirm="delTemp(record, idx)"
          >
            <a>删除</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a @click="toModeAssign(record, idx)">关联用户</a>
          <!-- <a-divider type="vertical" />
          <router-link :to="{ path: '/facegroup/face', query: { groupId: record.id }}">查看关联用户<a-icon type="right" /></router-link> -->
        </span>
      </a-table>
      <div style="margin: 15px 0;text-align: right;">
        <a-pagination
          v-model="page_no"
          :page-size-options="pageSizeOptions"
          :total="dataTotal"
          show-size-changer
          :page-size="page_size"
          @showSizeChange="onShowSizeChange"
          @change="onPageChange"
        >
          <template slot="buildOptionText" slot-scope="props">
            <span v-if="props.value !== dataTotal">{{ props.value }}条/页</span>
            <span v-if="props.value === dataTotal">全部</span>
          </template>
        </a-pagination>
      </div>
    </div>
    <!--创建模板-->
    <a-modal
      title="创建模板"
      width="800px"
      v-model="addVisible"
    >
      <div>
        <a-form-model :model="addForm">
          <a-form-model-item label="固定帧率" :label-col="{span:3}" :wrapper-col="{span:21}">
            <a-select v-model="addForm.frame_rate" :disabled="addForm.dynamic_rate > 0" @change="handleChangeFrameRate">
              <a-select-option :value="0">原始帧率</a-select-option>
              <a-select-option :value="5">5</a-select-option>
              <a-select-option :value="10">10</a-select-option>
              <a-select-option :value="15">15</a-select-option>
              <a-select-option :value="20">20</a-select-option>
              <a-select-option :value="25">25</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="动态帧率" :label-col="{span:3}" :wrapper-col="{span:21}">
            <a-select v-model="addForm.dynamic_rate" :disabled="addForm.frame_rate > 0" @change="handleChangeDynamicRate">
              <a-select-option :value="0">不启用</a-select-option>
              <a-select-option :value="5">5</a-select-option>
              <a-select-option :value="10">10</a-select-option>
              <a-select-option :value="15">15</a-select-option>
              <a-select-option :value="20">20</a-select-option>
              <a-select-option :value="25">25</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="优先级" :label-col="{span:3}" :wrapper-col="{span:21}">
            <a-select v-model="addForm.prority">
              <a-select-option :value="item" :key="k" v-for="(item, k) in 3">{{item}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="选择人脸组" :label-col="{span:3}" :wrapper-col="{span:21}">
            <a-transfer
              :data-source="groupsDatalist"
              :filter-option="filterOption"
              :showSelectAll="false"
              :showSearch="true"
              :locale="{ itemUnit: '项', itemsUnit: '项', notFoundContent: '列表为空', searchPlaceholder: '请输入搜索内容' }"
              :titles="['人脸组', '目标']"
              :target-keys="targetKeys"
              :selected-keys="selectedKeys"
              :list-style="{width: smallLayout?'100%':'200px', height: '260px'}"
              @change="handleChange"
              @selectChange="handleSelectChange">
              <template
                slot="children"
                slot-scope="{
                  props: { direction, filteredItems, selectedKeys, disabled: listDisabled },
                  on: { itemSelectAll, itemSelect },
                }"
              >
                <a-table
                  :row-selection="
                    getRowSelection({ disabled: listDisabled, selectedKeys, itemSelectAll, itemSelect })
                  "
                  :columns="direction === 'left' ? leftColumns : rightColumns"
                  :data-source="filteredItems"
                  :pagination="{ pageSize: 10 }"
                  size="small"
                  :style="{ pointerEvents: listDisabled ? 'none' : null }"
                  :custom-row="
                    ({ key, disabled: itemDisabled }) => ({
                      on: {
                        click: () => {
                          if (itemDisabled || listDisabled) return;
                          itemSelect(key, !selectedKeys.includes(key));
                        },
                      },
                    })
                  "
                  >
                  <template slot="title" slot-scope="item">
                    <a href="javascript:;">{{item.title}}</a>
                  </template>
                </a-table>
              </template>
            </a-transfer>
          </a-form-model-item>
        </a-form-model>
      </div>
      <template slot="footer">
        <a-button key="back" @click="handleCancel_add">
          取消
        </a-button>
        <a-button key="submit" type="primary" :loading="addLoading" @click="handleAdd">
          创建
        </a-button>
      </template>
    </a-modal>
    <!--编辑模板-->
    <a-modal
      title="模板维护"
      width="800px"
      v-model="editVisible"
    >
      <div>
        <a-form-model :model="editForm" :label-col="{span:0}">
          <a-form-model-item label="固定帧率" :label-col="{span:3}" :wrapper-col="{span:21}">
            <a-select v-model="editForm.frame_rate" :disabled="editForm.dynamic_rate > 0" @change="handleChangeFrameRate_edit">
              <a-select-option :value="0">原始帧率</a-select-option>
              <a-select-option :value="5">5</a-select-option>
              <a-select-option :value="10">10</a-select-option>
              <a-select-option :value="15">15</a-select-option>
              <a-select-option :value="20">20</a-select-option>
              <a-select-option :value="25">25</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="动态帧率" :label-col="{span:3}" :wrapper-col="{span:21}">
            <a-select v-model="editForm.dynamic_rate" :disabled="editForm.frame_rate > 0" @change="handleChangeDynamicRate_edit">
              <a-select-option :value="0">不启用</a-select-option>
              <a-select-option :value="5">5</a-select-option>
              <a-select-option :value="10">10</a-select-option>
              <a-select-option :value="15">15</a-select-option>
              <a-select-option :value="20">20</a-select-option>
              <a-select-option :value="25">25</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="优先级" :label-col="{span:3}" :wrapper-col="{span:21}">
            <a-select v-model="editForm.prority">
              <a-select-option :value="item" :key="k" v-for="(item, k) in 3">{{item}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="选择人脸组" :label-col="{span:3}" :wrapper-col="{span:21}">
            <a-transfer
              :data-source="groupsDatalist"
              :filter-option="filterOption"
              :showSelectAll="false"
              :showSearch="true"
              :locale="{ itemUnit: '项', itemsUnit: '项', notFoundContent: '列表为空', searchPlaceholder: '请输入搜索内容' }"
              :titles="['人脸组', '目标']"
              :target-keys="targetKeys"
              :selected-keys="selectedKeys"
              :list-style="{width: smallLayout?'100%':'200px', height: '260px'}"
              @change="handleChange"
              @selectChange="handleSelectChange">
              <template
                slot="children"
                slot-scope="{
                  props: { direction, filteredItems, selectedKeys, disabled: listDisabled },
                  on: { itemSelectAll, itemSelect },
                }"
              >
                <a-table
                  :row-selection="
                    getRowSelection({ disabled: listDisabled, selectedKeys, itemSelectAll, itemSelect })
                  "
                  :columns="direction === 'left' ? leftColumns : rightColumns"
                  :data-source="filteredItems"
                  :pagination="{ pageSize: 10 }"
                  size="small"
                  :style="{ pointerEvents: listDisabled ? 'none' : null }"
                  :custom-row="
                    ({ key, disabled: itemDisabled }) => ({
                      on: {
                        click: () => {
                          if (itemDisabled || listDisabled) return;
                          itemSelect(key, !selectedKeys.includes(key));
                        },
                      },
                    })
                  "
                  >
                  <template slot="title" slot-scope="item">
                    <a href="javascript:;">{{item.title}}</a>
                  </template>
                </a-table>
              </template>
            </a-transfer>
          </a-form-model-item>
        </a-form-model>
      </div>
      <template slot="footer">
        <a-button key="back" @click="handleCancel_edit">
          取消
        </a-button>
        <a-button key="submit" type="primary" :loading="editLoading" @click="handleEdit">
          更新
        </a-button>
      </template>
    </a-modal>

    <TempAssign :edit-item="editItem" :options-users="allUsers" :small-layout="smallLayout" :dialog-visible="modeAssignVisible" @changeVisible="changeModeAssignVisible" @refresh="getTemps" />
  </div>
</template>
<script>
import difference from 'lodash/difference'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
import api from '@/api'
import apiAdmin from '@/api/admin'
import TempAssign from '@/components/TempAssign'

var moment = require('moment')
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 100
  },
  {
    title: '帧率',
    dataIndex: 'frame_rate',
    key: 'frame_rate',
    width: 120
  },
  {
    title: '动态帧率',
    dataIndex: 'dynamic_rate',
    key: 'dynamic_rate',
    width: 120
  },
  {
    title: '优先级',
    dataIndex: 'prority',
    key: 'prority',
    width: 120
  },
  {
    title: '人脸组',
    dataIndex: 'groups',
    key: 'groups',
    scopedSlots: { customRender: 'groups' }
  },
  {
    title: '关联用户',
    dataIndex: 'users',
    key: 'users',
    scopedSlots: { customRender: 'users' },
    width: 120
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
  components: { TempAssign },
  beforeRouteEnter (to, from, next) {
    next()
  },
  data () {
    return {
      locale,
      smallLayout: false,
      spinning: false,
      datalist: [],
      dataTotal: 0,
      pageSizeOptions: ['10', '20', '30', '40', '50'],
      page_no: 1,
      page_size: 20,
      columns,
      addForm: {
        frame_rate: 25,
        dynamic_rate: 0,
        prority: 0
      },
      addLoading: false,
      addVisible: false,
      searchForm: {
        frame_rate: '',
        prority: '',
        createTime: []
      },
      editForm: {
      },
      editLoading: false,
      editItem: {},
      editKey: '',
      editVisible: false,
      leftColumns: leftTableColumns,
      rightColumns: rightTableColumns,
      targetGroupIds: [],
      targetKeys: [],
      selectedKeys: [],
      groupsDatalist: [],
      allUsers: [],
      modeAssignVisible: false
    }
  },
  filters: {
    dateFormat (val) {
      if (val === '' || val === null) return ''
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  mounted () {
    var viewWidth = document.documentElement.clientWidth
    if (viewWidth < 540) {
      this.smallLayout = true
    }

    this.getTemps()
    this.getAllGroups()
    this.getAllUsers()
  },
  methods: {
    onPageChange (current) {
      this.page_no = current
      this.getTemps()
    },
    onShowSizeChange (current, pageSize) {
      this.page_size = pageSize
      this.getTemps()
    },
    searchHandleOk () {
      this.page_no = 1
      this.getTemps()
    },
    searchHandleReset (formName) {
      this.$refs[formName].resetFields()
    },
    getTemps () {
      var params = {
        page_no: this.page_no,
        page_size: this.page_size
      }
      if (this.searchForm.frame_rate) {
        params.frame_rate = this.searchForm.frame_rate
      }
      if (this.searchForm.prority) {
        params.prority = this.searchForm.prority
      }
      if (this.searchForm.createTime && this.searchForm.createTime.length === 2) {
        params.createTime = 'range_' + moment(this.searchForm.createTime[0]).format('YYYY-MM-DD') + ',' + moment(this.searchForm.createTime[1]).format('YYYY-MM-DD')
      }

      this.spinning = true
      api.getTemps(params).then(res => {
        var resBody = res.data
        if (resBody.code === 0) {
          this.datalist = resBody.data.item
          this.dataTotal = resBody.data.total
          this.spinning = false
        } else {
          this.$message.error(resBody.message || '请求出错！')
        }
      }).catch(error => {
        this.spinning = false
        if (error.response.status === 401) {
          this.$store.dispatch('authentication/resetToken').then(() => {
            this.$router.push({ path: '/login' })
          })
        }
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '获取人脸库出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
      })
    },
    handleCancel_add () {
      this.addVisible = false
      this.addForm = {
        frame_rate: '',
        prority: ''
      }
    },
    handleAdd (e) {
      if (!this.addForm.frame_rate && !this.addForm.dynamic_rate) {
        this.$message.error('请选择固定帧率或动态帧率！')
        return
      }
      if (this.addForm.prority === '') {
        this.$message.error('请选择优先级！')
        return
      }
      if (!this.targetGroupIds.length) {
        this.$message.error('请选择人脸组！')
        return
      } else {
        this.addForm.group_ids = this.targetGroupIds.join(',')
      }
      console.log(this.addForm)
      this.addLoading = true
      api.addTemp(this.addForm).then(res => {
        if (res.data.code === 0) {
          this.page_no = 1
          this.getTemps()

          this.addVisible = false
          this.addLoading = false
          this.addForm = {
            frame_rate: 25,
            dynamic_rate: 0,
            prority: 0
          }
          this.$message.success('模板创建成功')
        } else {
          this.$message.error(res.data.message || '请求出错！')
        }
      }).catch(error => {
        this.addLoading = false
        if (error.response.status === 401) {
          this.$store.dispatch('authentication/resetToken').then(() => {
            this.$router.push({ path: '/login' })
          })
        }
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '创建出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
      })
    },
    toEdit (item, key) {
      this.editVisible = true
      this.editItem = item
      this.editKey = key
      this.editForm = item
      this.targetKeys = this.editForm.group_ids.split(',')
      this.targetGroupIds = this.targetKeys
    },
    handleCancel_edit () {
      this.editVisible = false
      this.editForm = {}
      this.editItem = {}
      this.editKey = ''
      this.targetKeys = []
      this.targetGroupIds = []
    },
    handleEdit () {
      if (!this.editForm.frame_rate && !this.editForm.dynamic_rate) {
        this.$message.error('请选择固定帧率或动态帧率！')
        return
      }
      if (this.editForm.prority === '') {
        this.$message.error('请选择优先级！')
        return
      }
      if (!this.targetGroupIds.length) {
        this.$message.error('请选择人脸组！')
        return
      }
      var params = {
        id: this.editItem.id,
        frame_rate: this.editForm.frame_rate,
        dynamic_rate: this.editForm.dynamic_rate,
        prority: this.editForm.prority,
        group_ids: this.targetGroupIds.join(',')
      }

      this.editLoading = true
      api.editTemp(params).then(res => {
        if (res.data.code === 0) {
          this.page_no = 1
          this.getTemps()

          this.editVisible = false
          this.editLoading = false
          this.editForm = {}
          this.$message.success('模板编辑成功')
        } else {
          this.$message.error(res.data.message || '请求出错！')
        }
      }).catch(error => {
        this.editLoading = false
        if (error.response.status === 401) {
          this.$store.dispatch('authentication/resetToken').then(() => {
            this.$router.push({ path: '/login' })
          })
        }
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '更新出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
      })
    },
    delTemp (record, idx) {
      api.delTemp({id: record.id}).then(res => {
        if (res.data.code === 0) {
          this.datalist.splice(idx, 1)
          this.$message.success('模板删除成功')
        } else {
          this.$message.error(res.data.message || '请求出错！')
        }
      }).catch(error => {
        if (error.response.status === 401) {
          this.$store.dispatch('authentication/resetToken').then(() => {
            this.$router.push({ path: '/login' })
          })
        }
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '删除出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
      })
    },
    getAllGroups () {
      api.getGroups().then(res => {
        var resBody = res.data
        if (resBody.code === 0) {
          var groupArr = resBody.data.item
          groupArr.map((item, key, arr) => {
            item.key = '' + item.id
            item.title = item.name
          })
          this.groupsDatalist = groupArr
        } else {
          this.$message.error(resBody.message || '请求出错！')
        }
      }).catch(error => {
        console.log(error)
        if (error.response.status === 401) {
          this.$store.dispatch('authentication/resetToken').then(() => {
            this.$router.push({ path: '/login' })
          })
        }
        // if (error.response && error.response.data) {
        //   this.$message.error(error.response.data.message || '获取明星列表出错！')
        // } else {
        //   this.$message.error('接口调用失败！')
        // }
      })
    },
    filterOption (inputValue, option) {
      return option.title.indexOf(inputValue) > -1
    },
    getRowSelection ({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
      return {
        getCheckboxProps: item => ({ props: { disabled: disabled || item.disabled } }),
        onSelectAll (selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter(item => !item.disabled)
            .map(({ key }) => key)
          const diffKeys = selected
            ? difference(treeSelectedKeys, selectedKeys)
            : difference(selectedKeys, treeSelectedKeys)
          itemSelectAll(diffKeys, selected)
        },
        onSelect ({ key }, selected) {
          itemSelect(key, selected)
        },
        selectedRowKeys: selectedKeys
      }
    },
    handleChange (nextTargetKeys, direction, moveKeys) {
      this.targetKeys = nextTargetKeys
      this.targetGroupIds = nextTargetKeys

      // console.log('targetKeys: ', nextTargetKeys)
      // console.log('direction: ', direction)
      // console.log('moveKeys: ', moveKeys)
    },
    handleSelectChange (sourceSelectedKeys, targetSelectedKeys) {
      this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys]

      // console.log('sourceSelectedKeys: ', sourceSelectedKeys)
      // console.log('targetSelectedKeys: ', targetSelectedKeys)
    },
    getAllUsers () {
      apiAdmin.getAllUsers().then(res => {
        var resBody = res.data
        if (resBody.code === 0) {
          var allUsers = resBody.data.item || []
          allUsers.map((item, key, arr) => {
            item.key = '' + item.id
            item.title = item.username
          })
          this.allUsers = allUsers
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
    toModeAssign (item, key) {
      this.modeAssignVisible = true
      this.editItem = item
    },
    changeModeAssignVisible (param) {
      this.modeAssignVisible = param
    },
    handleChangeFrameRate (val) {
      if (val !== 0) {
        this.addForm.dynamic_rate = 0
      }
    },
    handleChangeDynamicRate (val) {
      if (val !== 0) {
        this.addForm.frame_rate = 0
      }
    },
    handleChangeFrameRate_edit (val) {
      if (val !== 0) {
        this.editForm.dynamic_rate = 0
      }
    },
    handleChangeDynamicRate_edit (val) {
      if (val !== 0) {
        this.editForm.frame_rate = 0
      }
    }
  }
}

const leftTableColumns = [
  {
    dataIndex: 'title',
    title: '名称',
    scopedSlots: { customRender: 'name' }
  }
]
const rightTableColumns = [
  {
    dataIndex: 'title',
    title: '名称',
    scopedSlots: { customRender: 'name' }
  }
]
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
.tableImg {
  max-width: 50px;
}
.tableImg + .tableImg {
  margin-left: 5px;
}
.tablePopImg {
  max-width: 280px;
}

.searchWrap {
  display: flex;
  justify-content: space-between;
}
</style>
