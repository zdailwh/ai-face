<template>
  <div class="faceContainer">
    <!--搜索-->
    <div class="searchWrap" :style="smallLayout? 'flex-direction: column;': ''">
      <a-form-model ref="searchForm" :model="searchForm" layout="inline">
        <a-form-model-item label="创建时间" prop="createTime" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD">
          <a-range-picker :locale="locale" v-model="searchForm.createTime" style="width: 220px;" />
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="searchHandleOk"><a-icon key="search" type="search"/>搜索</a-button>
          <a-button style="margin-left: 10px;" @click="searchHandleReset('searchForm')">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
    <!--搜索 end-->
    <div class="tableWrap">
      <a-table :columns="columns" :data-source="datalist" :scroll="{ x: true }" rowKey="id" :pagination="false">
        <span slot="create_time" slot-scope="create_time">
          {{create_time | dateFormat}}
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
  </div>
</template>
<script>
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
import api from '@/api/action'

var moment = require('moment')
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 100
  },
  {
    title: '用户',
    dataIndex: 'userName',
    key: 'userName',
    width: 120
  },
  {
    title: 'url',
    dataIndex: 'url',
    key: 'url',
    width: 120
  },
  {
    title: '描述',
    dataIndex: 'info',
    key: 'info',
    width: 120
  },
  {
    title: '请求方式',
    dataIndex: 'methodType',
    key: 'methodType',
    width: 120
  },
  {
    title: '请求参数',
    dataIndex: 'requestParam',
    key: 'requestParam',
    width: 120
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
    scopedSlots: { customRender: 'create_time' },
    width: 120
  }
]

export default {
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
      searchForm: {
        createTime: []
      }
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

    this.getLogs()
  },
  methods: {
    onPageChange (current) {
      this.page_no = current
      this.getLogs()
    },
    onShowSizeChange (current, pageSize) {
      this.page_size = pageSize
      this.getLogs()
    },
    searchHandleOk () {
      this.page_no = 1
      this.getLogs()
    },
    searchHandleReset (formName) {
      this.$refs[formName].resetFields()
    },
    getLogs () {
      var params = {
        page_no: this.page_no,
        page_size: this.page_size
      }
      if (this.searchForm.createTime && this.searchForm.createTime.length === 2) {
        params.createTime = 'range_' + moment(this.searchForm.createTime[0]).format('YYYY-MM-DD') + ',' + moment(this.searchForm.createTime[1]).format('YYYY-MM-DD')
      }

      this.spinning = true
      api.getLogs(params).then(res => {
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
          this.$message.error(error.response.data.message || '获取日志出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
      })
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

.searchWrap {
  display: flex;
  justify-content: space-between;
}
</style>
