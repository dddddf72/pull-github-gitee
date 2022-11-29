'use strict'
// http://rap2api.taobao.org/app/mock/307688/api/creations
module.exports = {
  api:{
    base2:'http://rap2.taobao.org/mockjs/4230/',
    base:'http://localhost:1234/',
    creations:'api/creations',
    up:'api/up',
    signup:'api/u/signup',
    verify:'api/u/verify',
    update:'api/u/update',
    comment:'api/comments',
    signature:'api/signature',
    video:'api/creations/video',
    audio:'api/creations/audio'
  },
  qiniu:{
    upload:'http://upload.qiniu.com'
  },
  cloudinary:{
    cloud_name:'gougou',
    api_key:'852224485571877',
    // api_secret:'ht91J3cXl2TnkAgLR-ftK-iasPE',
    base:'http://res.cloudinary.com/v1_1/gougou/image/upload',
    image:'http://api.cloudinary.com/v1_1/gougou/image/upload',
    video:'http://api.cloudinary.com/v1_1/gougou/video/upload',
    audio:'http://api.cloudinary.com/v1_1/gougou/raw/upload',
  },
  headers:{
    'Accept':'application/json',
    'Content-Type':'application/json',
  },
}
