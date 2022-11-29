var React = require('react-native')
var Component = React.Component
var Icon = require('react-native-vector-icons/Ionicons')
var StyleSheet = ReactNative.StyleSheet
var Text = ReactNative.Text
var TextInput = ReactNative.TextInput
var View = ReactNative.View
var AsyncStorage = ReactNative.AsyncStorage
var Button = require('react-native-button')
var request = require('../common/request')
const config = require('../common/config')
var AlertIOS = React.AlertIOS


var CountDown = require('react-native-sk-countdown').CountDownText
var Login = React.createClass({
  getInitialState(){
    return{
      phoneNumber:'',
      verifyCode:'',
      codeSent:false,
      countingDone:false,
    }
  },
  _showVerifyCode(){
    this.setState({
      codeSent:true
    })

  },
  _sendVerifyCode(){
    var that = this
    var phoneNumber = this.state.phoneNumber
    if(!phoneNumber){
      return AlertIOS.alert('手机号不能为空')
    }
    var body = {
      phoneNumber:phoneNumber
    }
    var signupUrl = config.api.base + config.api.signup
    request.post(signupUrl,body)
    .then((data)=>{
      if(data && data.success){
        that._showVerifyCode()
      }else{
        AlertIOS.alert('获取验证码失败，请检查手机号是否正确')
      }
    })
    .catch((err)=>{
      AlertIOS.alert('获取验证码失败，请检查网络是否良好')
    })
  },
  _submit(){
    var that = this;
    var phoneNumber = this.state.phoneNumber
    var verifyCode = this.state.verifyCode
    if(!phoneNumber || !verifyCode){
      return AlertIOS.alert('手机号或验证码不能为空')
    }
    var body = {
      phoneNumber:phoneNumber,
      verifyCode:verifyCode
    }
    var verifyURL = config.api.base + config.api.verify
    request.post(verifyURL,body).then((data)=>{
      if(data && data.success){
        console.log(data)
        that.props.afterLogin(data.data)
      }else{
        AlertIOS.alert('获取验证码失败，请检查手机号是否正确')
      }
    }).catch((err)=>{
      AlertIOS.alert('获取验证码失败，请检查网络是否良好')
    })
  },
  render(){
    return (
      <View style={styles.container}>
        <View style={styles.signupBox}>
          <Text style={styles.title}>快速登录</Text>
          <TextInput 
            placeholder='请输入手机号'
            autoCaptialize={'none'}
            autoCurrect={false}
            keyboardType={'number-pad'}
            style={styles.inputField}
            onChangeText={(text)=>{
              this.setState({
                phoneNumber:text
              })
            }}
          />
          {this.state.codeSent 
            ?<View style={styles.verifyCodeBox}>
              <TextInput 
                placeholder='请输入验证码'
                autoCaptialize={'none'}
                autoCurrect={false}
                keyboardType={'number-pad'}
                style={styles.inputField}
                onChangeText={(text)=>{
                  this.setState({
                    verifyCode:text
                  })
                }}
              />
              {
                this.state.countingDone
                ? <Button style={styles.countBtn} 
                onPress={this._sendVerifyCode}>获取验证码</Button>
                : <CountDown
                    style={styles.countBtn}
                    countType='seconds'
                    auto={true}
                    afterEnd={this._countingDone}
                    timeLeft={60}
                    step={-1}
                    startText='获取验证码'
                    endText='获取验证码'
                    intervalText={(sec)=>'剩余秒数：'+sec}
                  />
              }
            </View>
            :null
          }
          {this.state.codeSent 
            ? <Button style={styles.btn} onPress={this._submit}>登录</Button> 
            : <Button style={styles.btn} onPress={this._sendVerifyCode}>获取验证码</Button>
          }
        </View>
      </View>
    )
  }
})

var styles = StyleSheet.create({
  container:{
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9', 
  },
  signupBox:{
    marginTop: 30,
  },
  title:{
    marginBottom: 20,
    color: '#333',
    fontSize: 20,
    textAlign: 'center',
  },
  inputField:{
    flex:1,
    height: 40,
    padding:5,
    color:'#666',
    fontSize:16,
    backgroundColor:'#fff',
    borderRadius: 4
  },
  btn:{
    marginTop:10,
    padding:10,
    color:'#fff',
    backgroundColor:'#ee735c',
    borderColor: '#ee735c',
    borderWidth: 1,
    borderRadius:4,
    color:'#ee735c',
  },
  verifyCodeBox:{
    marginTop:10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  countBtn:{
    width: 110,
    height:40,
    padding:10,
    marginLeft: 8,
    backgroundColor:'transparent',
    borderColor:'#ee735c',
    textAlign:'left',
    fontWeight: '600',
    fontSize:15,
    borderRadius:2,
  },
})
module.exports = Login;
