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
      <a-form-model ref="form" :model="addForm" :rules="ruleValidate">
        <!-- <a-form-model-item label="任务类型" :label-col="{span:3}" :wrapper-col="{span:21}">
          <a-select v-model="addForm.type">
            <a-select-option :value="item.value" v-for="item in typeArr" v-bind:key="item.value">
              {{item.text}}
            </a-select-option>
          </a-select>
        </a-form-model-item> -->
        <a-form-model-item label="上传视频" v-if="addForm.type === 1" :label-col="{span:3}" :wrapper-col="{span:21}">
          <a-upload
            list-type="text"
            :multiple="true"
            :beforeUpload="beforeUpload"
            @change="uploadVideoChange"
          >
            <a-button> <a-icon type="upload" /> 选择视频文件 </a-button>
          </a-upload>
          <a-table :columns="filecolumns" :data-source="filterList" row-key="file.name" v-if="filterList.length" size="small" :pagination="false">
          <!-- <a-button @click="folderCheckConfirm"><a-icon type="file" />选择文件所属目录</a-button>
          <a-button @click="fileCheckConfirm" style="margin-left: 15px;"><a-icon type="folder-open" />选择文件</a-button>
          <a-tag v-for="tag in enableFile" :key="tag" @close="() => handleCloseTag(tag)">{{ tag }}</a-tag>
          <p><span v-for="tag in enableFile" :key="tag">{{ tag }}、</span></p>
          <a-table :columns="filecolumns" :data-source="filterList" row-key="file.name" v-if="filterList.length" size="small" :pagination="false"> -->
          </a-table>
        </a-form-model-item>
        <a-form-model-item label="直播流地址" prop="url" v-if="addForm.type !== 1" :label-col="{span:3}" :wrapper-col="{span:21}">
          <a-input v-model="addForm.url" :disabled="addForm.type === 1" />
        </a-form-model-item>
        <a-form-model-item label="任务名称" prop="name" :label-col="{span:3}" :wrapper-col="{span:21}">
          <a-input v-model="addForm.name" />
        </a-form-model-item>
        <a-form-model-item label="任务描述" prop="description" :label-col="{span:3}" :wrapper-col="{span:21}">
          <a-input v-model="addForm.description" />
        </a-form-model-item>
        <a-form-model-item label="模板" prop="mymode" :label-col="{span:3}" :wrapper-col="{span:21}">
          <a-select v-model="addForm.mymode" :allowClear="true" @change="handleChangeMode">
            <a-select-option :value="item.id" v-for="item in modesData" v-bind:key="item.id" :myitem="item">
              帧率：{{item.frame_rate}} / 优先级：{{item.prority}} / 人脸组：{{item.group_ids}}
            </a-select-option>
            <a-select-option value="自定义">自定义</a-select-option>
          </a-select>
        </a-form-model-item>
        <template v-if="addForm.mymode !== ''">
          <a-form-model-item label="帧率" prop="frame_rate" :label-col="{span:3}" :wrapper-col="{span:21}">
            <a-select v-model="addForm.frame_rate" :disabled="addForm.mymode !== '自定义'">
              <a-select-option :value="1">1</a-select-option>
              <a-select-option :value="2">2</a-select-option>
              <a-select-option :value="5">5</a-select-option>
              <a-select-option :value="25">25</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="优先级" prop="prority" :label-col="{span:3}" :wrapper-col="{span:21}">
            <a-select v-model="addForm.prority" :disabled="addForm.mymode !== '自定义'">
              <a-select-option :value="item" :key="k" v-for="(item, k) in 3">{{item}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="选择人脸组" prop="groupId" :label-col="{span:3}" :wrapper-col="{span:21}">
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
      <a-button key="back" @click="reset">
        取消
      </a-button>
      <a-button key="submit" type="primary" :loading="addLoading" @click="commit">
        创建
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import difference from 'lodash/difference'
import api from '../api'

const SIZE = 32 * 1024 * 1024 // 切片大小
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
        mymode: '',
        frame_rate: '',
        prority: '',
        groupId: '',
        files: []
      },
      ruleValidate: {
        type: [
          { required: true, type: 'number', message: '任务类型不能为空', trigger: 'change' }
        ],
        name: [
          { required: true, type: 'string', message: '任务名称不能为空', trigger: 'blur' }
        ],
        mymode: [
          { required: true, type: 'number', message: '模板不能为空', trigger: 'change' }
        ],
        // description: [
        //   { required: true, type: 'string', message: '任务描述不能为空', trigger: 'blur' }
        // ],
        frame_rate: [
          { required: true, type: 'number', message: '帧率不能为空', trigger: 'change' }
        ],
        prority: [
          { required: true, type: 'number', message: '优先级不能为空', trigger: 'change' }
        ]
      },
      typeArr: [
        { value: 1, text: '文件' },
        { value: 2, text: '实时直播流' }
      ],
      targetGroupIds: [],
      // 上传视频相关 ----------------------------------------------
      filecolumns,
      container: {
        file: null,
        hash: '',
        worker: null
      },
      enableFile: ['TS', 'MXF', 'MP4', 'MPG', 'MOV', 'AVI', 'MPEG', 'M2TS', 'WMV', 'FLV', 'RMVB', 'M4V'],
      uploadCompleted: true, // 当前页文件是否已经全部上传
      list: [],
      filterList: [],
      requestList: []
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
    commit () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          // this.createTask()
          await this.createTasks(this.filterList, 0)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // createTask (e) {
    //   var formdata = new FormData()
    //   var task = {
    //     type: this.addForm.type,
    //     name: this.addForm.name,
    //     description: this.addForm.description,
    //     frame_rate: this.addForm.frame_rate,
    //     prority: this.addForm.prority,
    //     group_ids: this.addForm.groupId !== '' ? this.addForm.groupId : this.targetGroupIds.join(',')
    //   }
    //   if (this.addForm.type === 2) {
    //     task.url = this.addForm.url
    //   }

    //   task = JSON.stringify(task)

    //   formdata.append('task', task)
    //   if (this.addForm.type === 1) {
    //     this.addForm.files.map((item, key, arr) => {
    //       formdata.append('file', item.originFileObj, item.originFileObj.name)
    //     })
    //   }

    //   this.addLoading = true
    //   api.addTask(formdata).then(res => {
    //     this.addLoading = false
    //     if (res.data.code === 0) {
    //       this.updateParentData('page_no', 1)
    //       this.$emit('getList')

    //       this.updateParentData('addVisible', false)
    //       this.addForm = {
    //         type: 1,
    //         url: '',
    //         name: '',
    //         description: '',
    //         frame_rate: '',
    //         prority: '',
    //         groupId: '',
    //         files: []
    //       }
    //       this.targetGroupIds = []
    //       this.$message.success('任务创建成功')
    //     } else {
    //       this.$message.error(res.data.message || '请求出错！')
    //     }
    //   }).catch(error => {
    //     this.addLoading = false
    //     if (error.response.status === 401) {
    //       this.$store.dispatch('authentication/resetToken').then(() => {
    //         this.$router.push({ path: '/login' })
    //       })
    //     }
    //     this.$message.error(error.response.data.message || '创建出错！')
    //   })
    // },
    reset (e) {
      // this.addVisible = false
      this.$refs.form.resetFields()
      this.updateParentData('addVisible', false)
    },
    beforeUpload (file, fileList) {
      return false
    },
    uploadVideoChange ({ fileList }) {
      this.addForm.files = fileList
      this.filterList = []
      for (var i = 0; i < fileList.length; i++) {
        var file = fileList[i]

        var ext = file.name.substring(file.name.lastIndexOf('.') + 1)
        if (this.enableFile.includes(ext) || this.enableFile.includes(ext.toUpperCase()) || this.enableFile.includes(ext.toLowerCase())) {
          this.filterList.push({ file: file.originFileObj, ext: ext, percentage: 0, percentageHash: 0, createRes: '' })
        }
      }
    },
    filterOption (inputValue, option) {
      return option.title.indexOf(inputValue) > -1
    },
    getRowSelection ({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
      return {
        getCheckboxProps: item => ({ props: { disabled: disabled || item.disabled || this.addForm.mymode !== '自定义' } }),
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
    },
    // 上传视频相关 ------------------------------------------------------------------------------------->
    handleCloseTag (removedTag) {
      const tags = this.enableFile.filter(tag => tag !== removedTag)
      this.enableFile = tags
    },
    resetFilelist () {
      this.list = []
      this.filterList = []
      // this.$refs.multipleTable.clearSelection()
      // this.extsArr = []
      // this.checkedExts = []
    },
    async createTasks (filelist, startIdx) {
      this.uploadCompleted = false

      const listItem = filelist[startIdx]
      const fileChunkList = await this.createFileChunk(listItem.file)
      listItem.fileChunkList = fileChunkList
      console.log(startIdx + '切片个数：' + fileChunkList.length)
      listItem.hash = await this.calculateHash(fileChunkList, filelist, startIdx)
      await this.createTask(listItem, startIdx).then(async (response) => {
        console.log('创建任务返回' + startIdx + '/' + response.data.id)
        listItem.taskid = response.id

        this.uploadFiles(filelist, startIdx)
      }).catch((error) => {
        filelist[startIdx].createRes = (error.response && error.response.data) || '节目创建执行失败'
      })

      if (startIdx < filelist.length - 1) {
        await this.createTasks(filelist, startIdx + 1)
      } else {
        this.uploadCompleted = true
      }
    },
    async createTask (fileItem, idx) {
      var md5 = fileItem.hash
      var params = {
        type: this.addForm.type,
        name: this.addForm.name,
        description: this.addForm.description,
        frame_rate: this.addForm.frame_rate,
        prority: this.addForm.prority,
        group_ids: this.addForm.groupId !== '' ? this.addForm.groupId : this.targetGroupIds.join(','),
        filename: fileItem.file.name,
        md5: md5,
        ext: fileItem.ext
      }
      return new Promise((resolve, reject) => {
        api.addTask(params).then(res => {
          if (res.data.code === 0) {
            resolve(res.data)
          } else {
            reject(res.data.message || '请求出错！')
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    async uploadFiles (filelist, startIdx) {
      console.log('开始上传文件' + startIdx)
      const listItem = filelist[startIdx]
      const fileChunkList = listItem.fileChunkList

      var requestList = []

      this.chunkData = fileChunkList.map(({ file }, index) => ({
        taskid: listItem.taskid,
        fileHash: listItem.hash,
        index,
        hash: listItem.hash + '-' + index,
        chunk: file,
        size: file.size,
        percentage: 0
      }))

      requestList = await this.uploadChunks(filelist, startIdx, this.chunkData)
      await Promise.all(requestList).then(async (result) => {
        // 合并切片
        await this.mergeRequest(listItem.taskid)
      }).catch((error) => {
        console.log('分片上传失败了')
        console.log(error)
      })
    },
    // 上传切片，同时过滤已上传的切片
    async uploadChunks (filelist, startIdx, chunkData, uploadedList = []) {
      const requestList = chunkData
        .filter(({ hash }) => !uploadedList.includes(hash))
        .map(({ taskid, fileHash, chunk, hash, index, size }) => {
          const formData = new FormData()
          formData.append('taskId', taskid)
          formData.append('chunk', chunk)
          formData.append('hash', hash)
          formData.append('chunkTotal', chunkData.length)
          formData.append('fileHash', fileHash)
          formData.append('size', size)
          return { formData, index }
        })
        .map(async ({ formData, index }) =>
          this.myRequest({
            url: '/api/admin/v1/task/chunks',
            method: 'post',
            data: formData,
            onProgress: this.createProgressHandler(chunkData[index], filelist, startIdx, chunkData),
            requestList: this.requestList
          })
        )
      return requestList
    },
    // xhr
    myRequest ({ url, method, data, headers = {}, onProgress = e => e, requestList }) {
      return new Promise(resolve => {
        const xhr = new XMLHttpRequest()
        xhr.upload.onprogress = onProgress
        xhr.open(method, url)
        Object.keys(headers).forEach(key =>
          xhr.setRequestHeader(key, headers[key])
        )
        xhr.send(data)
        xhr.onload = e => {
          // 将请求成功的 xhr 从列表中删除
          if (requestList) {
            const xhrIndex = requestList.findIndex(item => item === xhr)
            requestList.splice(xhrIndex, 1)
          }
          resolve({
            data: e.target.response
          })
        }
        // 暴露当前 xhr 给外部
        // requestList?.push(xhr)
      })
    },
    // 通知服务端合并切片
    async mergeRequest (id) {
      api.taskMergeFile({ id: id }).then(res => {
        if (res.data.code === 0) {
          this.$message.success('合并成功！')
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
          this.$message.error(error.response.data.message || '任务恢复出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
      })
    },
    // 用闭包保存每个 chunk 的进度数据
    createProgressHandler (item, filelist, startIdx, chunkData) {
      return e => {
        item.percentage = parseInt(String((e.loaded / e.total) * 100))

        const loaded = chunkData
          .map(item => item.size * item.percentage)
          .reduce((acc, cur) => acc + cur)
        const per = parseInt((loaded / filelist[startIdx].file.size).toFixed(2))
        filelist[startIdx].percentage = per > 100 ? 100 : per
      }
    },
    // 生成文件切片
    async createFileChunk (file, size = SIZE) {
      const fileChunkList = []
      let cur = 0
      while (cur < file.size) {
        fileChunkList.push({ file: file.slice(cur, cur + size) })
        cur += size
      }
      return fileChunkList
    },
    // 生成文件 hash（web-worker）
    calculateHash (fileChunkList, filelist, startIdx) {
      console.log('开始计算hash' + startIdx)
      return new Promise(resolve => {
        this.container.worker = new Worker('/static/hash.js')
        this.container.worker.postMessage({ fileChunkList })
        this.container.worker.onmessage = e => {
          const { percentage, hash } = e.data
          filelist[startIdx].percentageHash = parseInt(percentage)
          if (hash) {
            resolve(hash)
          }
        }
      })
    }
  }
}

const filecolumns = [
  {
    title: '文件名',
    dataIndex: 'file.name',
    key: 'name',
    width: '150px',
    ellipsis: true
  },
  {
    title: '大小',
    dataIndex: 'file.size',
    key: 'size'
  },
  {
    title: '类型',
    key: 'ext',
    dataIndex: 'ext'
  },
  {
    title: '文件路径',
    dataIndex: 'file.path',
    key: 'path',
    width: '150px',
    ellipsis: true
  },
  {
    title: 'hash进度',
    dataIndex: 'percentageHash',
    key: 'percentageHash'
  },
  {
    title: '上传进度',
    key: 'percentage',
    dataIndex: 'percentage'
  }
]

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
