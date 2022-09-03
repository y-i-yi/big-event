<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>重置密码</span>
    </div>

    <el-form :model="userPwdForm" :rules="userPwdFormRules" ref="userPwdFormRef" label-width="100px">
      <el-form-item label="原密码" prop="old_pwd">
        <el-input v-model="userPwdForm.old_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd" >
        <el-input v-model="userPwdForm.new_pwd" minlength="1" maxlength="10" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="re_pwd" >
        <el-input v-model="userPwdForm.re_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitnewpwdFn">修改密码</el-button>
        <el-button @click="resetFn">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { updateUserPwdAPI } from '@/api/index.js'
export default {
  data () {
    // 新密码与确定新密码应一致
    const samenewPwdfn = (userPwdFormRules, value, callback) => { // 必须在data中定义此箭头函数
      // value为校验规则所对应的输入值
      if (value !== this.userPwdForm.new_pwd) {
        callback(new Error('两次输入的新密码不一致')) // 不一致调用回调函数指定一个Error对象
      } else {
        callback()
      }
    }
    // 新密码和旧密码不能相同
    const samenewfn = (userPwdFormRules, value, callback) => { // 必须在data中定义此箭头函数
      if (value === this.userPwdForm.old_pwd) {
        callback(new Error('新密码与旧密码一致')) // 不一致调用回调函数指定一个Error对象
      } else {
        callback()
      }
    }
    return {
      userPwdForm: {
        old_pwd: '',
        new_pwd: '',
        re_pwd: ''
      },
      userPwdFormRules: {
        old_pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符', trigger: 'blur' }
        ],
        new_pwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符', trigger: 'blur' },
          { validator: samenewfn, trigger: 'blur' }
        ],
        re_pwd: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: samenewPwdfn, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 提交修改
    submitnewpwdFn () {
      this.$refs.userPwdFormRef.validate(async valid => {
        if (valid) {
          // 验证成功
          // console.log(this.userForm)
          // 调用更新用户密码接口, 把用户在页面输入的新内容传给后台保存
          const { data: res } = await updateUserPwdAPI(this.userPwdForm)
          // console.log(res)
          if (res.code !== 0) return this.$message.error(res.message)
          // 更新用户信息成功，刷新 Vuex 中的数据
          this.$message.success(res.message)
          // 重新让vuex获取下最新的用户数据
          this.$store.dispatch('getuserInfo')
        } else {
          // 验证失败
          return false
        }
      })
    },
    resetFn () {
      this.$refs.userPwdFormRef.resetFields()
    }
  }
}
</script>

<style>
  .el-form {
    width: 500px;
  }
</style>