<template>
<el-container class="main-container">
    <!-- 头部，导航条  -->
    <el-header>
      <!-- 左侧logo -->
      <img src="../../assets/images/logo.png" alt="" />
      <!-- 右侧菜单 -->
      <el-menu class="el-menu-top" mode="horizontal" background-color="#23262E"
      text-color="#fff" active-text-color="#409EFF">
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
            <img :src="user_pic" alt="" v-if="user_pic" class="avatar">
            <img src="../../assets/images/logo.png" alt="" class="avatar" v-else>
            <span>个人中心</span>
          </template>
            <!-- 下拉菜单部分、 -->
          <el-menu-item index="1-1" @click="$router.push('/user-info')"><i class="el-icon-s-operation"></i>基本资料</el-menu-item>
          <el-menu-item index="1-2"><i class="el-icon-camera" @click="$router.push('/user-avatar')"></i>更换头像</el-menu-item>
          <el-menu-item index="1-3"><i class="el-icon-key" @click="$router.push('/user-pwd')"></i>重置密码</el-menu-item>
        </el-submenu>
        <el-menu-item index="2" @click="layoutFn"><i class="el-icon-switch-button" ></i>退出</el-menu-item>
      </el-menu>
    </el-header>

    <!-- 侧边模块 -->
    <el-container>
      <el-aside width="200px">
        <div class="user-box">
          <img :src="user_pic" alt="" v-if="user_pic">
          <img src="../../assets/images/logo.png" alt="" v-else>
          <span>欢迎{{ nickname||username }}</span>
        </div>
      <!-- 侧边导航栏 default-active 当前激活菜单的index(el-submenu/el-menu-item的index 对应的导航条就会激活)
      open：sub-menu 展开的回调，close:sub-menu 收起的回调, active-text-color:当前激活菜单的文字颜色
      子标签：如果有嵌套，先写el-submenu，里面嵌套template来展示当前内容，子用el-menu-item显示
       router:是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转-->
      <el-menu :default-active="$route.path" class="el-menu-vertical-demo"  background-color="#23262E" text-color="#fff" active-text-color="#409EFF" router>
        <template v-for="item in menus">
        <el-menu-item v-if="!item.children" :index="item.indexPath" :key="item.indexPath">
          <i :class="item.icon"></i>
          <span slot="title">{{ item.title }}</span>
        </el-menu-item>

        <el-submenu v-else :index="item.indexPath" :key="item.indexPath">
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{ item.title }}</span>
          </template>
            <el-menu-item v-for="obj in item.children" :index="obj.indexPath" :key="obj.indexPath"><i :class="obj.icon"></i>
              <span slot="title">{{ obj.title }}</span></el-menu-item>
        </el-submenu>

        </template>
      </el-menu>
      </el-aside>

      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getmenusAPI } from '@/api/index.js'
export default {
  data() {
    return {
      menus: [] // 保存侧边栏数据
    }
  },
  computed: {
    ...mapGetters(['nickname', 'username', 'user_pic'])
  },
  methods: {
    layoutFn () {
      // 弹出确认弹窗
      // const that = this
      // console.log(1)
      this.$confirm('确定退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 选择了确定，清除token,清楚用户信息
        this.$store.commit('updateToken', '')
        this.$store.commit('updateuserInfo', {})
        this.$router.push('/login')
      }).catch(() => {})
    },
    async getmenusfn () {
      const { data: res } = await getmenusAPI()
      this.menus = res.data
    }
  },
  created() {
    // 请求侧边栏数据
    this.getmenusfn()
  }
}
</script>

<style lang="less" scoped>
.main-container {
  height: 100%;
  .el-header,
  .el-aside {
    background-color: #23262e;
  }
  .el-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
  }
  .el-main {
    overflow-y: scroll;
    height: 0;
    background-color: #f2f2f2;
  }
  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}

// 左侧边栏用户信息区域
.user-box {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  user-select: none;
  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }
  span {
    color: white;
    font-size: 12px;
  }
}

// 侧边栏菜单的样式
.el-aside {
  .el-submenu,
  .el-menu-item {
    width: 200px;
    user-select: none;
  }
}
</style>