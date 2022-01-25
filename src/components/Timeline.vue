<template>
  <div class="faceWrap" :style="smalllayout? 'height: auto;': ''">
    <ul class="listWrap" v-infinite-scroll="handleInfiniteOnLoad" :infinite-scroll-disabled="busy" :infinite-scroll-distance="10">
      <template v-for="(fItem, second) in slicedTaskresult">
        <li :key="second" :id="'point_' + second"></li>
        <li class="list-item" v-if="fItem" :class="{ currBox: currBoxKey === second + '-' + k }" v-bind:key="second + '-' + k" v-for="(it, k) in fItem.items">
          <div class="img-box" @click="changeBox(fItem, second, k)">
            <img v-if="fItem.thumbs" v-lazy="`/api/admin/v1/getResultImage?filepath=${fItem.thumbs}`" alt="人脸图">
            <img v-else src="../assets/user.png" alt="人脸图" style="width:32px;height:32px;">
          </div>
          <div class="desc-box">
            <div class="timeWrap">
              <a-popover :title="it.name" trigger="click" arrow-point-at-center>
                <template slot="content">
                  <template v-if="clickFace">
                    <p>人名：{{clickFace.name}}</p>
                    <p>描述：{{clickFace.description}}</p>
                    <p>性别：{{!clickFace.gender? '未知':(clickFace.gender === 1)? '男': '女'}}</p>
                    <p>生日：{{clickFace.birthday}}</p>
                    <p>别名：{{clickFace.title}}</p>
                    <p>履历：{{clickFace.history}}</p>
                    <p><img class="tablePopImg" v-for="(i,k) in clickFace.features" :key="k" :src="i.fileuri" /></p>
                  </template>
                </template>
                <p><a href="javascript:;" @click="getFace(it.faceId)">{{it.name}}</a></p>
              </a-popover>
              <p>{{ second | formateSeconds }}</p>

            </div>
          </div>
        </li>
      </template>
      <div v-if="loading && !busy" class="loading-container">
        <a-spin />
      </div>
    </ul>
    <!-- <div v-else><p>还没有识别结果！</p></div> -->
  </div>
</template>
<script>
import infiniteScroll from 'vue-infinite-scroll'
import api from '../api'
export default {
  directives: { infiniteScroll },
  props: [ 'taskresult', 'smalllayout' ],
  filters: {
    formateSeconds (second) {
      let secondTime = parseInt(second / 1000)
      var haomiao = parseInt(second % 1000)
      let min = 0 // 初始化分
      let h = 0 // 初始化小时
      let result = ''
      if (secondTime >= 60) { // 如果秒数大于60，将秒数转换成整数
        min = parseInt(secondTime / 60) // 获取分钟，除以60取整数，得到整数分钟
        secondTime = parseInt(secondTime % 60) // 获取秒数，秒数取佘，得到整数秒数
        if (min >= 60) { // 如果分钟大于60，将分钟转换成小时
          h = parseInt(min / 60) // 获取小时，获取分钟除以60，得到整数小时
          min = parseInt(min % 60) // 获取小时后取佘的分，获取分钟除以60取佘的分
        }
      }
      result = `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${secondTime.toString().padStart(2, '0')}.${haomiao}`
      return result
    }
  },
  data () {
    return {
      currBoxKey: 0,
      clickFace: {},
      slicedTaskresult: {},
      loading: false,
      busy: false,
      limit: 100,
      page: 0,
      offset: 0
    }
  },
  watch: {
    taskresult (val, oldVal) {
      this.loading = true
      var sliceKeys = Object.keys(this.taskresult).slice(this.page * this.limit + this.offset, this.page * this.limit + this.limit + this.offset)
      var sliceRes = {}
      for (var i = 0; i < this.limit; i++) {
        if (sliceKeys[i]) {
          var k = sliceKeys[i] + ''
          sliceRes[k] = this.taskresult[k]
        }
      }
      this.slicedTaskresult = {...this.slicedTaskresult, ...sliceRes}

      this.loading = false
      this.page++
    }
  },
  mounted () {
  },
  methods: {
    timelineFix (hm) {
      this.slicedTaskresult = {}
      this.page = 0
      this.offset = Object.keys(this.taskresult).indexOf(hm + '')

      this.loading = true
      var sliceKeys = Object.keys(this.taskresult).slice(this.page * this.limit + this.offset, this.page * this.limit + this.limit + this.offset)
      var sliceRes = {}
      for (var i = 0; i < this.limit; i++) {
        if (sliceKeys[i]) {
          var k = sliceKeys[i] + ''
          sliceRes[k] = this.taskresult[k]
        }
      }
      this.slicedTaskresult = {...this.slicedTaskresult, ...sliceRes}

      this.loading = false
      this.page++
    },
    changeBox (fItem, second, k) {
      this.$emit('videofixed', { currentTime: second, item: fItem })
      this.currBoxKey = second + '-' + k
    },
    getFace (faceId) {
      this.spinning = true
      api.getFace({ id: faceId }).then(res => {
        this.spinning = false
        var resBody = res.data
        if (resBody.code === 0) {
          this.clickFace = resBody.data
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
    handleInfiniteOnLoad () {
      this.loading = true
      if (Object.keys(this.slicedTaskresult).length >= Object.keys(this.taskresult).length) {
        this.$message.warning('没有更多数据了~')
        this.busy = true
        this.loading = false
        return
      }

      var sliceKeys = Object.keys(this.taskresult).slice(this.page * this.limit + this.offset, this.page * this.limit + this.limit + this.offset)
      var sliceRes = {}
      for (var i = 0; i < this.limit; i++) {
        if (sliceKeys[i]) {
          var k = sliceKeys[i] + ''
          sliceRes[k] = this.taskresult[k]
        }
      }
      this.slicedTaskresult = {...this.slicedTaskresult, ...sliceRes}

      this.loading = false
      this.page++
    }
  }
}
</script>
<style scoped>
.faceWrap {
  height: calc(100vh - 180px);
  overflow-y: scroll;
  padding: 0 10px;
}
.listWrap {
  display: flex;
  flex-wrap: wrap;
}
.list-item {
  /*width: 220px;
  height: 130px;*/
  border: 1px solid #555;
  margin: 0 2px 5px;
  color: #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}
.list-item.currBox {
  box-shadow: 0 0 10px 0 rgba(255,255,255,.7);
}
.list-item .img-box {
  width: 100px;
  position: relative;
  text-align: center;
  margin: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.list-item .img-box img {
  max-width: 100px;
  max-height: 120px;
  border: 0;
}
.list-item .img-box p {
  line-height: 50px;
}
.desc-box {
  flex: 1;
}
.operate-box {
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.desc-box .timeWrap {
  display: flex;
  flex-direction: column;
}
.tablePopImg {
  max-width: 70px;
  max-height: 70px;
  margin-right: 5px;
}
.loading-container {
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
}
</style>
