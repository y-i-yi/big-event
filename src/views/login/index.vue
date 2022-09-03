<template>
  <!-- 登录页面整体盒子 -->
  <div class="reg-container">
    <!-- 白底居中的盒子 -->
    <div class="reg-box">
     <!-- 标题 -->
      <div class="title-box"></div>

      <!-- 表单 -->
      <el-form ref="loginform" :model="loginform" :rules="loginrulesObj" width="80%">

        <el-form-item prop="username">
          <el-input placeholder="请输入用户名" v-model="loginform.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="loginform.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loginfn" class="btn-reg">登录</el-button>
          <el-link type="info" @click="$router.push('/register')">去注册</el-link>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
import { loginAPI } from '@/api/index.js'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      loginform: {
        username: '',
        password: ''
      },
      loginrulesObj: { // 表单规则校验对象
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,10}$/, message: '用户名必须为1-10位的英文或数字', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations(['updateToken']),
    loginfn () {
      this.$refs.loginform.validate(async valid => {
        if (valid) {
          // 通过校验,调用登录接口
          // Elementui在vue原型链上添加了弹窗提示,$message属性
          const { data: res } = await loginAPI(this.loginform)
          // console.log(res)
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message) // 登录成功提示用户
          this.updateToken(res.token) // 提交给mutations 把token字符串保存到vuex中
          this.$router.push('/') // 跳转到布局页
        } else {
          return false // 阻止默认提交行为
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .reg-container {
    background: url("../../assets/images/login_bg.jpg") center;
    background-size: cover;
    height: 100%;
  .reg-box {
      width: 400px;
      height: 335px;
      background-color: #fff;
      border-radius: 3px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      padding: 0 30px;
      box-sizing: border-box;
      .title-box {
        height: 60px;
        background: url("../../assets/images/login_title.png") center no-repeat;
      }
    .btn-reg { // 注册按钮
        width: 100%;
      }
    }
  }
  </style>