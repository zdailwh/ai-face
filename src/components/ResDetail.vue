<template>
  <div>
    <p class="resImgs">
      <img :src="resItem.image">
    </p>
  </div>
</template>
<script>
export default {
  props: [ 'resItem' ],
  data () {
    return {
    }
  },
  mounted () {
  }
}
</script>
<style scoped>
p {
  color: #989898;
  font-size: 14px;
}
p label {
  display: inline-block;
  text-align: right;
  width: 120px;
  color: #cecece;
  margin-right: 10px;
}
.resImgs {
  color: #cecece !important;
}
.resImgs img {
  border: 1px solid #ccc;
}
</style>
