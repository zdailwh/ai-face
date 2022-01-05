<template>
  <div class="taskContainer">
    <!--搜索-->
    <div class="searchWrap" :style="smallLayout? 'flex-direction: column;': ''">
      <a-form-model ref="searchForm" :model="searchForm" layout="inline">
        <a-form-model-item label="任务类型" prop="type">
          <a-select v-model="searchForm.type" :dropdownMatchSelectWidth="false">
            <a-select-option :value="key" v-for="(val,key) in typeArr_search" v-bind:key="key">
              {{val}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="任务名称" prop="name">
          <a-input v-model="searchForm.name" />
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="searchHandleOk"><a-icon key="search" type="search"/>搜索</a-button>
          <a-button style="margin-left: 10px;" @click="searchHandleReset('searchForm')">重置</a-button>
        </a-form-model-item>
      </a-form-model>
      <div>
        <a-button type="primary" @click="addVisible = true;targetKeys = []"><a-icon key="plus" type="plus"/>添加任务</a-button>
      </div>
    </div>
    <!--搜索 end-->
    <div class="tableWrap">
      <a-table :columns="columns" :data-source="datalist" :scroll="{ x: true }" rowKey="ID" :pagination="false">
        <span slot="status" slot-scope="status" style="color: #87d068;">
          {{status === 0? '初始化': status === 1? '排队中' : status === 2? '处理中' : '处理完成'}}
        </span>
        <span slot="type" slot-scope="type">
          {{type === '1'? '文件': type === '2'? '实时直播流': ''}}
        </span>
        <span slot="CreatedAt" slot-scope="CreatedAt">
          {{CreatedAt | dateFormat}}
        </span>
        <span slot="action" slot-scope="record, index, idx">
          <!-- <a @click="toEdit(record, idx, 'edit')">编辑</a>
          <a-divider type="vertical" /> -->
          <a-popconfirm
            title="确定要删除该任务吗?"
            ok-text="删除"
            cancel-text="取消"
            @confirm="delTask(record, idx)"
          >
            <a :disabled="record.status === 2">删除</a>
          </a-popconfirm>
          <!-- <a-divider type="vertical" />
          <a @click="toEdit(record, idx, 'copy')">复制</a> -->
          <a-divider type="vertical" />
          <template v-if="record.status === 2">
            <a-popconfirm
              title="确定要暂停该任务吗?"
              ok-text="暂停"
              cancel-text="取消"
              @confirm="pause(record, idx)"
            >
              <a>暂停</a>
            </a-popconfirm>
          </template>
          <template v-else>
            <a-popconfirm
              title="确定要恢复该任务吗?"
              ok-text="恢复"
              cancel-text="取消"
              @confirm="resume(record, idx)"
            >
              <a>恢复</a>
            </a-popconfirm>
          </template>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定要重置该任务吗?"
            ok-text="重置"
            cancel-text="取消"
            @confirm="reset(record, idx)"
          >
            <a>重置</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <router-link :to="'/taskResult/' + record.id">查看任务结果<a-icon type="right" /></router-link>
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

    <AddTask tag="offline" :datalist="datalist" :add-visible="addVisible" :faces-data="facesDatalist" :groups-data="groupDatalist" :target-keys="targetKeys" :selected-keys="selectedKeys" :small-layout="smallLayout" @updateData="updateData" @getList="getTasks" />
    <EditTask tag="offline" :datalist="datalist" :edit-visible="editVisible" :faces-data="facesDatalist" :groups-data="groupDatalist" :target-keys="targetKeys" :selected-keys="selectedKeys" :small-layout="smallLayout" :edit-tag="editTag" :edit-form="editForm" :edit-item="editItem" :edit-key="editKey" @updateData="updateData" @getList="getTasks" />

  </div>
</template>
<script>
import api from '../api'
import AddTask from '../components/AddTask.vue'
import EditTask from '../components/EditTask.vue'
var moment = require('moment')
const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: '任务名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description'
  },
  {
    title: '任务类型',
    dataIndex: 'type',
    key: 'type',
    scopedSlots: { customRender: 'type' }
  },
  {
    title: '文件路径',
    dataIndex: 'filepath',
    key: 'filepath'
  },
  {
    title: '人脸组',
    dataIndex: 'groupId',
    key: 'groupId'
  },
  {
    title: '人脸',
    dataIndex: 'faceIds',
    key: 'faceIds'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
    scopedSlots: { customRender: 'create_time' }
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  components: { AddTask, EditTask },
  beforeRouteEnter (to, from, next) {
    next()
  },
  data () {
    return {
      stream_type: 'offline',
      smallLayout: false,
      spinning: false,
      searchForm: {
        type: 0,
        name: ''
      },
      datalist: [],
      dataTotal: 0,
      pageSizeOptions: ['10', '20', '30', '40', '50'],
      page_no: 1,
      page_size: 20,
      columns,
      addVisible: false,
      editVisible: false,
      typeArr_search: [ '任意', '文件', '实时直播流' ],
      targetKeys: [],
      selectedKeys: [],
      editForm: {},
      editItem: {},
      editKey: '',
      editTag: '', // 'edit' || 'copy'
      facesDatalist: [],
      groupDatalist: []
    }
  },
  filters: {
    dateFormat (val) {
      if (val === '') return ''
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  mounted () {
    var ele = document.querySelectorAll('.file-main')
    ele[0].style.backgroundColor = '#fff'

    var viewWidth = document.documentElement.clientWidth
    if (viewWidth < 540) {
      this.smallLayout = true
    }

    this.getTasks()
    this.getAllFaces()
    this.getAllGroups()
  },
  methods: {
    onPageChange (current) {
      this.page_no = current
      this.getTasks()
    },
    onShowSizeChange (current, pageSize) {
      this.page_size = pageSize
      this.getTasks()
    },
    searchHandleOk () {
      this.page_no = 1
      var query = {}
      if (this.searchForm.type !== 0) {
        query.type = this.searchForm.type
      }
      if (this.searchForm.name !== '') {
        query.name = this.searchForm.name
      }
      this.getTasks(query)
    },
    searchHandleReset (formName) {
      this.$refs[formName].resetFields()
    },
    getTasks (query) {
      var params = {
        page_no: this.page_no,
        page_size: this.page_size,
        stream_type: this.stream_type
      }
      if (query && query.type) {
        params.type = query.type
      }
      if (query && query.name) {
        params.name = query.name
      }
      this.spinning = true
      api.getTasks(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.datalist = res.data.data
          if (this.page_no === 1) {
            this.dataTotal = res.data.total
          }
          this.spinning = false
        }
      }).catch(error => {
        this.spinning = false
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '获取任务列表出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
      })
    },
    delTask (record, idx) {
      api.delTask({id: record.id}).then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.$message.success('任务删除成功')
          this.getTasks()
        }
      }).catch(error => {
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '删除出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
      })
    },
    // toEdit (item, key, tag) {
    //   this.editTag = tag
    //   this.editVisible = true
    //   this.editItem = item
    //   this.editKey = key
    //   this.editForm = item
    //   this.editForm.type = parseInt(this.editForm.type)
    //   this.targetKeys = this.editForm.face_ids
    // },
    resume (item, key) {
      var params = {
        id: item.id
      }
      api.taskResume(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          // this.datalist[key].status = 1
          this.$message.success('任务已恢复')
          this.getTasks()
        }
      }).catch(error => {
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '任务恢复出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
      })
    },
    pause (item, key) {
      var params = {
        id: item.id
      }
      api.taskPause(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          // this.datalist[key].status = 2
          this.$message.success('任务已暂停')
          this.getTasks()
        }
      }).catch(error => {
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '任务暂停出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
      })
    },
    reset (item, key) {
      var params = {
        id: item.id
      }
      api.taskReset(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          // this.datalist[key].status = 2
          this.$message.success('任务已重置')
          this.getTasks()
        }
      }).catch(error => {
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '任务重置出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
      })
    },
    updateData (params) {
      this[params.key] = params.val
    },
    getAllFaces () {
      var params = {
        page_no: 1,
        page_size: this.$store.state.faceTotal || 100
      }
      api.getFaces(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          var faceArr = res.data.data
          faceArr.map((item, key, arr) => {
            item.key = item.id
            item.title = item.name
          })
          this.facesDatalist = faceArr
        }
      }).catch(error => {
        console.log(error)
        // if (error.response && error.response.data) {
        //   this.$message.error(error.response.data.message || '获取明星列表出错！')
        // } else {
        //   this.$message.error('接口调用失败！')
        // }
      })
    },
    getAllGroups () {
      var params = {
        page_no: 1,
        page_size: this.$store.state.groupTotal || 100
      }
      api.getGroups(params).then(res => {
        if (res.status >= 200 && res.status < 300) {
          var groupArr = res.data.data
          groupArr.map((item, key, arr) => {
            item.value = item.id
            item.text = item.name
          })
          this.groupDatalist = groupArr
        }
      }).catch(error => {
        console.log(error)
        // if (error.response && error.response.data) {
        //   this.$message.error(error.response.data.message || '获取明星列表出错！')
        // } else {
        //   this.$message.error('接口调用失败！')
        // }
      })
    }
  }
}

</script>
<style scoped>
.taskContainer {
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #fff;
}
.tableWrap {
  width: 100%;
  margin-top: 20px;
}
.searchWrap {
  display: flex;
  justify-content: space-between;
}
.desc {
  color: #555;
}
.date {
  font-size: .8em;
  color: #aaa;
}
</style>
