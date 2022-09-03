<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <!-- img的src 只能是图片的链接地址（外连接HTTP开头，图片文件相对路径）
    或者图片的base64字符串（格式为data:image/png;base64,图片的base64字符串） -->
    <img  v-if="avatar==''" class="the-img" src="../../assets/images/avatar.jpg" alt="">
    <img v-else :src="avatar" alt="" class="the-img">

    <!-- 按钮区 -->
    <div class="btn-box">
      <input type="file" accept="images/*" style="display: none" ref="iptRef" @change="onFileChange" >
      <el-button type="primary" icon="el-icon-plus" @click="chooseImg" >选择图片</el-button>
      <el-button type="success" icon="el-icon-upload" :disabled="avatar === ''" @click="updateAvatar">上传头像</el-button>
    </div>
  </el-card>
</template>
<script>
import { updateUserAvatar } from '@/api/index.js'
export default {
  data() {
    return {
      avatar: '' // 保存图片链接或图片的base64字符串
    }
  },
  methods: {
    chooseImg() {
      // 选择图片->触发input点击事件
      this.$refs.iptRef.click()
    },
    onFileChange (e) {
      const files = e.target.files // 拿到用户选择的文件数组
      if (files.length === 0) {
        // 文件选择窗口打开，用户没选图片
        this.avatar = ''
      } else {
        // 用户选择了图片，默认只能选一个
        // console.log(files[0]) // 选中图片的相关信息
        // 转变图片地址：法一：文件-> 内存临时地址（这个地址不能发给后台，只能在前端用）语法：URL.createObjectURL（文件）
        // this.avatar = URL.createObjectURL(files[0])

        //  法2：文件->base64字符串,可发给后台
        // 1. 创建 FileReader 对象
        const fr = new FileReader()
        // 2. 调用 readAsDataURL 函数，读取文件内容
        fr.readAsDataURL(files[0])
        // 3. 监听 fr 的 onload 事件，文件读成base64会触发onload事件函数
        fr.onload = e => {
          // 4. 通过 e.target.result 获取到读取的结果，值是字符串（base64 格式的字符串）
          this.avatar = e.target.result
        }
      }
    },
    async updateAvatar () {
      const { data: res } = await updateUserAvatar(this.avatar)
      // console.log(res) 查看用户更新头像的返回信息
      if (res.code === 0) {
        // 更新头像成功
        this.$message.success(res.message)
        // 重新让vuex获取下最新的用户数据
        this.$store.dispatch('getuserInfo')
      } else {
        this.$message.error(res.message)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .btn-box{
    margin-top: 10px;
  }
  .preview {
    object-fit: cover;
  }
  .the-img {
    width: 350px;
    height: 350px;
  }
</style>