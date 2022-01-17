<template>
  <div class="faceWrap" :style="smalllayout? 'height: auto;': ''">
    <ul class="listWrap" v-if="taskresult">
      <template v-for="(fItem, second) in taskresult">
        <li class="list-item" :class="{ currBox: currBoxKey === second + '-' + k }" v-bind:key="second + '-' + k" v-for="(it, k) in fItem.items">
          <div class="img-box" @click="changeBox(fItem, second)">
            <img v-if="fItem.image" v-lazy="fItem.image" alt="人脸图">
            <img v-else src="../assets/user.png" alt="人脸图" style="width:32px;height:32px;">
          </div>
          <div class="desc-box">
            <div class="timeWrap">
              <a-popover :title="it.name" trigger="click">
                <template slot="content">
                  <template v-if="clickFace"></template>
                  <p>人名：{{clickFace.name}}</p>
                  <p>描述：{{clickFace.description}}</p>
                  <p>性别：{{!clickFace.gender? '未知':(clickFace.gender === 1)? '男': '女'}}</p>
                  <p>生日：{{clickFace.birthday}}</p>
                  <p>别名：{{clickFace.title}}</p>
                  <p>履历：{{clickFace.history}}</p>
                  <p><img class="tablePopImg" v-for="(i,k) in clickFace.features" :key="k" :src="i.fileuri" /></p>
                </template>
                <p><a href="javascript:;" @click="getFace(it.faceId)">{{it.name}}</a></p>
              </a-popover>
              <p>时间：{{ second | formateSeconds }}</p>

            </div>
          </div>
        </li>
      </template>
    </ul>
    <!-- <div v-else><p>还没有识别结果！</p></div> -->
  </div>
</template>
<script>
import api from '../api'
export default {
  props: [ 'taskresult', 'smalllayout' ],
  filters: {
    formateSeconds (second) {
      let secondTime = parseInt(second / 1000)
      // var haomiao = parseInt(second % 1000)
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
      result = `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${secondTime.toString().padStart(2, '0')}`
      return result
    }
  },
  data () {
    return {
      currBoxKey: 0,
      clickFace: {}
    }
  },
  watch: {
    taskresult (val, oldVal) {
      // if (val.length) {
      //   this.currBoxKey = 0
      //   var fItem = val[0]
      //   this.$emit('videofixed', { currentTime: fItem.time, item: fItem })
      // }
    }
  },
  methods: {
    changeBox (fItem, second) {
      this.$emit('videofixed', { currentTime: second, item: fItem })
      this.currBoxKey = second
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
  width: 220px;
  height: 130px;
  border: 1px solid #555;
  margin: 0 5px 10px;
  color: #ddd;
  display: flex;
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
  margin-top: 10px;
}
.operate-box {
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.desc-box .timeWrap {
  display: flex;
  margin: 8px 0;
  flex-direction: column;
}
.tablePopImg {
  max-width: 70px;
  max-height: 70px;
  margin-right: 5px;
}
</style>
