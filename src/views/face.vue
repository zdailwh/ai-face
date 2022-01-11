<template>
  <div class="faceContainer">
    <!--搜索-->
    <div class="searchWrap" :style="smallLayout? 'flex-direction: column;': ''">
      <a-form-model ref="searchForm" :model="searchForm" layout="inline">
        <a-form-model-item label="人脸组" prop="groupId">
          <a-select v-model="searchForm.groupId" :dropdownMatchSelectWidth="false" style="width: 100px;">
            <a-select-option value="">全部</a-select-option>
            <a-select-option :value="item.id" v-for="item in groupsData" v-bind:key="item.id">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="人名" prop="name">
          <a-input v-model="searchForm.name" style="width: 120px;" />
        </a-form-model-item>
        <a-form-model-item label="创建时间" prop="createTime" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD">
          <a-range-picker :locale="locale" v-model="searchForm.createTime" style="width: 220px;" />
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="searchHandleOk"><a-icon key="search" type="search"/>搜索</a-button>
          <a-button style="margin-left: 10px;" @click="searchHandleReset('searchForm')">重置</a-button>
          <a-button style="margin-left: 10px;" type="primary" @click="addVisible = true"><a-icon key="plus" type="plus"/>创建人脸</a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
    <!--搜索 end-->
    <div class="tableWrap">
      <a-table :columns="columns" :data-source="datalist" :scroll="{ x: true }" rowKey="ID" :pagination="false">
        <span slot="gender" slot-scope="gender">
          {{!gender? '未知':(gender === 1)? '男': '女'}}
        </span>
        <span slot="features" slot-scope="text, record, index">
          <!-- <a-popover title="" v-for="(i,k) in features" :key="k">
            <template slot="content">
              <img class="tablePopImg" :src="i.fileuri" />
            </template>
            <img class="tableImg" :src="i.fileuri" />
          </a-popover> -->
          <Feature :face="record" @getfacelist="getFaces"></Feature>
        </span>
        <span slot="birthday" slot-scope="birthday">
          {{birthday | birthFormat}}
        </span>
        <span slot="create_time" slot-scope="create_time">
          {{create_time | dateFormat}}
        </span>
        <span slot="action" slot-scope="record, index, idx">
          <a @click="toEdit(record, idx)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定要删除该人脸吗?"
            ok-text="删除"
            cancel-text="取消"
            @confirm="delFace(record, idx)"
          >
            <a>删除</a>
          </a-popconfirm>
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
    <!--创建人脸-->
    <a-modal
      title="创建人脸"
      v-model="addVisible"
    >
      <div>
        <a-form-model :model="addForm" :label-col="{span:4}" :wrapper-col="{span:14}">
          <a-form-model-item label="人名">
            <a-input v-model="addForm.name" />
          </a-form-model-item>
          <a-form-model-item label="描述">
            <a-input v-model="addForm.description" />
          </a-form-model-item>
          <a-form-model-item label="性别">
            <a-radio-group name="gender" v-model="addForm.gender">
              <a-radio :value="1">男</a-radio><a-radio :value="2">女</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="生日">
            <a-date-picker :locale="locale" format="YYYY-MM-DD" v-model="addForm.birthday" />
          </a-form-model-item>
          <a-form-model-item label="别名">
          </a-form-model-item>
          <a-form-model-item label="履历">
          </a-form-model-item>
          <a-form-model-item label="人脸图">
            <a-upload
              list-type="picture-card"
              :multiple="true"
              :beforeUpload="beforeUpload_add"
              :file-list="fileList_add"
              :remove="handleRemove_add"
              @preview="cropperPicture"
              @change="handleChange_add"
            >
              <div v-if="fileList_add.length < imgMaxLength">
                <a-icon type="plus" />
                <div class="ant-upload-text">
                  上传图片
                </div>
              </div>
            </a-upload>
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
    <!--编辑人脸-->
    <a-modal
      title="编辑人脸"
      v-model="editVisible"
    >
      <div>
        <a-form-model :model="editForm" :label-col="{span:4}" :wrapper-col="{span:14}">
          <!-- <a-form-model-item label="人名">
            <a-input v-model="editForm.Name" />
          </a-form-model-item> -->
          <a-form-model-item label="描述">
            <a-input v-model="editForm.description" />
          </a-form-model-item>
          <a-form-model-item label="性别">
            <a-radio-group name="gender" v-model="editForm.gender">
              <a-radio :value="1">男</a-radio><a-radio :value="2">女</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="生日">
            <a-date-picker :locale="locale" format="YYYY-MM-DD" v-model="editForm.birthday" />
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
    <!--图片预览-->
    <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
    <!--裁剪人脸-->
    <a-modal
      title="裁剪人脸"
      width="800px"
      :footer="null"
      v-model="cropperVisible"
    >
      <CropperImage :Name="cropperName" :Uid="cropperUid" :file-obj="currImgFile" :show-use-img="true" @cropperImgSuccess="handleCropperSuccess" ref="child"></CropperImage>
    </a-modal>
  </div>
</template>
<script>
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
import api from '../api'
import CropperImage from '../components/Cropper.vue'
import Feature from '../components/Feature.vue'

var moment = require('moment')
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 50
  },
  {
    title: '人名',
    dataIndex: 'name',
    key: 'name',
    width: 100
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    width: 120
  },
  {
    title: '生日',
    dataIndex: 'birthday',
    key: 'birthday',
    scopedSlots: { customRender: 'birthday' },
    width: 100
  },
  {
    title: '性别',
    dataIndex: 'gender',
    key: 'gender',
    scopedSlots: { customRender: 'gender' },
    width: 60
  },
  {
    title: '别名',
    dataIndex: 'title',
    key: 'title',
    scopedSlots: { customRender: 'title' },
    width: 100
  },
  {
    title: '履历',
    dataIndex: 'history',
    key: 'history',
    scopedSlots: { customRender: 'history' },
    width: 100
  },
  {
    title: '人脸特征图',
    dataIndex: 'features',
    key: 'features',
    scopedSlots: { customRender: 'features' }
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
  beforeRouteEnter (to, from, next) {
    next()
  },
  components: { CropperImage, Feature },
  data () {
    return {
      locale,
      imgMaxLength: 5, // 最多上传5张人脸图
      smallLayout: false,
      spinning: false,
      datalist: [],
      dataTotal: 0,
      pageSizeOptions: ['10', '20', '30', '40', '50'],
      page_no: 1,
      page_size: 20,
      columns,
      addForm: {
        name: '',
        description: '',
        gender: '',
        birthday: '',
        files: []
      },
      addLoading: false,
      fileList_add: [],
      addVisible: false,
      searchForm: {
        name: '',
        groupId: '',
        createTime: []
      },
      editForm: {
        // name: '',
        // description: '',
        // gender: '',
        // birthday: ''
      },
      editLoading: false,
      editItem: {},
      editKey: '',
      editVisible: false,
      previewVisible: false,
      previewImage: '',
      cropperVisible: false,
      cropperUid: '',
      cropperName: '',
      cropperImgName: '',
      cropperImgVisible: false,
      currImgFile: {},
      groupsData: []
    }
  },
  filters: {
    birthFormat (val) {
      if (val === '' || val === null) return ''
      return moment(val).format('YYYY-MM-DD')
    },
    dateFormat (val) {
      if (val === '' || val === null) return ''
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  watch: {
    $route (newVal, oldVal) {
      if (newVal.query && newVal.query.groupId) {
        // 查询分组人脸列表
        this.searchForm.groupId = newVal.query.groupId
      }
    }
  },
  mounted () {
    if (this.$route.query && this.$route.query.groupId) {
      // 查询分组人脸列表
      this.searchForm.groupId = this.$route.query.groupId
    }

    var ele = document.querySelectorAll('.file-main')
    ele[0].style.backgroundColor = '#fff'

    var viewWidth = document.documentElement.clientWidth
    if (viewWidth < 540) {
      this.smallLayout = true
    }
    this.getAllGroups()
    this.getFaces()
  },
  methods: {
    onPageChange (current) {
      this.page_no = current
      this.getFaces()
    },
    onShowSizeChange (current, pageSize) {
      this.page_size = pageSize
      this.getFaces()
    },
    searchHandleOk () {
      this.page_no = 1
      this.getFaces()
    },
    searchHandleReset (formName) {
      this.$refs[formName].resetFields()
    },
    getFaces () {
      var params = {
        page_no: this.page_no,
        page_size: this.page_size
      }
      if (this.searchForm.name) {
        params.name = this.searchForm.name
      }
      if (this.searchForm.groupId) {
        params.groupId = this.searchForm.groupId
      }
      if (this.searchForm.createTime && this.searchForm.createTime.length === 2) {
        params.createTime = 'range_' + moment(this.searchForm.createTime[0]).format('YYYY-MM-DD') + ',' + moment(this.searchForm.createTime[1]).format('YYYY-MM-DD')
      }

      this.spinning = true
      if (params.groupId) {
        api.getGroupFaces(params).then(res => {
          if (res.data.code === 0) {
            this.datalist = res.data.data
            if (this.page_no === 1) {
              this.dataTotal = res.data.total
            }
            this.spinning = false
          } else {
            this.$message.error(res.data.message || '请求出错！')
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
      } else {
        api.getFaces(params).then(res => {
          if (res.data.code === 0) {
            this.datalist = res.data.data
            if (this.page_no === 1) {
              this.dataTotal = res.data.total
              this.$store.commit('setFaceTotal', res.data.total)
            }
            this.spinning = false
          } else {
            this.$message.error(res.data.message || '请求出错！')
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
      }
    },
    beforeUpload_add (file, fileList) {
      const isImg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      if (!isImg) {
        this.$message.error('请选择图片文件!')
        return false
      }
      // var arr = this.addForm.files || []
      // arr.push(file)
      // this.addForm.files = arr

      // var self = this
      // getBase64_(file, imageUrl => {
      //   self.addForm.faceBase64.push(imageUrl.substring(imageUrl.indexOf(',') + 1))
      // })
      return false
    },
    handleChange_add ({ fileList }) {
      fileList = fileList.slice(0, this.imgMaxLength)
      this.fileList_add = fileList
      this.addForm.files = fileList
    },
    handleRemove_add (file) {
      // this.addForm.files = []
    },
    handleCancel_add () {
      this.addVisible = false
      this.fileList_add = []
      this.addForm = {
        name: '',
        description: '',
        gender: '',
        birthday: '',
        files: []
      }
    },
    handleAdd (e) {
      if (this.addForm.name === '') {
        this.$message.error('请填写人名！')
        return
      }
      if (!this.addForm.files.length) {
        this.$message.error('请上传人脸图片！')
        return
      }
      var formdata = new FormData()
      var face = {
        name: this.addForm.name,
        description: this.addForm.description,
        gender: this.addForm.gender,
        birthday: this.addForm.birthday ? moment(this.addForm.birthday).format('YYYY-MM-DD') : ''
      }
      face = JSON.stringify(face)

      formdata.append('face', face)
      this.addForm.files.map((item, key, arr) => {
        formdata.append('file', item.originFileObj, item.originFileObj.name)
      })

      this.addLoading = true
      api.addFace(formdata).then(res => {
        if (res.data.code === 0) {
          this.page_no = 1
          this.getFaces()

          this.addVisible = false
          this.addLoading = false
          this.fileList_add = []
          this.addForm = {
            name: '',
            description: '',
            gender: '',
            birthday: '',
            files: []
          }
          this.$message.success('人脸创建成功')
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
    },
    handleCancel_edit () {
      this.editVisible = false
      this.editForm = {}
      this.editItem = {}
      this.editKey = ''
    },
    handleEdit () {
      var formdata = {
        id: this.editForm.id,
        description: this.editForm.description,
        gender: this.editForm.gender,
        birthday: this.editForm.birthday ? moment(this.editForm.birthday).format('YYYY-MM-DD') : ''
      }

      this.editLoading = true
      api.editFace(formdata).then(res => {
        if (res.data.code === 0) {
          this.page_no = 1
          this.getFaces()

          this.editVisible = false
          this.editLoading = false
          this.editForm = {}
          this.$message.success('人脸编辑成功')
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
    async handlePreview (file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    delFace (record, idx) {
      api.delFace({ id: record.id }).then(res => {
        if (res.data.code === 0) {
          this.getFaces()
          this.$message.success('人脸删除成功')
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
    cropperPicture (file) {
      console.log(file)
      this.cropperUid = file.uid
      this.cropperName = file.name
      this.currImgFile = file
      this.cropperVisible = true
    },
    handleCropperSuccess (data) {
      console.log(data)
      this.cropperVisible = false
      this.fileList_add.map(item => {
        if (item.uid === data.uid) {
          item.thumbUrl = data.url
          item.originFileObj = dataURLtoFile(data.url, data.name)
        }
      })
    },
    getAllGroups () {
      api.getGroups().then(res => {
        if (res.data.code === 0) {
          var groupArr = res.data.data
          this.groupsData = groupArr
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
    }
  }
}

function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

// 将base64转换为文件对象
function dataURLtoFile (dataurl, filename) {
  var arr = dataurl.split(',')
  var mime = arr[0].match(/:(.*?);/)[1]
  var bstr = atob(arr[1])
  var n = bstr.length
  var u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  // 转换成file对象
  return new File([u8arr], filename, { type: mime })
  // 转换成成blob对象
  // return new Blob([u8arr],{type:mime});
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
