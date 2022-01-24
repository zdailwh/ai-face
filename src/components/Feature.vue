<template>
  <div class="featuresOfFaceList">
    <template v-for="(item,k) in fileList">
      <div v-if="item.status === 1" :key="k" class="imgWrap">
        <div class="box borderGray">
          <img class="tablePopImg" :src="item.fileuri" @click="handlePreview(item)" />
          <div class="del">
            <a-icon type="delete" @click="delFeature(item)" />
          </div>
        </div>
      </div>
      <div v-else-if="item.status === 2" :key="k" class="imgWrap">
        <div class="box borderGreen">
          <img class="tablePopImg" :src="item.fileuri" @click="handlePreview(item)" />
          <div class="del">
            <a-icon type="delete" @click="delFeature(item)" />
          </div>
        </div>
      </div>
      <div v-else-if="item.status === 3" :key="k" class="imgWrap">
        <div class="box borderRed">
          <img class="tablePopImg" :src="item.fileuri" @click="handlePreview(item)" />
          <div class="del">
            <a-icon type="delete" @click="delFeature(item)" />
          </div>
        </div>
        <p class="errMsg">{{item.errorMessage}}</p>
      </div>
    </template>
    <div class="my-addimg" v-if="fileList.length < imgMaxLength" @click="cropperVisible = true">
      <a-icon type="plus" />
    </div>
    <!-- <a-upload
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
    </a-upload> -->
    <a-modal
      title="裁剪人脸"
      width="800px"
      :footer="null"
      v-model="cropperVisible"
    >
      <CropperImage :show-input-img="true" :show-upload-img="true" :cropper-visible="cropperVisible" @uploadCropperImg="handleAddFeature" ref="child"></CropperImage>
    </a-modal>
    <!--图片预览-->
    <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script>
import api from '../api'
import CropperImage from '../components/Cropper.vue'
export default {
  props: [ 'face' ],
  components: { CropperImage },
  data () {
    return {
      previewImage: '',
      previewVisible: false,
      imgMaxLength: 5, // 最多上传5张人脸图
      fileList: [
        {
          uid: '-1',
          name: 'image.png',
          status: 1,
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          fileuri: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        },
        {
          uid: '-2',
          name: 'image.png',
          status: 2,
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          fileuri: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        },
        {
          uid: '-2',
          name: 'image.png',
          status: 3,
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          fileuri: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        }
      ],
      cropperVisible: false,
      cropperUid: '',
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
            o.url = item.fileuri
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
    handleChange ({ file, fileList }) {
      fileList = fileList.slice(0, this.imgMaxLength)
      this.fileList = fileList
      if (file.status === 'done') {
        // 选完图片直接打开裁剪窗口
        this.cropperPicture(file)
      }
    },
    handleRemove (file) {
      this.delFeature(file)
    },
    cropperPicture (file) {
      if (!file.id) {
        this.cropperUid = file.uid
        this.cropperName = file.name
        this.currImgFile = file
        this.cropperVisible = true
      }
    },
    handleAddFeature (data) {
      console.log(data)
      if (!data.url) {
        this.$message.error('请上传人脸图片！')
        return
      }

      this.cropperVisible = false
      var originFileObj = dataURLtoFile(data.url, data.file.name)

      var formdata = new FormData()
      formdata.append('side', data.side)
      formdata.append('file', originFileObj, data.file.name)

      this.addLoading = true
      api.addFeature({ faceId: this.face.id, formdata: formdata }).then(res => {
        if (res.data.code === 0) {
          this.$emit('getfacelist')

          this.addFeatureVisible = false
          this.addLoading = false
          this.addFeatureForm = {
            faceId: '',
            file: ''
          }
          this.$message.success('人脸特征创建成功')
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
    delFeature (feature) {
      this.$confirm({
        content: '确定要删除该人像特征图吗？',
        okText: '继续删除',
        cancelText: '取消',
        onOk () {
          api.delFeature({ id: feature.id }).then(res => {
            if (res.data.code === 0) {
              this.$emit('getfacelist')
              this.$message.success('特征图删除成功')
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
        onCancel () {}
      })
    },
    async handlePreview (feature) {
      this.previewImage = feature.fileuri
      this.previewVisible = true
    }
  }
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

<style>
.featuresOfFaceList {
  display: flex;
}
.imgWrap {
}
.imgWrap .box {
  position: relative;
  padding: 4px;
  border-radius: 4px;
  width: 50px;
  height: 70px;
  margin-right: 2px;
}
.imgWrap .errMsg {
  white-space: normal;
  line-height: 13px;
  font-size: 12px;
}
.imgWrap:hover .del {
  display: block;
}
.imgWrap .del {
  display: none;
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 18px;
  height: 18px;
  text-align: center;
  line-height: 18px;
  background-color: rgba(0,0,0,.5);
}
.imgWrap .del .anticon {
  color: #fff;
  cursor: pointer;
  font-size: 14px;
}
.borderGray {
  border: 1px solid #d9d9d9;
}
.borderGreen {
  border: 1px solid #87d068;
}
.borderRed {
  border: 1px solid #f5222d;
}
.my-addimg {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 50px;
  height: 70px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  background-color: #fafafa;
  border-radius: 4px;
  cursor: pointer;
  font-size: 20px;
}
.tablePopImg {
  width: 40px;
  height: 60px;
  cursor: pointer;
}
</style>
