<template>
  <div class="reg-container">
    <div class="reg-box">
     <!-- 标题 -->
      <div class="title-box"></div>

      <!-- 表单 -->
      <el-form ref="form" :model="form" :rules="rulesObj">

        <el-form-item prop="username">
          <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input type="password" placeholder="请再次确认密码" v-model="form.repassword"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="registerfn" class="btn-reg">注册</el-button>
          <el-link type="info"  @click="$router.push('/login')">去登录</el-link>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
import { registerAPI } from '@/api/index.js'
export default {
  data () {
    const samePwdfn = (rulesObj, value, callback) => { // 必须在data中定义此箭头函数
      if (value !== this.form.password) {
        callback(new Error('两次输入的密码不一致')) // 不一致调用回调函数指定一个Error对象
      } else {
        callback()
      }
    }
    return {
      form: { // 表单数据对象
        username: '', // 用户名
        password: '', // 密码
        repassword: '' // 确认密码
      }, // 前端绑定数据对象属性名，可以与要调用的功能接口的参数名一致
      rulesObj: { // 表单规则校验对象
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,10}$/, message: '用户名必须为1-10位的英文或数字', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符', trigger: 'blur' }
        ],
        repassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: samePwdfn, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 注册的点击事件
    registerfn () {
      // js兜底校验
      this.$refs.form.validate(async valid => {
        if (valid) {
          // 通过校验,调用注册接口
          // Elementui在vue原型链上添加了弹窗提示,$message属性
          const { data: res } = await registerAPI(this.form)
          // console.log(res)
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message) // 注册成功提示用户
          this.$router.push('/login') // 跳转到登录页
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