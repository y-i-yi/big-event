<template>
  <div>
    <!-- 内容 -->
    <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>文章列表</span>
    </div>

    <div class="search-box">
    <el-form :inline="true" :model="q" :rules="qRules">
      <el-form-item label="文章分类" prop="cate_id">
        <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
          <el-option  v-for="obj in cateList" :key="obj.id" :label="obj.cate_name" :value="obj.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布状态" style="margin-left: 15px;" prop="state">
        <el-select v-model="q.state" placeholder="请选择状态" size="small">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="choseFn">筛选</el-button>
        <el-button type="info" size="small" @click="resetFn">重置</el-button>
           <!-- 发布文章按钮 -->
        <el-button type="primary" size="small" class="btn-pub" @click="showPubDialogFn">发布文章</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!-- 文章表格区 -->
  <el-table :data="artList" style="width: 100%" border stripe>

    <el-table-column label="文章标题" prop="title">
      <template v-slot="scope">
         <el-link type="primary" @click="showDetailFn(scope.row.id)">{{ scope.row.title }}</el-link>
      </template>
    </el-table-column>

    <el-table-column label="分类" prop="cate_name"></el-table-column>

    <el-table-column label="发表时间" prop="pub_date">
      <template v-slot="{ row }">
        <span>
          {{ $formateDate(row.pub_date) }}
        </span>
      </template>
    </el-table-column>

    <el-table-column label="状态" prop="state"></el-table-column>
    <el-table-column label="操作">
      <template v-slot="{ row }">
        <el-button type="danger" size="mini" @click="removeFn(row.id)">删除</el-button>
      </template>
    </el-table-column>

  </el-table>
  <!-- 分页区域 total：总条目数， page-size：每页显示条目个数 ，current-page：当前页数，.sync双向数据绑定-->
  <el-pagination
        @size-change="handleSizeChangeFn"
        @current-change="handleCurrentChangeFn"
        :current-page.sync="q.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size.sync="q.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
  </el-card>

  <!-- 发布文章的 dialog组件 -->
  <el-dialog title="发布文章" :visible.sync="pubDialogVisible" fullscreen :before-close="handleClose" @close="dialogCloseFn">

    <el-form :model="pubForm" :rules="pubFormRules" ref="pubFormRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>

      <el-form-item label="文章分类" prop="cate_id">
        <el-select v-model="pubForm.cate_id" placeholder="请选择分类" style="width: 100%;">
          <el-option :label="obj.cate_name" :value="obj.id" v-for="obj in cateList" :key="obj.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
         <quill-editor v-model="pubForm.content" @blur="contentChangeFn"></quill-editor>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <img src="../../assets/images/cover.jpg"  alt="" class="cover-img" ref="imgRef">
        <br/>
        <input type="file" style="display: none;" ref="inpRef" accept="images/*" @change="onFileChange"/>
        <el-button @click="btnFn" type="test">+选择封面</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="pubArtFn('已发布')">发布</el-button>
        <el-button type="info" @click="pubArtFn('草稿')">存为草稿</el-button>
      </el-form-item>
      </el-form>
  </el-dialog>

  <!-- 文章详情的 dialog组件 -->
  <el-dialog title="文章详情" :visible.sync="detaliVisible" width="80%">
     <div class="info">
        <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
        <span>发布时间：{{ $formateDate(artDetail.pub_date) }}</span>
        <span>所属分类：{{ artDetail.cate_name }}</span>
        <span>状态：{{ artDetail.state }}</span>
     </div>

     <!-- 分割线 -->
     <el-divider></el-divider>
     <!-- 文章的封面  组件创建时会让标签先渲染一次-->
     <img v-if="artDetail.cover_img" :src="baseURL + artDetail.cover_img" alt=""/>

   <!-- 文章的详情 -->
   <div v-html="artDetail.content" class="detail-box"></div>
  </el-dialog>
  </div>
</template>

<script>
import { getArtCateListAPI, uploadArtAPI, getArtListAPI, getArtInfoAPI, delArtAPI } from '@/api/index.js'
import defaultImg from '@/assets/images/cover.jpg'
export default {
  data () {
    return {
      q: { // 发给后台的参数获取文章列表
        pagenum: 1, // 获取文章列表,默认拿第一页数据
        pagesize: 2, // 当前页面需要的数据条数
        cate_id: '', // 文章分类id
        state: '' // 文章状态("已发布"和"草稿")
      },
      pubDialogVisible: false, // 控制发布文章的对话框出现
      detaliVisible: false, // 控制文章详情的对话框出现
      baseURL: 'http://big-event-vue-api-t.itheima.net',
      pubForm: { // 发布文章用的表单数据对象
        title: '', // 文章标题
        cate_id: '', // 文章分类id
        content: '', // 文章内容
        cover_img: null, // 封面图片
        state: '' // 发布状态
      },
      cateList: [], // 保存文章分类列表
      artList: [], // 保存文章列表
      total: 0, // 保存现有文章的总数
      artDetail: {}, // 保存文章详情
      pubFormRules: { // 发布文章用的表单数据校验规则对象
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
        ],
        cate_id: [
          { required: true, message: '请选择文章分类', trigger: 'change' }
        ],
        content: [
          // el-input等输入框在blur事件时进行校验，下拉菜单、单选框、复选框在change时进行校验
          // quill-editor自己绑定事件
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        cover_img: [
          { required: true, message: '请选择文章封面', trigger: 'blur' }
        ]
      },
      qRules: {
        cate_id: [
          { required: true, message: '请选择文章标题', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '请选择文章状态', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateListFn() // 获取文章分类
    this.getArtListFn() // 获取文章列表
  },
  methods: {
    async handleClose (done) { // 发布文章的对话框的关闭前的回调
      // done的作用：调用就会关闭对话框
      // 询问用户是否确认关闭对话框
      // await只能拿到成功的结果，并放行往下走，如果失败会抛出错误并不会往下走
      const confirmResult = await this.$confirm(
        '此操作将导致文章信息丢失, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err) // 捕获确认框中选择取消时拒绝状态结果‘cancel’字符串
      // 取消了关闭-阻止住, 什么都不干
      if (confirmResult === 'cancel') return
      // 确认关闭
      done()
    },
    showPubDialogFn () { // 发布文章按钮的点击事件
      this.pubDialogVisible = true // 让对话框出现
    },
    async getCateListFn () { // 获取文章分类
      const { data: res } = await getArtCateListAPI()
      this.cateList = res.data
    },
    btnFn() { // 选择封面按钮的点击事件->触发input的点击事件
      this.$refs.inpRef.click()
    },
    onFileChange (e) { // input内容改变时触发的函数
      const files = e.target.files // e.target.files拿到用户选择的文件数组
      if (files.length === 0) {
        this.pubForm.cover_img = null
        this.$refs.imgRef.setAttribute('src', defaultImg)
      } else {
        this.pubForm.cover_img = files[0]
        const url = URL.createObjectURL(files[0])
        this.$refs.imgRef.setAttribute('src', url)
      }
      // 表单单独校验封面的规则
      this.$refs.pubFormRef.validateField('cover_img')
    },
    pubArtFn (str) { // 表单里发布或存为草稿的按钮的点击事件->调后端接口
      this.pubForm.state = str
      this.$refs.pubFormRef.validate(async valid => {
        if (valid) {
          // console.log(1)
          const fd = new FormData() // FormData为表单数据对象
          fd.append('title', this.pubForm.title)
          fd.append('cate_id', this.pubForm.cate_id)
          fd.append('content', this.pubForm.content)
          fd.append('cover_img', this.pubForm.cover_img)
          fd.append('state', this.pubForm.state)
          const { data: res } = await uploadArtAPI(fd)
          // console.log(res)
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)
          this.pubDialogVisible = false
          this.getArtListFn() // 刷新文章列表，重新获取文章列表
        } else {
          return false
        }
      })
    },
    contentChangeFn () { // 富文本编辑器内容改变触发此方法 el-form中validateField方法：对部分表单字段进行校验的方法
      this.$refs.pubFormRef.validateField('content')
    },
    dialogCloseFn () { // 新增文章后->关闭表单->清空表单
      this.$refs.pubFormRef.resetFields()
      // 文章封面得手动设置初始值，因为它没受到v-model的影响
      this.$refs.imgRef.setAttribute('src', defaultImg)
    },
    async getArtListFn () { // 获取文章列表
      const { data: res } = await getArtListAPI(this.q)
      // console.log(res)
      this.artList = res.data
      this.total = res.total
    },
    handleSizeChangeFn (sizes) { // 每页条数改变时触发
      // 问题：先点击最后的页码-》切换每页条数（增大）->会触发一次 获取文章列表
      // 此时页码数会变小->又会触发一次 获取文章列表
      // 网络请求是异步 谁先回来不一定
      // 解决：切换每页条数就把当前页数设置为1
      this.q.pagenum = 1
      this.getArtListFn() // 获取文章列表
    },
    handleCurrentChangeFn (nowPage) { // 当前页码改变时触发
      this.getArtListFn() // 获取文章列表
    },
    choseFn () { // 筛选按钮的点击事件
      this.q.pagenum = 1
      this.q.pagesize = 2
      this.getArtListFn() // 获取文章列表
    },
    resetFn () { // 重置按钮的点击事件
      this.q.pagenum = 1
      this.q.pagesize = 2
      this.q.cate_id = ''
      this.q.state = ''
      this.getArtListFn() // 获取文章列表
    },
    async showDetailFn(id) { // 表格中文章标题的点击事件-查看文章详情
      this.detaliVisible = true
      const { data: res } = await getArtInfoAPI(id)
      this.artDetail = res.data
    },
    async removeFn (id) { // 表格删除按钮的点击事件
      const { data: res } = await delArtAPI(id)
      console.log(res)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)

      if (this.artList.length === 1) {
        if (this.q.pagenum > 1) {
          this.q.pagenum--
        }
      }
      this.getArtListFn() // 获取文章列表
    }
  }
}
</script>
<style lang="less" scoped>
.search-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* .btn-pub {
      margin-top: 5px;
   } */
  }

/* 设置富文本编辑器的默认最小高度
 ::v-deep作用: 穿透选择, 正常style上加了scope的话, 会给.ql-editor[data-v-hash]属性, 只能选择当前页面标签或者组件的根标签
 如果想要选择组件内的标签(那些标签没有data-v-hash值)所以正常选择选不中, 加了::v-deep空格前置的话, 选择器就会变成如下形式
 [data-v-hash] .ql-editor 这样就能选中组件内的标签的class类名了 */
::v-deep .ql-editor {
  min-height: 300px;
}
.cover-img {
    width: 400px;
    height: 280px;
    object-fit: cover;
  }
  .el-pagination {
  margin-top: 15px;
}

/* .title {
  font-size: 24px;
  text-align: center;
  font-weight: normal;
  color: #000;
  margin: 0 0 10px 0;
}

.info {
  font-size: 12px;
  span {
    margin-right: 20px;
  }
} */

/* // 修改 dialog 内部元素的样式，需要添加样式穿透
::v-deep .detail-box {
  img {
    width: 500px;
  } */
</style>