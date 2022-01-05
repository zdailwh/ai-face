import axios from 'axios'

// const mock = (process.env.NODE_ENV === 'production') ? {} : require('./mock')
const mock = require('./mock')

function timeout (ms) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

export default {
  async addGroup (params) {
    if (process.env.NODE_ENV === 'production') {
      var res = await axios.post(`/api/admin/v1/group`, params)
      return res
    } else {
      const data = await await timeout(200).then(() => mock.group)
      return { status: 200, data: data }
    }
  },

  async editGroup (params) {
    if (process.env.NODE_ENV === 'production') {
      var res = await axios.put(`/api/admin/v1/group/${params.id}`, {
        faceIds: params.faceIds || []
      })
      return res
    } else {
      const data = await await timeout(200).then(() => mock.group)
      return { status: 200, data: data }
    }
  },

  async delGroup (params) {
    if (process.env.NODE_ENV === 'production') {
      var res = await axios.delete(`/api/admin/v1/group/${params.id}`)
      return res
    } else {
      return { status: 200 }
    }
  },

  async getGroups (params) {
    if (process.env.NODE_ENV === 'production') {
      var opts = {
        page_size: params.page_size,
        page_no: params.page_no
      }
      if (params.name) {
        opts.name = params.name
      }
      var res = await axios.get(`/api/admin/v1/group`, {
        params: opts
      })
      return res
    } else {
      const data = await await timeout(200).then(() => mock.groups)
      return { status: 200, data: data }
    }
  },

  async addFace (params) {
    if (process.env.NODE_ENV === 'production') {
      var res = await axios.post(`/api/admin/v1/face`, params)
      return res
    } else {
      const data = await await timeout(200).then(() => mock.face)
      return { status: 200, data: data }
    }
  },

  async editFace (params) {
    if (process.env.NODE_ENV === 'production') {
      var res = await axios.put(`/api/admin/v1/face/${params.id}`, {
        description: params.description || '',
        gender: params.gender || '',
        birthday: params.birthday || ''
      })
      return res
    } else {
      const data = await await timeout(200).then(() => mock.face)
      return { status: 200, data: data }
    }
  },

  async delFace (params) {
    if (process.env.NODE_ENV === 'production') {
      var res = await axios.delete(`/api/admin/v1/face/${params.id}`)
      return res
    } else {
      return { status: 200 }
    }
  },

  async getFaces (params) {
    if (process.env.NODE_ENV === 'production') {
      var opts = {
        page_size: params.page_size,
        page_no: params.page_no
      }
      if (params.name) {
        opts.name = params.name
      }
      var res = await axios.get(`/api/admin/v1/face`, {
        params: opts
      })
      return res
    } else {
      const data = await await timeout(200).then(() => mock.faces)
      return { status: 200, data: data }
    }
  },

  async getGroupFaces (params) {
    if (process.env.NODE_ENV === 'production') {
      var opts = {
        page_size: params.page_size,
        page_no: params.page_no
      }
      if (params.name) {
        opts.name = params.name
      }
      var res = await axios.get(`/api/admin/v1/group/faces/${params.groupId}`, {
        params: opts
      })
      return res
    } else {
      const data = await await timeout(200).then(() => mock.faces)
      return { status: 200, data: data }
    }
  },

  async addFeature (params) {
    if (process.env.NODE_ENV === 'production') {
      var res = await axios.post(`/api/admin/v1/feature`, {
        faceId: params.faceId,
        file: params.file
      })
      return res
    } else {
      const data = await await timeout(200).then(() => mock.feature)
      return { status: 200, data: data }
    }
  },

  async delFeature (params) {
    if (process.env.NODE_ENV === 'production') {
      var res = await axios.delete(`/api/admin/v1/feature/${params.id}`)
      return res
    } else {
      return { status: 200 }
    }
  },

  async addTask (params) {
    if (process.env.NODE_ENV === 'production') {
      var res = await axios.post(`/api/admin/v1/task`, params)
      return res
    } else {
      const data = await await timeout(200).then(() => mock.task)
      return { status: 200, data: data }
    }
  },

  // async editTask (params) {
  //   if (process.env.NODE_ENV === 'production') {
  //     var res = await axios.put(`/api/admin/v1/task/${params.id}`, params)
  //     return res
  //   } else {
  //     const data = await await timeout(200).then(() => mock.task)
  //     return { status: 200, data: data }
  //   }
  // },

  async delTask (params) {
    if (process.env.NODE_ENV === 'production') {
      var res = await axios.delete(`/api/admin/v1/task/${params.id}`)
      return res
    } else {
      return { status: 200 }
    }
  },

  async getTasks (params) {
    if (process.env.NODE_ENV === 'production') {
      var opts = {
        page_size: params.page_size,
        page_no: params.page_no,
        stream_type: params.stream_type
      }
      if (params.name) {
        opts.name = params.name
      }
      if (params.type) {
        opts.type = params.type
      }
      var res = await axios.get(`/api/admin/v1/task`, {
        params: opts
      })
      return res
    } else {
      const data = await await timeout(200).then(() => mock.tasks)
      return { status: 200, data: data }
    }
  },

  async getTasksById (params) {
    if (process.env.NODE_ENV === 'production') {
      var res = await axios.get(`/api/admin/v1/task/${params.id}`)
      return res
    } else {
      const data = await await timeout(200).then(() => mock.task)
      return { status: 200, data: data }
    }
  },

  async taskPause (params) {
    if (process.env.NODE_ENV === 'production') {
      var res = await axios.post(`/api/admin/v1/task/pause/${params.id}`)
      return res
    } else {
      const data = await await timeout(200).then(() => mock.task)
      return { status: 200, data: data }
    }
  },

  async taskResume (params) {
    if (process.env.NODE_ENV === 'production') {
      var res = await axios.post(`/api/admin/v1/task/resume/${params.id}`)
      return res
    } else {
      const data = await await timeout(200).then(() => mock.task)
      return { status: 200, data: data }
    }
  },

  async taskReset (params) {
    if (process.env.NODE_ENV === 'production') {
      var res = await axios.post(`/api/admin/v1/task/reset/${params.id}`)
      return res
    } else {
      const data = await await timeout(200).then(() => mock.task)
      return { status: 200, data: data }
    }
  },

  async getTaskResults (params) {
    if (process.env.NODE_ENV === 'production') {
      var res = await axios.get(`/api/admin/v1/task/result/${params.id}`)
      return res
    } else {
      const data = await await timeout(200).then(() => mock.result)
      return { status: 200, data: { data: data, count: 1 } }
    }
  },

  async getDemo () {
    // if (process.env.NODE_ENV === 'production') {
    // var res = await axios.get(`/api/admin/v1/demo`)
    // return res
    // } else {
    const data = await await timeout(200).then(() => mock.demo)
    return { status: 200, data: data }
    // }
  },

  async demoStart (params) {
    // if (process.env.NODE_ENV === 'production') {
    // var res = await axios.post(`/api/admin/v1/demo`, params)
    // return res
    // } else {
    return { status: 200, data: {} }
    // }
  },

  async demoPause () {
    // if (process.env.NODE_ENV === 'production') {
    // var res = await axios.post(`/api/admin/v1/demo/pause`)
    // return res
    // } else {
    return { status: 200, data: {} }
    // }
  },

  async getDemoMessages (params) {
    // if (process.env.NODE_ENV === 'production') {
    // var opts = {
    //   page_size: params.page_size
    // }
    // var res = await axios.get(`/api/admin/v1/demo/message`, {
    //   params: opts
    // })
    // return res
    // } else {
    const data = await await timeout(200).then(() => mock.demoMessages)
    return { status: 200, data: data }
    // }
  },

  async login (params) {
    // if (process.env.NODE_ENV === 'production') {
    //   var res = await axios.post('/api/admin/v1/login', {
    //     username: params.username,
    //     password: params.password
    //   })
    //   return res
    // } else {
    const data = await await timeout(200).then(() => mock.authentication)
    return { status: 200, data: data }
    // }
  },

  async logout (params) {
    // if (process.env.NODE_ENV === 'production') {
    //   var res = await axios.get('/api/admin/v1/logout')
    //   return res
    // } else {
    const data = await await timeout(200).then(() => mock.authentication)
    return { status: 200, data: data }
    // }
  }
}
