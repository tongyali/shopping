<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8"
          ><el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getUsersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
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
                <el-switch
                  v-model="scope.row.mg_state"
                  @change="changeState(scope.row)"
                >
                </el-switch>
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
                  @click="editUesr(scope.row.id)"
                ></el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteUser(scope.row.id)"
                ></el-button>
                <el-tooltip
                  effect="dark"
                  content="角色分配"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    type="warning"
                    icon="el-icon-setting"
                    size="mini"
                  ></el-button>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 添加用户弹出窗 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="resetDialog"
      >
        <!-- 添加表单区域 -->
        <el-form
          :model="addForm"
          :rules="addUserRules"
          ref="addUserFormRef"
          label-width="70px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input> </el-form-item
          ><el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input> </el-form-item
          ><el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑用户 -->
      <el-dialog
        title="添加用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="restEdit"
      >
        <!-- 编辑表单区域 -->
        <el-form
          :model="editForm"
          :rules="editUserRules"
          ref="editUserFormRef"
          label-width="70px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input> </el-form-item
          ><el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getUsersList()
  },
  data() {
    //自定义校验规则
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (!regEmail.test(value)) {
        callback(new Error('请输入合法邮箱'))
      } else {
        return callback()
      }
    }
    const checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/
      if (!regMobile.test(value)) {
        callback(new Error('请输入合法手机号'))
      } else {
        return callback()
      }
    }

    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      total: 0,
      userList: [],
      //添加用户
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 5,
            message: '用户名长度在 3 到 5 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ],
        //自定义校验
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      //编辑用户
      editForm: {},
      editUserRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getUsersList() {
      const ret = await this.$http.get('users', { params: this.queryInfo })
      if (ret.meta.status !== 200) return this.$message.error('获取列表失败')
      this.total = ret.data.total
      this.userList = ret.data.users
    },
    //分页
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getUsersList()
    },
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getUsersList()
    },
    //改变状态
    async changeState(data) {
      const ret = await this.$http.put(
        `users/${data.id}/state/${data.mg_state}`
      )
      if (ret.meta.status !== 200) {
        data.mg_state = !data.mg_state
        return this.$message.error('更新状态失败')
      }
      this.$message.success('更新状态成功')
      this.getUsersList()
    },
    //添加用户弹出框
    resetDialog() {
      this.$refs.addUserFormRef.resetFields()
    },
    addUser() {
      this.$refs.addUserFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        const ret = await this.$http.post('users', this.addForm)
        // console.log(ret)
        if (ret.meta.status !== 201) {
          return this.$message.error('创建失败')
        }
        this.$message.success('创建成功')
        this.addDialogVisible = false
        this.getUsersList()
      })
    },

    //修改用户
    async editUesr(id) {
      this.editDialogVisible = true
      const ret = await this.$http.get('users/' + id)
      // console.log(ret)
      if (ret.meta.status !== 200) return this.$message.error('获取失败')
      this.editForm = ret.data
    },
    //重置
    restEdit() {
      this.$refs.editUserFormRef.resetFields()
    },
    //提交编辑
    editUser() {
      this.$refs.editUserFormRef.validate(async valid => {
        if (!valid) return
        const ret = await this.$http.put(`users/` + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (ret.meta.status !== 200) return this.$message.error('更新失败')
        this.editDialogVisible = false
        this.getUsersList()
        this.$message.success('更新成功')
      })
    },
    //删除
    deleteUser(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const ret = await this.$http.delete('users/' + id)
          // console.log(ret)
          if (ret.meta.status !== 200) return this.$message.error('删除失败')
          this.$message.success('删除成功')
          this.getUsersList()
          if (this.userList.length === 1) {
            this.userList.pagenum = this.pagenum - 1 ? this.pagenum - 1 : 1
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
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
