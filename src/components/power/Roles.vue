<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 角色列表 -->
      <el-button type="primary" @click="addRoles">添加角色</el-button>
      <template>
        <el-table :data="rolesList" stripe style="width: 100%" border>
          <!-- 展开项 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!-- {{ scope.row }} -->
              <el-row
                :gutter="20"
                v-for="(item1, id1) in scope.row.children"
                :key="item1.id"
                :class="['dbbottom', id1 === 0 ? 'dbtop' : '', 'vcenter']"
              >
                <!-- 一级权限 -->
                <el-col :span="5">
                  <el-tag closable @close="removeById(scope.row, item1.id)">
                    {{ item1.authName }}</el-tag
                  >
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二级和三级权限 -->
                <el-col :span="19">
                  <el-row
                    v-for="(item2, id2) in item1.children"
                    :key="item2.id"
                    :class="[id2 === 0 ? '' : 'dbtop', 'vcenter']"
                  >
                    <el-col :span="6">
                      <el-tag
                        type="success"
                        closable
                        @close="removeById(scope.row, item2.id)"
                      >
                        {{ item2.authName }}</el-tag
                      >
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag
                        type="warning"
                        v-for="(item3, id3) in item2.children"
                        :key="item3.id"
                        closable
                        @close="removeById(scope.row, item3.id)"
                        >{{ item3.authName }}</el-tag
                      >
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>

          <el-table-column label="#" type="index"> </el-table-column>
          <el-table-column prop="roleName" label="角色名"> </el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
          <el-table-column label="操作" width="300px">
            <template slot-scope="scope">
              <!-- <div>
              {{ scope.row }}
            </div> -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editRoles(scope.row.id)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteRoles(scope.row.id)"
                >删除</el-button
              >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetRightDialog(scope.row)"
                >分配权限</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>

    <!-- 添加角色 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="resetAddRoles"
    >
      <!-- 表单区域 -->
      <el-form
        :model="rolesForm"
        :rules="addRolesRules"
        ref="rolesFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="rolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="resetEditRoles"
    >
      <!-- 表单区域 -->
      <el-form
        :model="editForm"
        :rules="editRolesRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="resetSetRights"
    >
      <!-- 树形结构 -->
      <el-tree
        show-checkbox
        :data="rightsList"
        default-expand-all
        :props="treeProps"
        node-key="id"
        :default-checked-keys="keyDef"
        ref="treeRef"
      >
      </el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created() {
    this.getRolesList()
  },
  data() {
    return {
      rolesList: [],
      //添加角色
      addDialogVisible: false,
      rolesForm: { roleName: '', roleDesc: '' },
      addRolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 5,
            max: 15,
            message: '长度在 5 到 15 个字符',
            trigger: 'blur'
          }
        ]
      },
      //编辑
      editDialogVisible: false,
      editForm: {},
      editRolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 5,
            max: 15,
            message: '长度在 5 到 15 个字符',
            trigger: 'blur'
          }
        ]
      },
      //分配角色
      setRightDialogVisible: false,
      rightsList: [],
      //角色分配  树形结构
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      keyDef: [],
      roleId: ''
    }
  },
  methods: {
    //获取角色列表
    async getRolesList() {
      const ret = await this.$http.get('roles')
      // console.log(ret)
      if (ret.meta.status !== 200)
        return this.$message.error('获取角色列表失败')
      this.rolesList = ret.data
      this.$message.success('获取角色列表成功')
    },
    //添加角色
    addRoles() {
      this.addDialogVisible = true
    },
    resetAddRoles() {
      this.$refs.rolesFormRef.resetFields()
    },
    addDialogRoles() {
      this.$refs.rolesFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        const ret = await this.$http.post('roles', this.rolesForm)
        // console.log(ret)
        if (ret.meta.status !== 201) return this.$message.error('创建失败')
        this.$message.success('创建成功')
        this.addDialogVisible = false
        this.getRolesList()
      })
    },
    //编辑
    async editRoles(id) {
      this.editDialogVisible = true
      //根据id获取角色信息
      const ret = await this.$http.get('roles/' + id)
      console.log(ret)
      this.editForm = ret.data
    },
    //重置
    resetEditRoles() {
      this.$refs.editFormRef.resetFields()
    },
    editDialogRoles() {
      this.$refs.editFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        const ret = await this.$http.put('roles/' + this.editForm.roleId, {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc
        })
        // console.log(ret)
        if (ret.meta.status !== 200) return this.$message.error('获取失败')
        this.$message.success('获取成功')
        this.editDialogVisible = false
        this.getRolesList()
      })
    },
    //删除
    deleteRoles(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // console.log(id)
          const ret = await this.$http.delete('roles/' + id)
          // console.log(ret)
          if (ret.meta.status !== 200) return this.$message.error('删除失败')
          this.$message.success('删除成功!')
          this.getRolesList()
        })
        .catch(() => {
          this.$message.error('已取消删除')
        })
    },
    //删除三级权限
    removeById(role, id) {
      // console.log(id1, id2)
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const ret = await this.$http.delete(
            'roles/' + role.id + '/rights/' + id
          )
          // console.log(ret)
          if (ret.meta.status !== 200)
            return this.$message.error('删除权限失败')
          this.$message.success('删除成功!')
          //给角色更新权限
          role.children = ret.data
          // 直接调用this.getRolesList()函数会导致页面重新刷新
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //权限分配
    async showSetRightDialog(role) {
      //获取当前点击的id
      this.roleId = role.id
      //获取权限列表
      const ret = await this.$http.get('rights/tree')
      // console.log(ret)
      if (ret.meta.status !== 200)
        return this.$message.error('获取权限列表失败')
      this.rightsList = ret.data
      this.getLeafKeys(role, this.keyDef)
      // console.log(this.keyDef)

      this.setRightDialogVisible = true
    },
    //定义递归函数获取当前三级权限
    getLeafKeys(role, arr) {
      if (!role.children) {
        return arr.push(role.id)
      }
      role.children.forEach(item => this.getLeafKeys(item, arr))
    },
    //关闭对话框重置树形图
    resetSetRights() {
      this.keyDef = []
    },
    async setRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const keyStr = keys.join(',')
      // console.log(keys)
      const ret = await this.$http.post('roles/' + this.roleId + '/rights', {
        rids: keyStr
      })
      // console.log(ret)
      if (ret.meta.status !== 200) return this.$message.error('更新失败')
      this.setRightDialogVisible = false
      this.getRolesList()
      this.$message.success('更新成功')
    }
  }
}
</script>
<style lang="less" scoped>
.dbbottom {
  border-bottom: 1px solid #ddd;
}
.dbtop {
  border-top: 1px solid #ddd;
}
.el-tag {
  margin: 7px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
