import Vue from 'vue'
import Router from 'vue-router'

const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/',
    redirect: '/facegroup/group',
    hidden: true
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('@/views/index'),
    meta: { title: '首页', active: 'index' },
    hidden: true
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login'),
    meta: { title: '登录', active: 'login' },
    hidden: true
  },
  {
    path: '/queue',
    name: 'Queue',
    component: () => import('@/views/queue/index'),
    meta: { title: '当前队列', active: 'queue', icon: 'flag' },
    redirect: '/queue/my',
    children: [
      {
        path: 'my',
        name: 'My',
        component: () => import('@/views/queue/my'),
        meta: { title: '我的', active: 'queue' }
      },
      {
        path: 'all',
        name: 'All',
        component: () => import('@/views/queue/all'),
        meta: { title: '全部', active: 'queue' }
      }
    ]
  },
  {
    path: '/taskbatch',
    name: 'TaskBatch',
    component: () => import('@/views/taskBatch/index'),
    meta: { title: '任务管理', active: 'taskbatch', icon: 'schedule' },
    redirect: '/taskbatch/task',
    children: [
      {
        path: 'task',
        name: 'Task',
        component: () => import('@/views/taskBatch/task'),
        meta: { title: '任务', active: 'taskbatch' }
      },
      {
        path: 'batch',
        name: 'Batch',
        component: () => import('@/views/taskBatch/batch'),
        meta: { title: '批次', active: 'taskbatch' }
      }
    ]
  },
  {
    path: '/facegroup',
    name: 'FaceGroup',
    component: () => import('@/views/faceGroup/index'),
    meta: { title: '人像库', active: 'facegroup', icon: 'smile' },
    redirect: '/facegroup/face',
    children: [
      {
        path: 'face',
        name: 'Face',
        component: () => import('@/views/faceGroup/face'),
        meta: { title: '人像', active: 'facegroup' }
      },
      {
        path: 'group',
        name: 'Group',
        component: () => import('@/views/faceGroup/group'),
        meta: { title: '分组', active: 'facegroup' }
      }
    ]
  },
  {
    path: '/mode',
    name: 'Mode',
    component: () => import('@/views/mode/index'),
    meta: { title: '审核模板', active: 'mode', icon: 'book' },
    redirect: '/mode/list',
    children: [
      {
        path: 'list',
        name: 'ModeList',
        component: () => import('@/views/mode/modelist'),
        meta: { title: '模板列表', active: 'mode' }
      }
    ]
  },
  {
    path: '/taskResult/:taskId',
    name: 'TaskResult',
    component: () => import('@/views/taskResult'),
    meta: { title: '查看任务结果', active: 'task' },
    hidden: true
  },
  {
    path: '/adminsetting',
    name: 'AdminSetting',
    component: () => import('@/views/adminSetting/index'),
    meta: { title: '用户管理', active: 'adminSetting', icon: 'user', roles: ['admin'] },
    redirect: '/adminsetting/admin/index',
    children: [
      {
        path: 'admin/index',
        component: () => import('@/views/adminSetting/admin/index'),
        name: 'AdminList',
        meta: { title: '用户列表', active: 'adminSetting' }
      },
      {
        path: 'role/index',
        component: () => import('@/views/adminSetting/role/index'),
        name: 'RoleList',
        meta: { title: '角色列表', active: 'adminSetting' }
      },
      {
        path: 'roleperm/index',
        component: () => import('@/views/adminSetting/roleperm/index'),
        name: 'RolePerm',
        meta: { title: '角色配置', active: 'adminSetting' }
      },
      {
        path: 'pwdSet/index',
        component: () => import('@/views/adminSetting/admin/pwdSet'),
        name: 'AdminPwdSet',
        meta: { title: '密码强度设置', active: 'adminSetting' },
        hidden: true
      },
      {
        path: 'permission/index',
        component: () => import('@/views/adminSetting/permission/index'),
        name: 'PermissionList',
        meta: { title: '权限配置', active: 'adminSetting' },
        hidden: true
      },
      {
        path: 'roleuser/index',
        component: () => import('@/views/adminSetting/roleuser/index'),
        name: 'RoleUser',
        meta: { title: '用户角色', active: 'adminSetting' },
        hidden: true
      }
    ]
  },
  {
    path: '/my',
    name: 'My',
    component: () => import('@/views/adminSetting/index'),
    redirect: '/my/admin/edit',
    meta: { title: '个人账号', active: 'my' },
    hidden: true,
    children: [
      {
        path: 'admin/edit',
        component: () => import('@/views/adminSetting/admin/edit'),
        name: 'MyEdit',
        meta: { title: '编辑个人信息', active: 'my' }
      },
      {
        path: 'admin/updatePwd',
        component: () => import('@/views/adminSetting/admin/updatePwd'),
        name: 'MyUpdatePwd',
        meta: { title: '修改密码', active: 'my' }
      }
    ]
  },
  {
    path: '/log',
    name: 'Log',
    component: () => import('@/views/log/index'),
    meta: { title: '日志查询', active: 'log', icon: 'solution' },
    redirect: '/log/list',
    children: [
      {
        path: 'list',
        name: 'LogList',
        component: () => import('@/views/log/loglist'),
        meta: { title: '日志查询', active: 'log' }
      }
    ]
  },
  {
    path: '/syssetting',
    name: 'SysSetting',
    component: () => import('@/views/sysSetting/index'),
    meta: { title: '系统设置', active: 'sysSetting', icon: 'control' },
    redirect: '/syssetting/sysinfo',
    children: [
      {
        path: 'sysinfo',
        name: 'SysInfo',
        component: () => import('@/views/sysSetting/sysinfo'),
        meta: { title: '设备信息', active: 'sysSetting' }
      },
      {
        path: 'sysrestart',
        name: 'SysRestart',
        component: () => import('@/views/sysSetting/sysrestart'),
        meta: { title: '设备重启', active: 'sysSetting' }
      },
      {
        path: 'network',
        name: 'Network',
        component: () => import('@/views/sysSetting/network'),
        meta: { title: '网络配置', active: 'sysSetting' }
      },
      {
        path: 'storage',
        name: 'Storage',
        component: () => import('@/views/sysSetting/storage'),
        meta: { title: '存储管理', active: 'sysSetting' }
      }
    ]
  }
]

export const asyncRoutes = [
  // {
  //   path: '/setting',
  //   name: 'Setting',
  //   component: () => import('@/views/setting/admin/layout'),
  //   meta: { title: '基本配置', active: 'setting', icon: 'user', roles: ['admin'] },
  //   redirect: '/setting/admin/index',
  //   children: [
  //     {
  //       path: 'admin/index',
  //       component: () => import('@/views/setting/admin/index'),
  //       name: 'AdminList',
  //       meta: { title: '用户设置', active: 'setting' }
  //     },
  //     {
  //       path: 'pwdSet/index',
  //       component: () => import('@/views/setting/admin/pwdSet'),
  //       name: 'AdminPwdSet',
  //       meta: { title: '密码强度设置', active: 'setting' }
  //     },
  //     {
  //       path: 'role/index',
  //       component: () => import('@/views/setting/role/index'),
  //       name: 'RoleList',
  //       meta: { title: '角色配置', active: 'setting' }
  //     },
  //     {
  //       path: 'permission/index',
  //       component: () => import('@/views/setting/permission/index'),
  //       name: 'PermissionList',
  //       meta: { title: '权限配置', active: 'setting' }
  //     },
  //     {
  //       path: 'roleuser/index',
  //       component: () => import('@/views/setting/roleuser/index'),
  //       name: 'RoleUser',
  //       meta: { title: '用户角色', active: 'setting' }
  //     },
  //     {
  //       path: 'roleperm/index',
  //       component: () => import('@/views/setting/roleperm/index'),
  //       name: 'RolePerm',
  //       meta: { title: '角色权限', active: 'setting' }
  //     }
  //   ]
  // },
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
