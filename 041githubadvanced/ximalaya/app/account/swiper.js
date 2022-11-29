// es5
var React = require('react-native')
var Swiper = require('react-native-swiper')

var TouchableOpacity = React.TouchableOpacity
var Icon = require('react-native-vector-icons/Ionicons')
var _ = require('lodash')

const config = require('../common/config')
const request = require('../common/request')
var Dimensions = React.Dimensions
var width = Dimensions.get('window').width
var height = Dimensions.get('window').height
var StyleSheet = ReactNative.StyleSheet
var View = ReactNative.View
var Image = ReactNative.Image
var ImagePicker = require('NativeModules').ImagePickerManager
var Button = require('react-native-button')
var Text = ReactNative.Text
var TextInput = ReactNative.TextInput
var AlertIOS = React.AlertIOS
var AsyncStorage = ReactNative.AsyncStorage
var ProgressViewIOS = ReactNative.ProgressViewIOS
var Modal = React.Modal
var Progress = require('react-native-progress')
var Video = require('react-native-video').default//这种方式叫做默认导出

var CountDown = require('react-native-sk-countdown').CountDownText

var Slider = React.createClass({
  getInitialState(){
    return{
      loop:true,
      banners:[
        require('../assets/images/'),
        require('../assets/images/'),
        require('../assets/images/')
      ],
    }
  },
  enterSlide(){
    
  },
  _enter(){
    this.props.enterSlide()
  },
  render(){
    return (
        <Swiper style={styles.container} 
            dot={
              <View style={styles.dot}></View>
            }
            activeDot={<View style={styles.activeView} />}
            paginationStyle={styles.pagination}
            loop={this.state.loop}
            >
          <View style={styles.slide}>
            <Image style={styles.image} source={this.state.banners[0]} />
          </View>
          <View style={styles.slide}>
            <Image style={styles.image} source={this.state.banners[1]} />
          </View>
          <View style={styles.slide}>
            <Image style={styles.image} source={this.state.banners[2]} />
            
            <Button style={styles.btn} onPress={this._enter}>马上体验</Button> 
          </View>

        </Swiper>
    )
  }
})

var styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  slide:{
    flex:1,
    width:width
  },
  image:{
    flex:1,
    width:width
  },
  dot:{
    width:14,
    height:14,
    borderRadius:7,
    marginLeft: 12,
    marginRight: 12,
    backgroundColor:'transparent',
    borderColor:'#ff6600',
    borderWidth:1,
  },
  activeDot:{
    width:14,
    height:14,
    borderRadius:7,
    marginLeft: 12,
    marginRight: 12,
    backgroundColor:'#ee735c',
    borderColor:'#ee735c',
    borderWidth:1,
  },
  pagination:{
    bottom: 30,
  },
  btn:{
    width:width - 20,
    height:50,
    position: 'absolute',
    left: 10,
    bottom:60,
    padding:10,
    backgroundColor:'#ee735c',
    borderColor: '#ee735c',
    borderWidth: 1,
    borderRadius:3,
    fontSize: 18,
    color:'#fff',
  },

  
})
module.exports = Slider;
