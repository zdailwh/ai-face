<template>
  <div class="faceContainer">
    <!--搜索-->
    <div class="searchWrap" :style="smallLayout? 'flex-direction: column;': ''">
      <a-form-model ref="searchForm" :model="searchForm" layout="inline">
        <a-form-model-item label="人名" prop="name">
          <a-input v-model="searchForm.name" />
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="searchHandleOk"><a-icon key="search" type="search"/>搜索</a-button>
          <a-button style="margin-left: 10px;" @click="searchHandleReset('searchForm')">重置</a-button>
        </a-form-model-item>
      </a-form-model>
      <div>
        <a-button type="primary" @click="addVisible = true"><a-icon key="plus" type="plus"/>创建人脸</a-button>
      </div>
    </div>
    <!--搜索 end-->
    <div class="tableWrap">
      <a-table :columns="columns" :data-source="datalist" :scroll="{ x: true }" rowKey="ID" :pagination="false">
        <span slot="gender" slot-scope="gender">
          {{!gender? '':(gender === '1' || gender === 1)? '男': '女'}}
        </span>
        <span slot="features" slot-scope="text, record, index">
          <!-- <a-popover title="" v-for="(i,k) in features" :key="k">
            <template slot="content">
              <img class="tablePopImg" :src="i.featureuri" />
            </template>
            <img class="tableImg" :src="i.featureuri" />
          </a-popover> -->
          <Feature :face="record"></Feature>
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
              <a-radio value="1">男</a-radio><a-radio value="2">女</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="生日">
            <a-date-picker :locale="locale" format="YYYY-MM-DD" v-model="addForm.birthday" />
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
              <a-radio value="1">男</a-radio><a-radio value="2">女</a-radio>
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
      <CropperImage :Name="cropperName" :file-obj="currImgFile" :show-use-img="true" @cropperImgSuccess="handleCropperSuccess" ref="child"></CropperImage>
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
      groupId: null,
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
        name: ''
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
      cropperName: '',
      cropperImgName: '',
      cropperImgVisible: false,
      currImgFile: {}
    }
  },
  filters: {
    dateFormat (val) {
      if (val === '') return ''
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  watch: {
    $route (newVal, oldVal) {
      if (newVal.query && newVal.query.groupId) {
        // 查询分组人脸列表
        this.groupId = newVal.query.groupId
      } else {
        this.groupId = null
      }
    }
  },
  mounted () {
    if (this.$route.query && this.$route.query.groupId) {
      // 查询分组人脸列表
      this.groupId = this.$route.query.groupId
    } else {
      this.groupId = null
    }

    var ele = document.querySelectorAll('.file-main')
    ele[0].style.backgroundColor = '#fff'

    var viewWidth = document.documentElement.clientWidth
    if (viewWidth < 540) {
      this.smallLayout = true
    }

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
      if (this.searchForm.name !== '') {
        this.getFaces({ name: this.searchForm.name })
      } else {
        this.getFaces()
      }
    },
    searchHandleReset (formName) {
      this.$refs[formName].resetFields()
    },
    getFaces (query) {
      var params = {
        page_no: this.page_no,
        page_size: this.page_size
      }
      if (query && query.name) {
        params.name = query.name
      }
      this.spinning = true
      if (this.groupId) {
        params.groupId = this.groupId
        api.getGroupFaces(params).then(res => {
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
            this.$message.error(error.response.data.message || '获取人脸库出错！')
          } else {
            this.$message.error('接口调用失败！')
          }
        })
      } else {
        api.getFaces(params).then(res => {
          if (res.status >= 200 && res.status < 300) {
            this.datalist = res.data.data
            if (this.page_no === 1) {
              this.dataTotal = res.data.total
              this.$store.commit('setFaceTotal', res.data.total)
            }
            this.spinning = false
          }
        }).catch(error => {
          this.spinning = false
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
      // var formdata = new FormData()
      // formdata.append('name', this.addForm.name)
      // formdata.append('description', this.addForm.description)
      // formdata.append('gender', this.addForm.gender)
      // formdata.append('birthday', this.addForm.birthday ? moment(this.addForm.birthday).format('YYYY-MM-DD') : '')
      // this.addForm.files.map((item, key, arr) => {
      //   formdata.append('files[]', item.originFileObj, item.originFileObj.name)
      // })

      var files = this.fileList_add.map((item, key, arr) => {
        return item.thumbUrl
      })
      var formdata = {
        name: this.addForm.name,
        description: this.addForm.description,
        gender: this.addForm.gender,
        birthday: this.addForm.birthday ? moment(this.addForm.birthday).format('YYYY-MM-DD') : '',
        files: files
      }

      this.addLoading = true
      api.addFace(formdata).then(res => {
        if (res.status >= 200 && res.status < 300) {
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
        }
      }).catch(error => {
        this.addLoading = false
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
        if (res.status >= 200 && res.status < 300) {
          this.page_no = 1
          this.getFaces()

          this.editVisible = false
          this.editLoading = false
          this.editForm = {}
          this.$message.success('人脸编辑成功')
        }
      }).catch(error => {
        this.editLoading = false
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
        if (res.status >= 200 && res.status < 300) {
          this.getFaces()
          this.$message.success('人脸删除成功')
        }
      }).catch(error => {
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '删除出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
      })
    },
    cropperPicture (file) {
      console.log(file)
      this.cropperName = file.uid
      this.currImgFile = file
      this.cropperVisible = true
    },
    handleCropperSuccess (data) {
      this.cropperVisible = false
      this.fileList_add.map(item => {
        if (item.uid === data.name) {
          item.thumbUrl = data.url
        }
      })
    }
  }
}

// function getBase64_ (img, callback) {
//   const reader = new FileReader()
//   reader.addEventListener('load', () => callback(reader.result))
//   reader.readAsDataURL(img)
// }
function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
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
