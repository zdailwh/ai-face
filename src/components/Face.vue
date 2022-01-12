<template>
  <div class="faceWrap" :style="smalllayout? 'height: auto;': ''">
    <ul class="listWrap" v-if="taskresult">
      <template v-for="(fItem, second) in taskresult">
        <li class="list-item" :class="{ currBox: currBoxKey === second + '-' + k }" v-bind:key="second + '-' + k" v-for="(it, k) in fItem.items" @click="changeBox(fItem, second)">
          <div class="img-box">
            <img v-if="fItem.image" v-lazy="fItem.image" alt="人脸图">
            <img v-else src="../assets/user.png" alt="人脸图" style="width:32px;height:32px;">
          </div>
          <div class="desc-box">
            <div class="timeWrap">
              <p>{{it.name}}</p>
              <p>得分：{{ `${it.score.toFixed(2)}`}}</p>
              <p>人脸ID：{{it.faceId}}</p>
            </div>
          </div>
        </li>
      </template>
    </ul>
    <!-- <div v-else><p>还没有识别结果！</p></div> -->
  </div>
</template>
<script>
export default {
  props: [ 'taskresult', 'smalllayout' ],
  data () {
    return {
      currBoxKey: 0
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
</style>
