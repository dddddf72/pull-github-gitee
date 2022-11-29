'use strict'

var queryString = require('query-string')
var _ = require('lodash')
var Mock = require('mockjs')
var config = require('./config')

var request = {}
request.get = function(url,params){
  if(params){
    url += '?'+queryString.stringify(params)
  }
  return fetch(url)
  .then((response)=>response.json())
  .then((response)=>Mock.mock(response))//线上环境注释此行
}
request.post = function(url,body){
  var options = _.extend(config.header,{
    // methods:'POST',
    // headers:{
    //   'Accept':'application/json',
    //   'Content-Type':'application/json',
    // },
    body:JSON.stringify(body)
  })
  return fetch(url,options)
  .then((response)=>response.json())
  .then((response)=>Mock.mock(response))//线上环境注释此行
}
module.exports = request
