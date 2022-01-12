const Mock = require('mockjs')

const Random = Mock.Random
Random.datetime('yyyy-MM-dd HH:mm:ss')
Random.date('yyyy-MM-dd')
Random.string('lower', 3, 7)
Random.cname()
Random.province()
Random.city()
Random.county()
Random.cword()
Random.natural()

let templateFace = {
  'id|2-10000': 2,
  'create_time': '2020-10-15T17:54:52.43+08:00',
  'update_time': '2020-10-15T17:54:52.43+08:00',
  'faceId': '8692-f7a505-df13',
  'name': 'test1',
  'description': '',
  'gender': 1,
  'birthday': '1998-10-01',
  'features': [
    // {
    //   'id': 1,
    //   'create_time': '2021-12-20T19:12:30',
    //   'update_time': '2021-12-20T19:12:30',
    //   'face_id': 36,
    //   'filepath': 'resource/feature/1a92-c7b30a-af80.jpg',
    //   'fileuri': 'resource/feature/1a92-c7b30a-af80.jpg',
    //   'feature': 'resource/feature/1a92-c7b30a-af80.bin',
    //   'status': 1
    // },
    // {
    //   'id': 2,
    //   'create_time': '2021-12-20T19:12:31',
    //   'update_time': '2021-12-20T19:12:31',
    //   'face_id': 36,
    //   'filepath': 'resource/feature/2b81-dfb101-ef73.jpg',
    //   'fileuri': 'resource/feature/2b81-dfb101-ef73.jpg',
    //   'feature': 'resource/feature/2b81-dfb101-ef73.bin',
    //   'status': 1
    // }
  ]
}

let templateFaces = {
  'code': 0,
  'data': {
    'total': 54,
    'item|1-54': [templateFace]
  }
}

let templateGroup = {
  'id|2-10000': 2,
  'create_time': '2020-10-15T17:54:52.43+08:00',
  'update_time': '2020-10-15T17:54:52.43+08:00',
  'groupId': '8692-f7a505-df13',
  'name': 'test1',
  'description': '',
  'faceIds': []
}

let templateGroups = {
  'code': 0,
  'data': {
    'total': 54,
    'item|1-54': [templateGroup]
  }
}

let templateTemp = {
  'id|2-10000': 2,
  'create_time': '2020-10-15T17:54:52.43+08:00',
  'update_time': '2020-10-15T17:54:52.43+08:00',
  'frame_rate': 25,
  'prority': 0,
  'groupIds': []
}

let templateTemps = {
  'code': 0,
  'data': {
    'total': 54,
    'item|1-54': [templateTemp]
  }
}

let templateTask = {
  'id|2-10000': 2,
  'create_time': '2020-10-15T18:43:24.842+08:00',
  'update_time': '2020-10-15T18:43:24.842+08:00',
  'group_ids': 'default_base_all',
  'name': 'test20200915-4',
  'description': 'hank-test',
  'url': '',
  'filepath': 'task/111.mp4',
  'faceIds': '8692-f7a505-df13,7a92-efa815-af02',
  'frame_rate': 25,
  'prority': 0,
  'processTime': 12,
  'duration': 30,
  'status|1': [0, 1, 2], // 0新建，1进⾏中，2完成
  'stream_type': 'offline',
  'type': '1'
}

let templateTasks = {
  'code': 0,
  'data': {
    'total': 54,
    'item|1-54': [templateTask]
  }
}

let templateFeature = {
  'create_time': '2020-10-15T18:43:24.842+08:00',
  'update_time': '2020-10-15T18:43:24.842+08:00',
  'GroupID': 'default_base_group',
  'FaceID': 'fa4e41ac-ac78-4a94-b9bc-49ffadbf2400',
  'FullURI': 'http://10.122.94.101:8080/v5/resources/data?uri=weed%3A%2F%2F2%2C0135388d4b60&contentType=image/jpeg'
}

let templateFeatures = [templateFeature]

let templateResultItem = {
  'faceId': '8692-f7a505-df13',
  'featureId': '1a92-c7b30a-af80',
  'featureuri': 'resource/feature/1a92-c7b30a-af80.jpg',
  'faceName': 'test1',
  'timepos': '0.02',
  'recImage': 'resource/result/aa001.jpg',
  'score': ''
}

let templateResult = [{ data: templateResultItem }]

let templateDemo = {
  'id': 'aa-bb-cc',
  'name': 'demo',
  'description': 'demo',
  'url': 'rtsp://xxxx.xx.x.x/xx',
  'status': 'VIDEO_PROCESSING' // VIDEO_PREPARING，VIDEO_PROCESSING，VIDEO_PAUSED，VIDEO_ERROR
}
let templateDemoMessages = {
  'data|1-10': [templateResultItem]
}

let templateUser = {
  'id|2-10000': 2,
  'class': 'app\\user\\admin\\User',
  'class_name': '系统管理员',
  'model_name': '用户',
  'create_time': '@datetime',
  'update_time': '@datetime',
  'status|1': [1, 2],
  'statusstr|1': ['活跃', '禁用'],
  'path': '/api/admin/v1/users/2',
  'username': 'test1',
  'mobile': '',
  'level': 4,
  'activity': '@integer(100, 500)'
}
let templateUsers = {
  'code': 0,
  'data': {
    'total': 54,
    'item|1-54': [templateUser]
  }
}

let templateAuthentication = {
  'id': 965,
  'class': 'app\\user\\admin\\Authentication',
  'class_name': '登录认证',
  'model_name': '认证',
  'create_time': '2019-08-22 16:29:18',
  'update_time': '2019-08-22 16:49:40',
  'status|1': [0, 1, 2],
  'statusstr|1': ['活跃', '过期', '下线'],
  'path': '/api/admin/v1/authentications/965',
  'session': 'ej89fobjl830eoo8pdqhi63cmq',
  'clientip': '111.199.84.127',
  'expiretime': '2019-08-22 18:49:40',
  'user': templateUser
}
let templateLoginRes = {
  'code': 0,
  'data': templateAuthentication
}

let templateRole = {
  'id|2-10000': 2,
  create_time: '@datetime',
  name: '@first',
  description: '@first',
  'status|1': [0, 1, 2]
}

let templateRoles = {
  'code': 0,
  'data': {
    'total': 54,
    'item|1-54': [templateRole]
  }
}

let templatePermission = {
  'id|2-10000': 2,
  create_time: '@datetime',
  info: '@first',
  name: '@first',
  'status|1': [0, 1, 2]
}

let templatePermissions = {
  'code': 0,
  'data': {
    'total': 54,
    'item|1-54': [templatePermission]
  }
}

let templateRoleperm = {
  'id|2-10000': 2,
  'status|1': [0, 1, 2]
}

let templateRoleperms = {
  'code': 0,
  'data': {
    'total': 54,
    'item|1-54': [templateRoleperm]
  }
}

let templateRoleuser = {
  'id|2-10000': 2,
  'status|1': [0, 1, 2]
}

let templateRoleusers = {
  'code': 0,
  'data': {
    'total': 54,
    'item|1-54': [templateRoleuser]
  }
}

let face = Mock.mock(templateFace)
let faces = Mock.mock(templateFaces)
let group = Mock.mock(templateGroup)
let groups = Mock.mock(templateGroups)
let temp = Mock.mock(templateTemp)
let temps = Mock.mock(templateTemps)
let task = Mock.mock(templateTask)
let tasks = Mock.mock(templateTasks)
let feature = Mock.mock(templateFeature)
let features = Mock.mock(templateFeatures)
let result = Mock.mock(templateResult)
let demo = Mock.mock(templateDemo)
let demoMessages = Mock.mock(templateDemoMessages)
let authentication = Mock.mock(templateAuthentication)
let loginRes = Mock.mock(templateLoginRes)
let user = Mock.mock(templateUser)
let users = Mock.mock(templateUsers)
let role = Mock.mock(templateRole)
let roles = Mock.mock(templateRoles)
let permission = Mock.mock(templatePermission)
let permissions = Mock.mock(templatePermissions)
let roleperm = Mock.mock(templateRoleperm)
let roleperms = Mock.mock(templateRoleperms)
let roleuser = Mock.mock(templateRoleuser)
let roleusers = Mock.mock(templateRoleusers)

module.exports = {
  face,
  faces,
  group,
  groups,
  temp,
  temps,
  task,
  tasks,
  feature,
  features,
  result,
  demo,
  demoMessages,
  authentication,
  loginRes,
  user,
  users,
  role,
  roles,
  permission,
  permissions,
  roleperm,
  roleperms,
  roleuser,
  roleusers
}
