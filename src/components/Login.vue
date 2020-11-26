<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="活动名称">
          <el-input v-model="form.name"></el-input>
          </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {

}
</script>
<style lang="less" scoped>
.login_container{
  background-color: #2b4b6b;
  height: 100%;
}
.login_box{
  position: absolute;
  top:50%;
  left:50%;
  transform: translate(-50%,-50%);
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
}
.avatar_box{
  position: absolute;
  left: 50%;
  transform: translate(-50%,-50%);
  padding: 10px;
  height: 130px;
  width: 130px;
  border:1px solid #eee;
  border-radius: 50%;
  box-shadow:0 0 10px #ddd ;
  background-color: #fff;

  img{
    height: 100%;
    width: 100%;
    background-color: #eee;
    border-radius: 50%;
  }
}
</style>
