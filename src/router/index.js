import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/index'
import Login from '@/views/login'

import FaceGroup from '@/views/faceGroup'
import Group from '@/views/group'
import Face from '@/views/face'
import Task from '@/views/task'
import TaskResult from '@/views/taskResult'
import Live from '@/views/live'
import Setting from '@/views/setting'
import LiveTest from '@/views/liveTest'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/facegroup/group'
    },
    {
      path: '/index',
      name: 'Index',
      component: Index
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: '登录'
      }
    },
    {
      path: '/facegroup',
      name: 'FaceGroup',
      component: FaceGroup,
      meta: {
        title: '人脸库'
      },
      children: [
        {
          path: 'group',
          name: 'Group',
          component: Group,
          meta: {
            title: '人脸库',
            active: 'facegroup'
          }
        },
        {
          path: 'face',
          name: 'Face',
          component: Face,
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
      component: Task,
      meta: {
        title: '离线任务',
        active: 'task'
      }
    },
    {
      path: '/taskResult/:taskId',
      name: 'TaskResult',
      component: TaskResult,
      meta: {
        title: '查看任务结果',
        active: 'task'
      }
    },
    {
      path: '/live',
      name: 'Live',
      component: Live,
      meta: {
        title: '直播流',
        active: 'live'
      }
    },
    {
      path: '/setting',
      name: 'Setting',
      component: Setting,
      meta: {
        title: '设置',
        active: 'setting'
      }
    },
    {
      path: '/livetest',
      name: 'LiveTest',
      component: LiveTest,
      meta: {
        title: '直播流测试'
      }
    }
  ]
})
