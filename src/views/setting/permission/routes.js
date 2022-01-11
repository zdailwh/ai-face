export const routes = [
  {
    title: '频道预览',
    name: 'ChannelView',
    children: [
      {
        title: '频道预览',
        name: 'ChannelViewList',
        parent: 'ChannelView'
      }
    ]
  },
  {
    title: '节目管理',
    name: 'Program',
    children: [
      {
        title: '节目列表',
        name: 'ProgramList',
        parent: 'Program'
      },
      {
        title: '节目上载',
        name: 'ProgramAdd',
        parent: 'Program'
      }
    ]
  },
  {
    title: '编单',
    name: 'ProEdit',
    children: [
      {
        title: '编单',
        name: 'ProEditMain',
        parent: 'ProEdit'
      }
    ]
  },
  {
    title: '审核播出',
    name: 'Examine',
    children: [
      {
        title: '审核播出',
        name: 'ExamineMain',
        parent: 'Examine'
      }
    ]
  },
  {
    title: '基本配置',
    name: 'Setting',
    children: [
      {
        title: '用户设置',
        name: 'AdminList',
        parent: 'Setting'
      },
      {
        title: '密码强度设置',
        name: 'AdminPwdSet',
        parent: 'Setting'
      },
      {
        title: '黑白名单设置',
        name: 'BlackWhiteList',
        parent: 'Setting'
      },
      {
        title: '角色配置',
        name: 'RoleList',
        parent: 'Setting'
      },
      {
        title: '权限配置',
        name: 'PermissionList',
        parent: 'Setting'
      },
      {
        title: '用户角色',
        name: 'RoleUser',
        parent: 'Setting'
      },
      {
        title: '角色权限',
        name: 'RolePerm',
        parent: 'Setting'
      },
      {
        title: '频道设置',
        name: 'ChannelList',
        parent: 'Setting'
      },
      {
        title: '设备管理',
        name: 'DeviceList',
        parent: 'Setting'
      }
    ]
  },
  {
    title: '设备频道管理',
    name: 'DeviceChns',
    children: [
      {
        title: '设备频道管理',
        name: 'DeviceChnsList',
        parent: 'DeviceChns'
      }
    ]
  },
  {
    title: '设备节目管理',
    name: 'DevicePros',
    children: [
      {
        title: '设备节目管理',
        name: 'DeviceProsList',
        parent: 'DevicePros'
      }
    ]
  },
  {
    title: '频道节目管理',
    name: 'ProChns',
    children: [
      {
        title: '频道节目管理',
        name: 'ProChnsList',
        parent: 'ProChns'
      }
    ]
  },
  {
    title: '任务管理',
    name: 'Task',
    children: [
      {
        title: '任务总览',
        name: 'TaskView',
        parent: 'Task'
      },
      {
        title: '主任务',
        name: 'TaskJobList',
        parent: 'Task'
      },
      {
        title: '主线程',
        name: 'TaskThreadList',
        parent: 'Task'
      }
    ]
  }
]
