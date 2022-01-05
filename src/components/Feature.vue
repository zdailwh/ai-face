<template>
  <div class="featuresOfFaceList">
    <a-upload
      v-if="fileList.length"
      list-type="picture-card"
      :multiple="false"
      :beforeUpload="beforeUpload"
      :file-list="fileList"
      :remove="handleRemove"
      @preview="cropperPicture"
      @change="handleChange"
    >
      <div v-if="fileList.length < imgMaxLength">
        <a-icon type="plus" />
        <div class="ant-upload-text">
          上传图片
        </div>
      </div>
    </a-upload>
    <a-modal
      title="裁剪人脸"
      width="800px"
      :footer="null"
      v-model="cropperVisible"
    >
      <CropperImage :Name="cropperName" :file-obj="currImgFile" :show-upload-img="true" @uploadCropperImg="handleAddFeature" ref="child"></CropperImage>
    </a-modal>
  </div>
  <!-- <div class="clearfix">
    <span class="ant-upload-picture-card-wrapper">
      <div class="ant-upload-list ant-upload-list-picture-card">
        <div class="ant-upload-list-picture-card-container">
          <span>
            <div class="ant-upload-list-item ant-upload-list-item-done ant-upload-list-item-list-type-picture-card">
              <div class="ant-upload-list-item-info">
                <a href="" target="_blank" rel="noopener noreferrer" class="ant-upload-list-item-thumbnail">
                  <img src="../assets/u1.png" alt="image.png" class="ant-upload-list-item-image">
                </a>
              </div>
              <span class="ant-upload-list-item-actions">
                <a-icon type="eye" :style="{ color: '#fff' }" />
                <a-popconfirm
                  title="确定要删除该特征图吗?"
                  ok-text="删除"
                  cancel-text="取消"
                  @confirm="delFeature(123)"
                >
                  <a-icon type="delete" :style="{ color: '#fff' }" />
                </a-popconfirm>
              </span>
            </div>
          </span>
        </div>
      </div>
      <div class="ant-upload ant-upload-select ant-upload-select-picture-card">
        <span role="button" tabindex="0" class="ant-upload">
          <input type="file" accept="" style="display: none;">
          <div>
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </span>
      </div>
    </span>
  </div> -->
</template>
<script>
import api from '../api'
import CropperImage from '../components/Cropper.vue'
export default {
  props: [ 'face' ],
  components: { CropperImage },
  data () {
    return {
      imgMaxLength: 5, // 最多上传5张人脸图
      fileList: [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        },
        {
          uid: '-2',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        }
      ],
      cropperVisible: false,
      cropperName: '',
      cropperImgName: '',
      cropperImgVisible: false,
      currImgFile: {},
      addFeatureForm: {
        faceId: '',
        file: ''
      }
    }
  },
  watch: {
    face: {
      handler (val, oldVal) {
        if (val.features) {
          this.fileList = val.features.map(item => {
            var o = item
            o.uid = item.id
            o.url = item.featureuri
            return o
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    beforeUpload (file, fileList) {
      const isImg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      if (!isImg) {
        this.$message.error('请选择图片文件!')
        return false
      }
      return false
    },
    handleChange ({ fileList }) {
      fileList = fileList.slice(0, this.imgMaxLength)
      this.fileList = fileList
    },
    handleRemove (file) {
      this.delFeature(file)
    },
    cropperPicture (file) {
      if (!file.id) {
        this.cropperName = file.uid
        this.currImgFile = file
        this.cropperVisible = true
      }
    },
    handleAddFeature (data) {
      this.cropperVisible = false
      this.fileList.map(item => {
        if (item.uid === data.name) {
          item.thumbUrl = data.url
        }
      })

      if (!data.url) {
        this.$message.error('请上传人脸图片！')
        return
      }
      var formdata = {
        faceId: this.face.id,
        file: data.url
      }

      this.addLoading = true
      api.addFeature(formdata).then(res => {
        if (res.status >= 200 && res.status < 300) {
          // this.getFaces()

          this.addFeatureVisible = false
          this.addLoading = false
          this.addFeatureForm = {
            faceId: '',
            file: ''
          }
          this.$message.success('人脸特征创建成功')
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
    delFeature (feature) {
      api.delFeature({ id: feature.id }).then(res => {
        if (res.status >= 200 && res.status < 300) {
          // this.getFaces()
          this.$message.success('特征图删除成功')
        }
      }).catch(error => {
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '删除出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
      })
    }
  }
}
</script>

<style>
.featuresOfFaceList .ant-upload-list-picture-card-container {
  width: 70px;
  height: 70px;
}
.featuresOfFaceList .ant-upload-list-picture-card .ant-upload-list-item {
  width: 70px;
  height: 70px;
  padding: 0;
  border: none;
}
.featuresOfFaceList .ant-upload.ant-upload-select-picture-card {
  width: 70px;
  height: 70px;
}
</style>
