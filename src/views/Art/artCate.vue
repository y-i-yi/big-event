<template>
  <div>
  <el-card class="box-card">
    <div slot="header" class="clearfix header-box">
      <span>文章分类</span>
      <el-button type="primary" size="mini" @click="addCateShowDialogBtnFn">添加分类</el-button>
    </div>
    <el-table :data="cateList" style="width: 100%">
      <el-table-column type="index" label="序号" width="180"></el-table-column>
      <el-table-column prop="cate_name" label="分类名称" width="180"></el-table-column>
      <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
      <el-table-column  label="操作">
        <template v-slot="scope">
          <!-- 使用具名插槽拿到行对象 -->
          <el-button type="primary" size="mini" @click="updateCateFn(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="delCateFn(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <!-- 点击添加分类按钮，出现对话框 ，visible.sync：是否显示 Dialog(.sync可以实现数据双向绑定）
    dialogFormVisible：控制对话框是否显示-->
  <el-dialog title="添加分类" :visible.sync="dialogFormVisible" @close="dialogCloseFn">
    <!-- 对话框中的表单 -->
    <el-form :model="addForm" :rules="addRules" ref="addRef">

      <el-form-item label="分类名称" :label-width="formLabelWidth" prop="cate_name">
        <el-input v-model="addForm.cate_name" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="分类别名" :label-width="formLabelWidth" prop="cate_alias">
        <el-input v-model="addForm.cate_alias" autocomplete="off"></el-input>
      </el-form-item>

    </el-form>

    <!-- 对话框中的按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="confirmFn">确 定</el-button>
    </div>

  </el-dialog>
</div>
</template>

<script>
import { getArtCateListAPI, addArtCateAPI, updateArtCateAPI, delArtCateAPI } from '@/api/index.js'
export default {
  data() {
    return {
      cateList: [], // 文章分类数组
      dialogFormVisible: false, // 控制对话框是否显示
      formLabelWidth: '120px',
      isEdit: false, // true为修改状态，false为新增状态
      editId: '', // 保存正在修改的文章分类的id
      addForm: { // 对话框表单的数据对象
        cate_name: '',
        cate_alias: ''
      },
      addRules: {
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '分类名称必须是1-10位的非空字符', trigger: 'blur' }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须是1-15位的字母数字', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getArtCatefn() // 获取-文章分类
  },
  methods: {
    // 获取-文章分类
    async getArtCatefn () {
      const { data: res } = await getArtCateListAPI()
      // console.log(res)
      this.cateList = res.data
    },
    // 对话框关闭时的回调
    dialogCloseFn () {
      this.$refs.addRef.resetFields()
    },
    // 新增文章分类的按钮点击事件
    addCateShowDialogBtnFn () {
      this.isEdit = false
      this.editId = ''
      this.dialogFormVisible = true // 对话框出现
    },
    // 点击对话框的确定-> 增加文章分类
    confirmFn() {
      this.$refs.addRef.validate(async valid => { // 表单的兜底校验
        if (valid) {
          // 通过校验
          if (this.isEdit) { // 此次确定是修改文章分类
            this.addForm.id = this.editId
            const { data: res } = await updateArtCateAPI(this.addForm)
            // console.log(res)
            if (res.code !== 0) return this.$message.error(res.message)
            this.$message.success(res.message)
          } else {
            // 此次是新增文章分类
            const { data: res } = await addArtCateAPI(this.addForm) // 增加文章分类
            // console.log(res)
            if (res.code !== 0) return this.$message.error(res.message)
            this.$message.success(res.message)
            // 生命周期的方法不会挂载到this上
          }
          this.getArtCatefn() // 重新获取-文章分类，让表格更新
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    },
    // 修改分类按钮的点击事件
    updateCateFn (obj) {
      // console.log(obj) obj包含cate_name cate_alias id
      this.isEdit = true
      this.editId = obj.id
      this.dialogFormVisible = true // 弹框出现
      // 让el-dialog第一次挂载el-form时，先用addForm空字符串初始值绑到内部，后续用作resetFields重置
      this.$nextTick(() => {
        // 数据回显
        this.addForm.cate_name = obj.cate_name
        this.addForm.cate_alias = obj.cate_alias
      })
    },
    // 删除按钮的点击事件
    async delCateFn (obj) {
      const { data: res } = await delArtCateAPI(obj.id)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.getArtCatefn() // 重新获取-文章分类，让表格更新
    }
  }
}
</script>
<style>
  .header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>