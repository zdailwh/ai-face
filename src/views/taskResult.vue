<template>
  <div class="videoWrap" :style="smallLayout? 'display: block;': ''">
    <div class="d-left" :style="smallLayout? 'width: 100%;height: auto;': ''">
      <div class="media-wrapper">
        <div class="media-player">
          <div class="playwrap">
            <video src="" video width="100%" height="100%" controls="controls" id="myvideo"></video>
            <a-button-group size="small">
              <a-button @click="bofang()">开始播放</a-button>
              <a-button @click="zanting()">暂停播放</a-button>
              <a-button @click="kuaijin()">快进播放</a-button>
              <a-button @click="kuaitui()">快退播放</a-button>
              <a-button @click="soso()">加速播放</a-button>

              <a-button @click="yu()">减速播放</a-button>
              <a-button @click="normal()">正常播放</a-button>
              <a-button @click="upper()">声音增加</a-button>
              <a-button @click="lower()">声音减小</a-button>
            </a-button-group>
            <!-- <div id="tcplayer"></div> -->
          </div>
        </div>
        <div v-if="taskResItem" class="locationDetailWrap">
          <h4>人脸详情</h4>
          <div class="locDetail" :class="smallLayout? 'inlineDetail': ''">
            <ResDetail :res-item="taskResItem" />
          </div>
        </div>
      </div>
    </div>
    <div class="d-right" :style="smallLayout? 'width: 100%;height: auto;': ''">
      <a-tabs default-active-key="1" size="small" @change="tabChange">
        <a-tab-pane key="1" :tab="'任务结果'">
          <Timeline :taskresult="resTimeFaces" :smalllayout="smallLayout" @videofixed="videoFixed" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="按人像查看">
          <!-- <div class="searchWrap_video">
            <a-form-model ref="searchForm" :model="searchForm" layout="inline">
              <a-form-model-item label="人脸">
                <a-input v-model="searchForm.name" placeholder="姓名" allow-clear style="width: 110px;" />
              </a-form-model-item>
              <a-form-model-item>
                <a-button type="primary" ghost @click="searchHandleOk">搜索</a-button>
              </a-form-model-item>
            </a-form-model>
          </div> -->
          <Face :taskresult="resFaces" :smalllayout="smallLayout" @videofixed="videoFixed" />
        </a-tab-pane>
        <a-tab-pane key="3" tab="任务基本信息">
          <Setting :taskinfo="task"/>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
import api from '../api'
import { TcPlayer } from 'tcplayer'
import Setting from '../components/Setting'
import Face from '../components/Face'
import Timeline from '../components/Timeline'
import ResDetail from '../components/ResDetail'

var timer = null
export default {
  beforeRouteEnter (to, from, next) {
    next()
  },
  beforeRouteLeave (to, from, next) {
    this.continueCircle = false
    window.clearTimeout(timer)
    next()
  },
  components: { Setting, Timeline, Face, ResDetail },
  data () {
    return {
      smallLayout: false,
      page_no: 1,
      page_size: 500,
      resTimeFaces: {},
      resFaces: {},
      filtedResDatalist: {},
      task: {},
      taskId: '',
      taskResItem: {},
      searchForm: {
        name: ''
      },
      resDataTotal: '',
      continueCircle: true // 是否继续轮循
    }
  },
  mounted () {
    var viewWidth = document.documentElement.clientWidth
    if (viewWidth < 768) {
      this.smallLayout = true
    }
    var ele = document.querySelectorAll('.file-main')
    if (ele.length) {
      ele[0].style.backgroundColor = '#171819'
    }

    this.taskId = this.$route.params.taskId
    if (this.taskId) {
      this.getPlayurl(this.taskId)
      this.getTaskResults(this.taskId)
    }
  },
  methods: {
    getPlayurl (tid) {
      var params = {
        id: tid
      }
      api.getTasksById(params).then(res => {
        var resBody = res.data
        if (resBody.code === 0) {
          this.task = resBody.data
          if (this.task && this.task.file_path && this.task.file_path !== 'undefined') {
            document.getElementById('myvideo').setAttribute('src', '/resource/' + this.task.file_path)
            // this.createPlayer()
          }
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
          this.$message.error(error.response.data.message || '获取任务详情出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
      })
    },
    getTaskResults (tid) {
      var params = {
        id: tid,
        page_no: this.page_no,
        page_size: this.page_size
      }
      api.getTaskResults(params).then(res => {
        var resBody = res.data
        if (resBody.code === 0) {
          this.resTimeFaces = resBody.data.timefaces
          // this.resDataTotal = resBody.data.timefaces.length
          this.resFaces = resBody.data.faces
          this.page_no += 1
          this.filtedResDatalist = this.resFaces

          // var that = this
          // window.clearTimeout(timer)
          // if (this.continueCircle && resBody.data.length === this.page_size) {
          //   timer = window.setTimeout(function () {
          //     that.getTaskResults(tid)
          //   }, 0)
          // }
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
          this.$message.error(error.response.data.message || '获取任务结果出错！')
        } else {
          this.$message.error('接口调用失败！')
        }
      })
    },
    tabChange (key) {
    },
    createPlayer () {
      // var url = 'http://ai.evereasycom.cn:15280/face_reco_web/userData/test_user2/videoAsset/1638182188388.mp4'
      var url = this.task.file_path
      document.querySelector('#tcplayer').innerHTML = ''
      var player = new TcPlayer('tcplayer', {
        mp4: url,
        autoplay: true,
        width: '100%',
        height: 'auto',
        wording: {
          1001: '网络错误，请检查网络配置或者播放链接是否正确',
          1002: '获取视频失败，请检查播放链接是否有效',
          2032: '获取视频失败，请检查播放链接是否有效',
          2048: '无法加载视频文件，跨域访问被拒绝'
        },
        listener: function (msg) {
          // console.log('listener:', msg)
          // if (msg.type === 'play') {
          //   self.videoPlay()
          // }
          // if (msg.type === 'loadeddata') {
          //   player.play()
          // }
        }
      })
      window.player = player
    },
    searchHandleOk () {
      var filterName = this.searchForm.name
      if (filterName === '') {
        // this.filtedResDatalist = this.resTimeFaces
        this.continueCircle = true
        this.getTaskResults(this.taskId)
      } else {
        this.continueCircle = false
        window.clearTimeout(timer)
        var arr = this.resTimeFaces
        arr = arr.filter((item, val, array) => {
          if (item.face_name && item.face_name === filterName) {
            return true
          } else {
            return false
          }
        })
        this.filtedResDatalist = arr
      }
    },
    videoFixed (params) {
      this.taskResItem = params.item
      var fixSecond = params.currentTime || params.timepos
      document.getElementById('myvideo').currentTime = fixSecond / 1000
    },
    bofang () {
      document.getElementById('myvideo').play()
    },
    // 暂停
    zanting () {
      document.getElementById('myvideo').pause()
    },
    // 快进
    kuaijin () {
      document.getElementById('myvideo').currentTime += 10
    },
    // 快退
    kuaitui () {
      document.getElementById('myvideo').currentTime -= 10
    },
    // 加速(3)
    soso () {
      document.getElementById('myvideo').playbackRate = 3
    },
    // 减速（3）
    yu () {
      document.getElementById('myvideo').playbackRate = 1 / 3
    },
    normal () {
      document.getElementById('myvideo').playbackRate = 1
    },
    // 调高声音
    upper () {
      document.getElementById('myvideo').volume += 0.3
    },
    // 降低声音
    lower () {
      document.getElementById('myvideo').volume -= 0.3
    }
  }
}
</script>
<style scoped>
.videoWrap {
  display: flex;
  height: 100%;
}
.d-left {
  width: 50%;
  height: 100%;
}
.d-right {
  width: 50%;
  height: 100%;
  overflow-y: hidden;
}
.media-wrapper {
  width: 100%;
  z-index: 1000;
  box-sizing: border-box;
}
.media-wrapper .media-player {
  text-align: center;
  width: 100%;
  position: relative;
}
.playwrap {
  padding: 0 5px;
  height: 50%;
}

.cut_catalog_dropdown {
  position: absolute;
  right: 5px;
  bottom: -153px;
  width: 210px;
  height: 153px;
  z-index: 1000;
  border-radius: 4px;
  background: #2d2f31;
  box-shadow: 0 0 1px 0 rgba(10, 31, 68, 0.08), 0 8px 10px 0 rgba(10, 31, 68, 0.1);
}
.cut_catalog_dropdown .cut_catalog_list {
  padding: 10px;
}
.cut_catalog_dropdown .cut_catalog_list li.cut_catalog_item:first-child {
  margin-top: 0;
}
.cut_catalog_dropdown .cut_catalog_list li.cut_catalog_item {
  height: 24px;
  margin: 10px 0;
}
.cut_catalog_dropdown .cut_catalog_list li.cut_catalog_item span.title {
  width: 78px;
  font-size: 12px;
  color: #acb0b7;
  text-align: right;
  padding-right: 10px;
}
.cut_catalog_dropdown .cut_catalog_list li.cut_catalog_item input {
  width: 100px;
  font-size: 12px;
}
input[type="text"], textarea {
  -webkit-appearance: none;
}
.cut_catalog_dropdown .cut_catalog_list li.cut_catalog_item span.title, .cut_catalog_dropdown .cut_catalog_list li.cut_catalog_item input {
  height: 24px;
  line-height: 24px;
  float: left;
}
.cut_catalog_dropdown .cut_catalog_list li.cut_catalog_item .anticon-close {
  position: absolute;
  top: 2px;
  right: 2px;
  color: #a5aab3;
  cursor: pointer;
  font-size: 13px;
  background: #3c3c3c;
  border-radius: 50%;
}
.cut_catalog_dropdown .cut_catalog_list li.cut_catalog_item .btn {
  display: inline-block;
  width: 78px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  background-color: #3c3c3c;
  border-radius: 4px;
  color: #fff;
  margin: 0 5px;
  font-size: 12px;
  cursor: pointer;
}
.cut_catalog_dropdown .cut_catalog_list li.cut_catalog_item .btn.btn_ok {
  background-color: #2a92fe;
}
.searchWrap_video {
  margin-bottom: 15px;
}

.locationDetailWrap {
  margin: 0 20px 20px;
}
.locationDetailWrap h4 {
  font-size: 16px;
  color: #fff;
  font-weight: bold;
  margin: 10px 0;
}
.locationDetailWrap .locDetail p {
  color: #989898;
  font-size: 14px;
}
.locationDetailWrap .locDetail p label {
  display: inline-block;
  text-align: right;
  width: 120px;
  color: #cecece;
  margin-right: 10px;
}
.locationDetailWrap .locDetail.inlineDetail {
  display: flex;
  flex-wrap: wrap;
}
</style>
