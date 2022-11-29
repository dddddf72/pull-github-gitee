import React from "react";
import { View,Text,StyleSheet } from "react-native";
import { MaterialTopTabBar, MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import {getStatusBarHeight} from 'react-native-iphone-x-helper'
// import LinearGradient from "react-native-linear-gradient";
import LinearAnimatedGradientTransition from "react-native-linear-animated-gradient-transition";
import Touchable from "@/components/Touchable";
import {RootState} from '@/models/index';
import {connect, ConnectedProps} from 'react-redux';
const mapStateToProps = ({home}:RootState)=>{
  return {
    gradientVisible:home.gradientVisible,
    linearColors:home.carousels && home.carousels.length>0
      ? (home.carousels[home.activeCarouselIndex] ? home.carousels[home.activeCarouselIndex].colors : undefined)
      : undefined,
  }
}
const connector = connect(mapStateToProps);
type ModelState = ConnectedProps<typeof connector>;

// interface IProps extends MaterialTopTabBarProps {
type IProps = MaterialTopTabBarProps & ModelState;
class TopTabBarWrapper extends React.Component{
  goCategory = () => {
    const {navigation} = this.props;
    navigation.navigate('Category');
  }
  render() {
    let {gradientVisible,indicatorStyle,...restProps} = this.props;
    let textStyle = styles.text;
    let activeTintColor = '#333';
    if(gradientVisible){
      textStyle = styles.whiteText;
      activeTintColor = '#fff';
      if(indicatorStyle){
        indicatorStyle = StyleSheet.compose(indicatorStyle,StyleSheet.whiteBackgroundColor)
      }
    }
      return(
        <View style={styles.container}>
          <View style={styles.tabTabBarView}>
           <MaterialTopTabBar {...restProps} indicatorStyle={indicatorStyle} activeTintColor={activeTintColor} style={styles.tabbar} />
           <Touchable style={styles.categoryBtn} onPress={this.goCategory}>
             <Text style={textStyle}>分类</Text>
           </Touchable>
           <View style={styles.bottom}>
             <Touchable style={styles.searchBtn}>
               <Text style={textStyle}>搜索记录</Text>
             </Touchable>
             <Touchable style={styles.historyBtn}>
               <Text style={textStyle}>历史记录</Text>
             </Touchable>
           </View>

         </View>
        </View>
      )
  }
}
// class TopTabBarWrapper extends React.Component<IProps>{
//   goCategory = () => {
//     const {navigation} = this.props;
//     navigation.navigate('Category');

//   }
//   get linearGradient(){
//     const {gradientVisible,linearColors = ['#ccc','#e2e2e2']} = this.props;
//     if(gradientVisible){
//       return <LinearAnimatedGradientTransition colors={linearColors} style={styles.gradient} />
//     }
//     return null;
//   }
//   render() {
//     let {gradientVisible,indicatorStyle,...restProps} = this.props;
//     let textStyle = styles.text;
//     let activeTintColor = '#333';
//     if(gradientVisible){
//       textStyle = styles.whiteText;
//       activeTintColor = '#fff';
//       if(indicatorStyle){
//         indicatorStyle = StyleSheet.compose(indicatorStyle,StyleSheet.whiteBackgroundColor)
//       }
//     }
//     return (
//       <View style={styles.container}>
//         {this.linearGradient}
//         <View style={styles.tabTabBarView}>
//           <MaterialTopTabBar {...restProps} indicatorStyle={indicatorStyle} activeTintColor={activeTintColor} style={styles.tabbar} />
//           <Touchable style={styles.categoryBtn} onPress={this.goCategory}>
//             <Text style={textStyle}>分类</Text>
//           </Touchable>
//           <View style={styles.bottom}>
//             <Touchable style={styles.searchBtn}>
//               <Text style={textStyle}>搜索记录</Text>
//             </Touchable>
//             <Touchable style={styles.historyBtn}>
//               <Text style={textStyle}>历史记录</Text>
//             </Touchable>
//           </View>

//         </View>
//       </View>
//     )
//   }
// }
const styles = StyleSheet.create({
  container:{
    backgroundColor: '#21a3f1', height: 100,
    paddingTop: getStatusBarHeight(),
  },
  gradient:{
    ...StyleSheet.absoluteFillObject,
    height: 260,
  },
  tabbar:{
    flex: 1, 
    elevation:0,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  tabTabBarView:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottom: {
    flexDirection: 'row',
    paddingVertical:7,
    paddingHorizontal:15,
    alignItems: 'center'
  },
  categoryBtn:{
    paddingHorizontal:10,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#ccc',
  },
  searchBtn:{
    // flex: 1,
    paddingLeft: 12,
    height: 30,
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  historyBtn:{
    marginLeft: 24,
  },
  text:{
    color:'#333'
  },
  whiteText:{
    color:'#fff'
  },
  whiteBackgroundColor:{
    backgroundColor:'#fff'
  },
})
// export default connector(TopTabBarWrapper);
export default TopTabBarWrapper;
