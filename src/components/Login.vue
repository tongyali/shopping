<template>
  <div class="login_container">
    <div class="login_box">
      <div class="login_avatar">
        <img src="../assets/logo.png" alt="" />
      </div>
      <div class="login_form">
        <el-form ref="form" label-width="80px">
          <el-form-item label="活动名称">
            <el-input placeholder="请选择活动区域"></el-input>
          </el-form-item>
          <el-form-item label="活动名称">
            <el-input></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    onSubmit() {
      console.log("submit!");
    },
  },
};
</script>
<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
}
.login_avatar {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  box-shadow: 0 0 10px #bbb;
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}
</style>
