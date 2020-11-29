<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 列表区域 -->
    <el-card>
      <template>
        <el-table :data="rightsList" stripe style="width: 100%" border>
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column prop="authName" label="权限名称"> </el-table-column>
          <el-table-column prop="path" label="路径"> </el-table-column>
          <el-table-column prop="level" label="权限等级">
            <template slot-scope="scope">
              <!-- 权限 -->
              <el-tag v-if="scope.row.level == 0">一级</el-tag>
              <el-tag type="success" v-else-if="scope.row.level == 1"
                >二级</el-tag
              >
              <el-tag type="warning" v-else>三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getRightsList()
  },
  data() {
    return {
      rightsList: []
    }
  },
  methods: {
    //获取权限列表
    async getRightsList() {
      const ret = await this.$http.get('rights/list')
      // console.log(ret)
      if (ret.meta.status !== 200) return this.$message.error('获取列表失败')
      this.rightsList = ret.data
    }
  }
}
</script>
<style lang="less" scoped>
.el-table {
  /deep/td,
  /deep/th {
    text-align: center;
  }
}
</style>
