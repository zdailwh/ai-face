<template>
  <div class="settingWrap">
    <ul>
      <li><p class="title">ID：</p><p class="cont">{{ taskinfo.id }}</p></li>
      <li><p class="title">任务名称：</p><p class="cont">{{ taskinfo.name }}</p></li>
      <li><p class="title">任务描述：</p><p class="cont">{{ taskinfo.description }}</p></li>
      <li><p class="title">任务类型：</p><p class="cont">{{ taskinfo.type === 1? '文件': taskinfo.type === 2? '实时直播流': '' }}</p></li>
      <li><p class="title">文件路径：</p><p class="cont">{{ taskinfo.file_path }}</p></li>
      <li><p class="title">状态：</p><p class="cont">{{ taskinfo.status === 0? '初始化': taskinfo.status === 1? '排队中' : taskinfo.status === 2? '处理中' : '处理完成' }}</p></li>
      <li><p class="title">直播流地址：</p><p class="cont">{{ taskinfo.url }}</p></li>
      <li><p class="title">关联人脸组ID：</p><p class="cont">{{ taskinfo.group_id }}</p></li>
      <li><p class="title">关联人脸ID：</p><p class="cont">{{ taskinfo.faceIds }}</p></li>
      <li v-if="taskinfo.create_time"><p class="title">创建时间：</p><p class="cont">{{ taskinfo.create_time | dateFormat }}</p></li>
      <li v-if="taskinfo.update_time"><p class="title">更新时间：</p><p class="cont">{{ taskinfo.update_time | dateFormat }}</p></li>
    </ul>
  </div>
</template>
<script>
var moment = require('moment')
export default {
  props: [ 'taskinfo' ],
  data () {
    return {
    }
  },
  filters: {
    dateFormat (val) {
      if (val === '' || val === null) return ''
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  watch: {
    taskinfo (val, oldVal) {
    }
  }
}
</script>
<style scoped>
.settingWrap {
  padding: 0 10px;
}
.settingWrap li {
  display: flex;
  line-height: 35px;
}
.settingWrap .title {
  width: 100px;
  text-align: right;
  margin-right: 15px;
}
.settingWrap .cont {
  flex: 1;
  color: #fff;
}
</style>
