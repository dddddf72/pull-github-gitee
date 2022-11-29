// es5
var React = require('react-native')
var Icon = require('react-native-vector-icons/Ionicons')
const config = require('../common/config')
const request = require('../common/request')
var StyleSheet = ReactNative.StyleSheet
var Text = ReactNative.Text
var TextInput = ReactNative.TextInput
var View = ReactNative.View
var AsyncStorage = ReactNative.AsyncStorage
var TouchableOpacity = React.TouchableOpacity
var Dimensions = React.Dimensions
var Image = React.Image
var AlertIOS = React.AlertIOS
var Modal = React.Modal
var Button = require('react-native-button')
var width = Dimensions.get('window').width

var Button = require('react-native-button')

var Video = require('react-native-video').default//这种方式叫做默认导出

var ActivityIndicatorIOS = React.ActivityIndicatorIOS
var ImagePicker = require('NativeModules').ImagePickerManager
var Progress = require('react-native-progress')
var photoOptions = {
  title:'选择头像',
  cancelbuttonTitlw:'取消',
  takePhotoButtonTitle:'拍照',
  chooseFromLibraryButtonTitle:'选择相册',
  quality:0.75,
  allowsEditing:true,
  noData:false,
  storageOptions:{
    skipBackup:true,
    path:'images'
  }
};
function avatar(id,type){
  if(id.indexOf('http')>-1){
    return id
  }
  if(id.indexOf('data:image')>-1){
    return id
  }
  if(id.indexOf('avatar/')>-1){
    return config.cloudinary.base + '/' + type + '/upload/' + id//cloudinary
  }
  // qiniu域名
  return 'http://o9spjqu1b.bkt.clouddn.com/' + id 
}
// es6
// import React,{Component} from 'react'
// import {AppRegistry,StyleSheet,Text,View} from 'react-native'


var Account = React.createClass({
  getInitialState(){
    var user = this.props.user || {}
    return{
      user:user,
      avatarProgress:0,
      avatarUploading:false,
      modalVisible:false,
    }
  },
  _edit(){
    this.setState({modalVisible:true})
  },
  _closeModal(){
    this.setState({modalVisible:false})
  },
  componentDidMount(){
    var that = this
    AsyncStorage.getItem('user')
    .then((data)=>{
      var user  
      if(data){
        user = JSON.parse(data)
      }
      // user.avatar = ''
      // AsyncStorage.setItem('user',JSON.stringify(user))
      if(user && user.accessToken){
        that.setState({
          user:user
        })
      }
    })
  },
  // _getQiniuToken(accessToken,key){
  _getQiniuToken(){
    var accessToken = this.state.user.accessToken 
    var signatureURL = config.api.base2 + config.api.signature
    return request.post(signatureURL,{
      accessToken:accessToken,
      // key:key,
      type:'avatar',
      cloud:'qiniu',
    })
    .catch((err)=>{console.log(err)})
  },
  _pickPhoto(){
    var that = this
    ImagePicker.showImagePicker(photoOptions,(response)=>{
      if(response.didCancel){
        return
      }
      var avatarData = 'data:image/jpeg;base64,'+response.data
      var uri = response.uri
      // var key = uuid.v4() + '.jpeg'
      // that._getQiniuToken(accessToken,key).then((data)=>{
      that._getQiniuToken().then((data)=>{
        if(data && data.success){
          // var token = data.data
          var token = data.data.token
          var key = data.data.key
          var body = new FormData()
          body.append('token',token)
          body.append('key',key)
          body.append('file',{
            type:'image/jpeg',
            uri:uri,
            name:key
          })
          that._upload(body)
        }
      })
      // request.post(signatureURL,{
      //   accessToken:accessToken,
      //   timestamp:timestamp,
      //   key:key,
      //   type:'avatar'
      // })
      // .catch((err)=>{console.log(err)})
      // .then((data)=>{
      //   if(data && data.success){
      //     // data.data
      //     // var signature = 'folder=' + folder +'&tags=' + tags + '&timestamp=' + timestamp + CLOUDINARY.api_secret
      //     // signature = sha1(signature)
      //     var signature = data.data
      //     var body = new FormData()
      //     body.append('folder',folder)
      //     body.append('signature',signature)
      //     body.append('tags',tags)
      //     body.append('timestamp',timestamp)
      //     body.append('api_key',CLOUDINARY.api_key)
      //     body.append('resource_type','image')
      //     body.append('file',avatarData)
      //     that._upload(body)
      //   }
      // })
    })
  },
  _upload(body){
    var that = this
    var xhr = new XMLHttpRequest()
    var url = config.qiniu.upload
    this.setState({
      avatarUploading:true,
      avatarProgress:0
    })
    xhr.open('POST',url)
    xhr.onload = () =>{
      if(xhr.status !==200){
        AlertIOS.alert('请求失败')
        console.log(xhr.responseText)
        return
      }
      if(!xhr.responseText){
        AlertIOS.alert('请求失败')
        return
      }
      var response
      try{
        response = JSON.parse(xhr.response)
      }catch(e){
        console.log('parse fails')
      }
      if(response){
        var user = this.state.user
        if (response.public_id){//cloud
          user.avatar = response.public_id
        }
        if(response.key){
          user.avatar = response.key
        }
        that.setState({
          avatarUploading:false,
          avatarProgress:0,
          user:user
        })
      }
        that._asyncUser(true)
    }
    if(xhr.upload){
      xhr.upload.onprogress = (event)=>{
        if(event.lengthComputable){
          var percent = Number((event.loaded / event.total).toFixed(2))
          that.setState({
            avatarProgress:percent,
          })
        }
      }
    }
    xhr.send(body)
  },
  _asyncUser(isAvatar){
    var that = this
    var user = this.state.user
    if(user && user.accessToken){
      var url = config.api.base + config.api.updated
      // if(public_id){
      //   user.avatar = user
      // }
      request.post(url,user)
      .then((data)=>{
        if(data && data.success){
          var user = data.data
          if(isAvatar){
            AlertIOS.alert('头像更新成功')  
          }
          that.setState({
            user:user
          },function(){
            that._closeModal()
            AsyncStorage.setItem('user',JSON.stringify(user))
          })
        }
      })
    }
  },
  _changeUserState(key,value){
    var user = this.state.user
    user[key] = value
    this.setState({
      user:user
    })
  },
  _submit(){
    this._asyncUser()
  },
  _logout(){
    this.props.logout()
  },
  render(){
    var user = this.state.user
    return (
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>狗狗的账户</Text>
          <Text style={styles.toolbarExtra} onPress={this._edit}>编辑</Text>
        </View>
        {
          user.avatar
          ?<TouchableOpacity onPress={this._pickPhoto} style={styles.avatarContainer}>
              <Image source={{uri:avatar(user.avatar,'image')}} style={styles.avatarContainer} >
                <View style={styles.avatarBox}>
                  {
                    this.state.avatarUploading
                    ?<Progress.Circle size={75} showsText={true} color={'#ee735c'} progress={this.state.avatarProgress} indeterminate={true} />
                    :<Image source={{uri:avatar(user.avatar,'image')}} style={styles.avatar} />
                  }
                  
                </View>
                <Text style={styles.avatarTip}>戳这里换头像</Text>
              </Image>
            </TouchableOpacity>
            :<TouchableOpacity onPress={this._pickPhoto} style={styles.avatarContainer}>
              <Text style={styles.avatarTip}>添加狗狗头像</Text>
              <View style={styles.avatarBox}>
                {
                  this.state.avatarUploading
                  ?<Progress.Circle size={75} showsText={true} color={'#ee735c'} progress={this.state.avatarProgress} indeterminate={true} />
                  :<Icon name='ios-cloud-upload-outline' style={styles.plusIcon} />
                }
              </View>
            </TouchableOpacity>
        }
        <Modal animated={true} visible={this.state.modalVisible}> 
          <View style={styles.modalContainer}>
            <Icon name='ios-close-outline' style={styles.closeIcon} onPress={this._closeModal} />
            <View style={styles.fieldItem}>
              <Text style={styles.label}>昵称</Text>
              <TextInput 
                placeholder={'输入你的昵称'}
                style={styles.inputField}
                autoCapitalize={'none'}
                autoCorrect={false}
                defaultValue={user.nickname}
                onChangeText={(text)=>{
                  this._changeUserState('nickname',text)
                }}
              />
            </View>
            <View style={styles.fieldItem}>
              <Text style={styles.label}>品种</Text>
              <TextInput 
                placeholder={'输入狗狗品种'}
                style={styles.inputField}
                autoCapitalize={'none'}
                autoCorrect={false}
                defaultValue={user.breed}
                onChangeText={(text)=>{
                  this._changeUserState('breed',text)
                }}
              />
            </View>
            <View style={styles.fieldItem}>
              <Text style={styles.label}>年龄</Text>
              <TextInput 
                placeholder={'输入狗狗年龄'}
                style={styles.inputField}
                autoCapitalize={'none'}
                autoCorrect={false}
                defaultValue={user.age}
                onChangeText={(text)=>{
                  this._changeUserState('age',text)
                }}
              />
            </View>
            <View style={styles.fieldItem}>
              <Text style={styles.label}>性别</Text>
              <Icon.Button name='ios-paw' style={[styles.gender,user.gender === 'male' && styles.genderChecked]}
                onPress={()=>{
                  this._changeUserState('gender','male')
                }} >男</Icon.Button>
              <Icon.Button name='ios-paw-outline' style={[styles.gender,user.gender === 'female' && styles.genderChecked]}
                onPress={()=>{
                  this._changeUserState('gender','female')
                }} >女</Icon.Button>
            </View>
            <Button style={styles.btn} onPress={this._submit}>保存资料</Button> 
          </View>
        </Modal>
            <Button style={styles.btn} onPress={this._logout}>登出</Button> 
      </View>
    )
  }
})

var styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  toolbar:{
    flexDirection: 'row',
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: '#ee735c', 
  },
  toolbarTitle:{
    flex:1,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  toolbarExtra:{
    position: 'absolute',
    right: 10,
    top:26,
    color:'#fff',
    textAlign:'right',
    fontSize:14,
    fontWeight:'600'
  },
  avatarContainer:{
    width:width,
    height: 140,
    backgroundColor:'#666',
    justifyContent:'center',
    alignItems: 'center',
  },
  avatarTip:{
    color:'#fff',
    backgroundColor:'transparent',
    fontSize:14,
  },
  avatarBox:{
    marginTop: 15,
    alignItems:'center',
    justifyContent:'center',
  },
  avatar:{
    width:width*0.2,
    height:width*0.2,
    resizeMode:'cover',
    borderRadius:width*0.1,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
  },
  plusIcon:{
    padding: 20,
    paddingLeft: 25,
    paddingRight: 25,
    color:'#999',
    fontSize:24,
    backgroundColor:'#fff',
    borderRadius: 8,
  },
  modalContainer:{
    flex:1,
    paddingTop:50,
    backgroundColor:'#fff',
  },
  fieldItem:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    height:50,
    paddingLeft:15,
    paddingRight:15,
    borderColor:'#eee',
    borderWidth:1
  },
  closeIcon:{
    position:'absolute',
    width:40,
    height:40,
    fontSize:32,
    right:20,
    top:30,
    color:'#ee735c'
  },
  label:{
    color:'#ccc',
    marginRight: 10
  },
  gender:{
    backgroundColor:'#ccc'
  },
  genderChecked:{
    backgroundColor:'#ee735c'
  },
  inputField:{
    flex:1,
    height:50,
    color:'#666',
    fontSize:14,
  },
  btn:{
    marginTop:25,
    marginLeft: 20,
    marginRight:20,
    padding:10,
    color:'#fff',
    backgroundColor:'#ee735c',
    borderColor: '#ee735c',
    borderWidth: 1,
    borderRadius:4,
    color:'#ee735c',
  },
})
module.exports = Account;
