
// import React from "react";
// // import { RootStackNavigation } from "navigator";
// import { RootStackNavigation } from "@/navigator/index";
// import { View, Text, Button,StyleSheet, ScrollView, FlatList, ListRenderItemInfo, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
// import { RootState } from "@/models/index";
// import { connect, ConnectedProps } from "react-redux";
// import ACarousel, { sideHeight } from "./Carousel";
// import Guess from "./Guess";
// import ChannelItem from "./ChannelItem";
// import { IChannel } from "@/models/home";

// const mapStateToProps = ({ home, loading }: RootState) => ({
//   // num: home.num,
//   carousels: home.carousels,
//   channels: home.channels,
//   // loading: loading.effects['home/asyncAdd'],
//   hasMore:home.pagination.hasMore,
//   gradientVisible:home.gradientVisible,
//   loading: loading.effects['home/fetchChannels'],

// })
// const connector = connect(mapStateToProps);
// type ModelState = ConnectedProps<typeof connector>;
// interface IProps extends ModelState {
//   navigation: RootStackNavigation;
// }

// interface IState{
//   refreshing:boolean;
// }
// class Home extends React.Component<IProps,IState> {
//   state = {
//     refreshing:false,
//   }
//   componentDidMount() {
//     const { dispatch } = this.props;
//     dispatch({
//       type: 'home/fetchCarousels',
//     });
//     dispatch({
//       type: 'home/fetchChannels',
//     });
//   };
//   onPress = (data:IChannel) => {
//     // const { navigation } = this.props;
//     // navigation.navigate('Detail', { id: 100, });
//   };
//   // handleAdd = () => {
//   //   const { dispatch } = this.props;
//   //   dispatch({
//   //     type: 'home/add',
//   //     payload: {
//   //       num: 10,
//   //     },
//   //   });
//   // };
//   // asyncAdd = () => {
//   //   const { dispatch } = this.props;
//   //   dispatch({
//   //     type: 'home/asyncAdd',
//   //     payload: {
//   //       num: 2,
//   //     },
//   //   });
//   // };
//   keyExtractor = (item:IChannel)=>{
//     return item.id
//   };
//   onRefresh = () =>{
//     this.setState({
//       refreshing:true,
//     })
//     const {dispatch} = this.props;
//     dispatch({
//       type:'home/fetchChannels',
//       callback:()=>{
//         this.setState({
//           refreshing:false,
//         })
//       }
//     });
//   };
//   onEndReached=()=>{
//     const {dispatch,loading,hasMore} = this.props;
//     if(loading || !hasMore) return;
//     dispatch({
//       type:'home/fetchChannels',
//       payload:{
//         loadMore:true,
//       }
//     });

//   };
//   renderItem = ({ item }: ListRenderItemInfo<IChannel>) => {
//     return (
//       <ChannelItem data={item} onPress={this.onPress} />
//     )
//   }
//   onScroll =({nativeEvent}:NativeSyntheticEvent<NativeScrollEvent>)=>{
//     const offsetY = nativeEvent.contentOffset.y;//窗口滚动距离
//     let newGradientVisible = offsetY<sideHeight;
//     const {dispatch,gradientVisible} = this.props;
//     if(gradientVisible !== newGradientVisible){
//       dispatch({
//         type:'home/setState',
//         payload:{
//           gradientVisible:newGradientVisible,
//         }
//       })
//     }
//   }
//   get header() {
//     // const { num, loading, carousels } = this.props;
//     return (
//       <View>
//         <Text>Home</Text>
//         {/* <Text>Home{num}</Text> */}
//         {/* <Text>{loading ? '正在努力加载中' : ''}</Text> */}
//         {/* <Button title="加" onPress={this.handleAdd} />
//         <Button title="异步加" onPress={this.asyncAdd} />
//         <Button title="跳转到详情页" onPress={this.onPress} /> */}
//         <ACarousel />
//         <View style={styles.background}>
//           <Guess />
//         </View>
//       </View>
//     )
//   }
//   get footer(){
//     const {hasMore,loading,channels} = this.props;
//     if(!hasMore){
//       return (
//         <View style={styles.end}>
//           <Text>--我是有底线的--</Text>
//         </View>
//       )
//     }
//     if(loading && hasMore && channels.length>0){
//       return (
//         <View style={styles.loading}>
//           <Text>正在加载中...</Text>
//         </View>
//       )
//     }
//   }
//   get empty(){
//     const {loading} = this.props;
//     if(loading) return;
//     return (
//       <View style={styles.empty}>
//         <Text>暂无数据</Text>
//       </View>
//     )
//   }
//   render() {
//     const { channels } = this.props;
//     const {refreshing} = this.state;
//     return (
//       <FlatList 
//         ListHeaderComponent={this.header} 
//         ListFooterComponent={this.footer}
//         ListEmptyComponent={this.empty}
//         data={channels} 
//         renderItem={this.renderItem}
//         keyExtractor={this.keyExtractor}
//         onRefresh={this.onRefresh}
//         refreshing={refreshing}
//         onEndReached={this.onEndReached}
//         onEndReachedThreshold={0.2}
//         onScroll={this.onScroll}
//       />
//     );
//   }
// }
// const styles = StyleSheet.create({
//   end:{
//     alignItems: 'center',
//     paddingVertical:10,
//   },
//   loading:{
//     alignItems: 'center',
//     paddingVertical:10,
//   },
//   empty:{
//     alignItems: 'center',
//     paddingVertical:100,
//   },
//   background:{
//     backgroundColor:'#fff'
//   },
// })
// export default connector(Home)




import React from "react";
// import { RootStackNavigation } from "navigator";
import { RootStackNavigation } from "@/navigator/index";
import { View, Text, Button } from "react-native";
interface IProps {
  navigation:RootStackNavigation
}
class Home extends React.Component<IProps> {
  onPress = ()=>{
    const {navigation} = this.props;
    navigation.navigate('Detail',{id:100, })

  }
  render() {
    return (
      <View>
        <Text>Home</Text>
        <Button title="跳转到详情页" onPress={this.onPress}></Button>
      </View>
    )
  }
}
export default Home

