import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/',
    redirect: '/facegroup/group'
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('@/views/index'),
    meta: {
      title: '首页',
      active: 'index'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login'),
    meta: {
      title: '登录',
      active: 'login'
    }
  },
  {
    path: '/facegroup',
    name: 'FaceGroup',
    component: () => import('@/views/faceGroup'),
    meta: {
      title: '人脸库',
      active: 'facegroup'
    },
    children: [
      {
        path: 'group',
        name: 'Group',
        component: () => import('@/views/group'),
        meta: {
          title: '人脸库',
          active: 'facegroup'
        }
      },
      {
        path: 'face',
        name: 'Face',
        component: () => import('@/views/face'),
        meta: {
          title: '人脸',
          active: 'facegroup'
        }
      }
    ]
  },
  {
    path: '/task',
    name: 'Task',
    component: () => import('@/views/task'),
    meta: {
      title: '离线任务',
      active: 'task'
    }
  },
  {
    path: '/taskResult/:taskId',
    name: 'TaskResult',
    component: () => import('@/views/taskResult'),
    meta: {
      title: '查看任务结果',
      active: 'task'
    }
  },
  {
    path: '/live',
    name: 'Live',
    component: () => import('@/views/live'),
    meta: {
      title: '直播流',
      active: 'live'
    }
  },
  {
    path: '/my',
    name: 'My',
    component: () => import('@/views/setting/admin/layout'),
    redirect: '/my/admin/edit',
    meta: { title: '个人账号', active: 'my' },
    hidden: true,
    children: [
      {
        path: 'admin/edit',
        component: () => import('@/views/setting/admin/edit'),
        name: 'MyEdit',
        meta: { title: '编辑个人信息', active: 'my' }
      },
      {
        path: 'admin/updatePwd',
        component: () => import('@/views/setting/admin/updatePwd'),
        name: 'MyUpdatePwd',
        meta: { title: '修改密码', active: 'my' }
      }
    ]
  },
  {
    path: '/setting',
    name: 'Setting',
    component: () => import('@/views/setting/admin/layout'),
    redirect: '/setting/admin/index',
    meta: { title: '基本配置', active: 'setting', roles: ['admin'] },
    children: [
      {
        path: 'admin/index',
        component: () => import('@/views/setting/admin/index'),
        name: 'AdminList',
        meta: { title: '用户设置', active: 'admin' }
      },
      {
        path: 'pwdSet/index',
        component: () => import('@/views/setting/admin/pwdSet'),
        name: 'AdminPwdSet',
        meta: { title: '密码强度设置', active: 'setting' }
      },
      {
        path: 'role/index',
        component: () => import('@/views/setting/role/index'),
        name: 'RoleList',
        meta: { title: '角色配置', active: 'role' }
      },
      {
        path: 'permission/index',
        component: () => import('@/views/setting/permission/index'),
        name: 'PermissionList',
        meta: { title: '权限配置', active: 'permission' }
      },
      {
        path: 'roleuser/index',
        component: () => import('@/views/setting/roleuser/index'),
        name: 'RoleUser',
        meta: { title: '用户角色', active: 'roleuser' }
      },
      {
        path: 'roleperm/index',
        component: () => import('@/views/setting/roleperm/index'),
        name: 'RolePerm',
        meta: { title: '角色权限', active: 'roleperm' }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/setting',
    name: 'Setting',
    component: () => import('@/views/setting/admin/layout'),
    redirect: '/setting/admin/index',
    meta: { title: '基本配置', active: 'setting', roles: ['admin'] },
    children: [
      {
        path: 'admin/index',
        component: () => import('@/views/setting/admin/index'),
        name: 'AdminList',
        meta: { title: '用户设置', active: 'setting' }
      },
      {
        path: 'pwdSet/index',
        component: () => import('@/views/setting/admin/pwdSet'),
        name: 'AdminPwdSet',
        meta: { title: '密码强度设置', active: 'setting' }
      },
      {
        path: 'role/index',
        component: () => import('@/views/setting/role/index'),
        name: 'RoleList',
        meta: { title: '角色配置', active: 'setting' }
      },
      {
        path: 'permission/index',
        component: () => import('@/views/setting/permission/index'),
        name: 'PermissionList',
        meta: { title: '权限配置', active: 'setting' }
      },
      {
        path: 'roleuser/index',
        component: () => import('@/views/setting/roleuser/index'),
        name: 'RoleUser',
        meta: { title: '用户角色', active: 'setting' }
      },
      {
        path: 'roleperm/index',
        component: () => import('@/views/setting/roleperm/index'),
        name: 'RolePerm',
        meta: { title: '角色权限', active: 'setting' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
