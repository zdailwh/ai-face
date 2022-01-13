<template>
  <a-modal
    title="创建任务"
    width="800px"
    v-model="addVisible"
    :closable="false"
    :keyboard="false"
    :maskClosable="false"
  >
    <div>
      <a-form-model :model="addForm">
        <!-- <a-form-model-item label="任务类型" :label-col="{span:3}" :wrapper-col="{span:21}">
          <a-select v-model="addForm.type">
            <a-select-option :value="item.value" v-for="item in typeArr" v-bind:key="item.value">
              {{item.text}}
            </a-select-option>
          </a-select>
        </a-form-model-item> -->
        <a-form-model-item label="上传视频" v-if="addForm.type === 1" :label-col="{span:3}" :wrapper-col="{span:21}">
          <a-upload
            list-type="picture"
            :beforeUpload="beforeUpload"
            @change="uploadVideoChange"
          >
            <a-button> <a-icon type="upload" /> 选择视频文件 </a-button>
          </a-upload>
        </a-form-model-item>
        <a-form-model-item label="直播流地址" v-if="addForm.type !== 1" :label-col="{span:3}" :wrapper-col="{span:21}">
          <a-input v-model="addForm.url" :disabled="addForm.type === 1" />
        </a-form-model-item>
        <a-form-model-item label="任务名称" :label-col="{span:3}" :wrapper-col="{span:21}">
          <a-input v-model="addForm.name" />
        </a-form-model-item>
        <a-form-model-item label="任务描述" :label-col="{span:3}" :wrapper-col="{span:21}">
          <a-input v-model="addForm.description" />
        </a-form-model-item>
        <a-form-model-item label="模板" :label-col="{span:3}" :wrapper-col="{span:21}">
          <a-select v-model="mymode" :allowClear="true" @change="handleChangeMode">
            <a-select-option :value="item.id" v-for="item in modesData" v-bind:key="item.id" :myitem="item">
              帧率：{{item.frame_rate}} / 优先级：{{item.prority}} / 人脸组：{{item.group_ids}}
            </a-select-option>
            <a-select-option value="自定义">自定义</a-select-option>
          </a-select>
        </a-form-model-item>
        <template v-if="mymode !== ''">
          <a-form-model-item label="帧率" :label-col="{span:3}" :wrapper-col="{span:21}">
            <a-select v-model="addForm.frame_rate" :disabled="mymode !== '自定义'">
              <a-select-option :value="1">1</a-select-option>
              <a-select-option :value="2">2</a-select-option>
              <a-select-option :value="5">5</a-select-option>
              <a-select-option :value="25">25</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="优先级" :label-col="{span:3}" :wrapper-col="{span:21}">
            <a-select v-model="addForm.prority" :disabled="mymode !== '自定义'">
              <a-select-option :value="item" :key="k" v-for="(item, k) in 3">{{item}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="选择人脸组" :label-col="{span:3}" :wrapper-col="{span:21}">
            <a-transfer
              :data-source="groupsData"
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
        </template>
      </a-form-model>
    </div>
    <template slot="footer">
      <a-button key="back" @click="handleCancel">
        取消
      </a-button>
      <a-button key="submit" type="primary" :loading="addLoading" @click="handleOk">
        创建
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import difference from 'lodash/difference'
import api from '../api'

export default {
  props: [ 'tag', 'datalist', 'addVisible', 'facesData', 'modesData', 'groupsData', 'targetKeys', 'selectedKeys', 'smallLayout' ],
  data () {
    return {
      leftColumns: leftTableColumns,
      rightColumns: rightTableColumns,
      addLoading: false,
      addForm: {
        type: 1,
        url: '',
        name: '',
        description: '',
        frame_rate: '',
        prority: '',
        groupId: '',
        files: []
      },
      typeArr: [
        { value: 1, text: '文件' },
        { value: 2, text: '实时直播流' }
      ],
      targetGroupIds: [],
      mymode: ''
    }
  },
  methods: {
    handleChangeMode (val, opt) {
      if (val !== '自定义') {
        var selMode = opt.data.attrs.myitem
        this.addForm.frame_rate = selMode.frame_rate
        this.addForm.prority = selMode.prority
        this.addForm.groupId = selMode.group_ids
        this.updateParentData('targetKeys', selMode.group_ids.split(','))
      } else {
        this.addForm.frame_rate = ''
        this.addForm.prority = ''
        this.addForm.groupId = ''
        this.updateParentData('targetKeys', [])
      }
    },
    handleOk (e) {
      if (this.addForm.type === '') {
        this.$message.error('请选择任务类型！')
        return
      }
      if (this.addForm.type === 1) {
        if (!this.addForm.files.length) {
          this.$message.error('请选择上传视频文件！')
          return
        }
      } else {
        if (this.addForm.url === '') {
          this.$message.error('请填写任务地址！')
          return
        }
      }
      if (this.addForm.name === '') {
        this.$message.error('请填写任务名称！')
        return
      }
      // if (this.addForm.description === '') {
      //   this.$message.error('请填写任务描述！')
      //   return
      // }
      if (this.addForm.frame_rate === '') {
        this.$message.error('请选择帧率！')
        return
      }
      if (this.addForm.prority === '') {
        this.$message.error('请选择优先级！')
        return
      }

      var formdata = new FormData()
      var task = {
        type: this.addForm.type,
        name: this.addForm.name,
        description: this.addForm.description,
        frame_rate: this.addForm.frame_rate,
        prority: this.addForm.prority,
        group_ids: this.addForm.groupId !== '' ? this.addForm.groupId : this.targetGroupIds.join(',')
      }
      if (this.addForm.type === 2) {
        task.url = this.addForm.url
      }

      task = JSON.stringify(task)

      formdata.append('task', task)
      if (this.addForm.type === 1) {
        this.addForm.files.map((item, key, arr) => {
          formdata.append('file', item.originFileObj, item.originFileObj.name)
        })
      }

      this.addLoading = true
      api.addTask(formdata).then(res => {
        if (res.data.code === 0) {
          this.updateParentData('page_no', 1)
          this.$emit('getList')

          this.updateParentData('addVisible', false)
          this.addLoading = false
          this.addForm = {
            type: 1,
            url: '',
            name: '',
            description: '',
            frame_rate: '',
            prority: '',
            groupId: '',
            files: []
          }
          this.targetGroupIds = []
          this.$message.success('任务创建成功')
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
        this.$message.error(error.response.data.message || '创建出错！')
      })
    },
    handleCancel (e) {
      this.$notification.open({
        key: 'uploadVideo',
        duration: 0,
        message: 'Notification Title',
        description: `<a>123</a>`
      })
      // this.addVisible = false
      this.updateParentData('addVisible', false)
      this.addForm = {
        type: 1,
        url: '',
        name: '',
        description: '',
        frame_rate: '',
        prority: '',
        groupId: '',
        files: []
      }
    },
    beforeUpload (file, fileList) {
      return false
    },
    uploadVideoChange ({ fileList }) {
      this.addForm.files = fileList
    },
    filterOption (inputValue, option) {
      return option.title.indexOf(inputValue) > -1
    },
    getRowSelection ({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
      return {
        getCheckboxProps: item => ({ props: { disabled: disabled || item.disabled || this.mymode !== '自定义' } }),
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
      // this.targetKeys = nextTargetKeys
      this.updateParentData('targetKeys', nextTargetKeys)
      this.targetGroupIds = nextTargetKeys

      // console.log('targetKeys: ', nextTargetKeys)
      // console.log('direction: ', direction)
      // console.log('moveKeys: ', moveKeys)
    },
    handleSelectChange (sourceSelectedKeys, targetSelectedKeys) {
      // this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys]
      this.updateParentData('selectedKeys', [...sourceSelectedKeys, ...targetSelectedKeys])

      // console.log('sourceSelectedKeys: ', sourceSelectedKeys)
      // console.log('targetSelectedKeys: ', targetSelectedKeys)
    },
    updateParentData (key, val) {
      this.$emit('updateData', { key: key, val: val })
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
</style>
