<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8"
          ><el-input placeholder="请输入内容" class="input-with-select">
            <el-button
              slot="append"
              icon="el-icon-search"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4"
          ><el-button type="primary">添加用户</el-button></el-col
        >
      </el-row>
      <!-- 表格区域 -->
      <template>
        <el-table :data="userList" stripe style="width: 100%" border>
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column prop="username" label="姓名"> </el-table-column>
          <el-table-column prop="email" label="邮箱"> </el-table-column>
          <el-table-column prop="mobile" label="电话"> </el-table-column>
          <el-table-column prop="role_name" label="角色"> </el-table-column>
          <el-table-column prop="mg_state" label="状态">
            <!-- 作用域插槽 -->
            <template slot-scope="scope">
              <div>
                <!-- {{ scope.row }} -->
                <el-switch v-model="scope.row.mg_state"> </el-switch>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" width="180px">
            <template slot-scope="scope">
              <div>
                <!-- {{ scope.row }} -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                ></el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                ></el-button>
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="mini"
                ></el-button>
              </div>
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
    this.getUsersList()
  },
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      total: 0,
      userList: []
    }
  },
  methods: {
    async getUsersList() {
      const ret = await this.$http.get('users', { params: this.queryInfo })
      if (ret.meta.status !== 200) return this.$message.error('获取列表失败')
      this.total = ret.data.total
      this.userList = ret.data.users
    }
  }
}
</script>
<style lang="less" scoped>
.el-table {
  /deep/ th {
    text-align: center;
  }
}
</style>
