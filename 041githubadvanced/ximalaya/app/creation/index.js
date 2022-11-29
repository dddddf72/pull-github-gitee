// es5
var React = require('react-native')
var Icon = require('react-native-vector-icons/Ionicons')
// var Mock = require('mockjs')
var request = require('../common/request')
var config = require('../common/config')
var Component = React.Component
var AppRegistry = React.AppRegistry
var StyleSheet = React.StyleSheet
var Text = React.Text
var Image = React.Image
var View = React.View
var ListView = React.ListView
var TouchableHighlight = React.TouchableHighlight
var RefreshControl = React.RefreshControl
var Dimensions = React.Dimensions
var ActivityIndicatorIOS = React.ActivityIndicatorIOS
var AlertIOS = React.AlertIOS
var width = Dimensions.get('window').width
var cachedResults = {
  nextPage: 1,
  items: [],
  total: 0
}
// es6
// import React,{Component} from 'react'
// import {AppRegistry,StyleSheet,Text,View} from 'react-native'
var Item  = React.createClass({
  getInitialState(){
    var row = this.props.row
    return{
      row:row,
      up:row.voted
    }
  },
  _up(){
    var that = this
    var up = !this.state.up
    var row = this.state.row
    var url = config.api.base + config.api.up
    var body = {
      id:row._id,
      up:up?'yes':'no',
      accessToken:'abcee'
    }
    request.post(url,body) 
      .then(function(data){
        if(data && data.success){
          that.setState({
            up:up
          })
        }else{
          AlertIOS.alert('点赞失败，稍后重试')
        }
      })
      .catch(function(err){
        console.warn(err);
        AlertIOS.alert('点赞失败')
      })
  },
  render(){
    var row = this.state.row
    return(
      <TouchableHighlight onPress={this.props.onSelect}>
        <View style={styles.item}>
          <Text style={styles.title}>{row.title}</Text>
          <Image source={{ uri: row.thumb }} style={styles.thumb} />
          <Icon name='ios-play' size={28} style={styles.play} />
          <View style={styles.itemFooter}>
            <View style={styles.handleBox}>
              <Icon onPress={this._up} name={this.state.up ? 'ios-heart' : 'ios-heart-outline'} size={28} style={[styles.up,this.state.up ? null : styles.down]} />
              <Text style={styles.handleText} onPress={this._up}>喜欢</Text>
            </View>
            <View style={styles.handleBox}>
              <Icon name='ios-chatboxes-outline' size={28} style={styles.commentIcon} />
              <Text style={styles.handleText}>评论</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
})
var List = React.createClass({
  getInitialState () {
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })
    return {
      isRefreshing: false,
      isLoadingTail: false,
      dataSource: ds.cloneWithRows([]),
      // dataSource:ds.cloneWithRows([
      //   {
      //     "_id": "220000197104233910",
      //     "thumb": "http://dummyimage.com/1200*600/c3f279)",
      //     "video": "\"https://www.runoob.com/try/demo_source/mov_bbb.mp4\"",
      //     "title": "Dnsg Pjcb Pxxe Ptmhvmbsib Sqfheyr"
      //     },
      //     {
      //     "_id": "640000197710151892",
      //     "thumb": "http://dummyimage.com/1200*600/f279e6)",
      //     "video": "\"https://www.runoob.com/try/demo_source/mov_bbb.mp4\"",
      //     "title": "Hfhvnfty Vluvy Hrtxqwg Rleov Rojcgtp"
      //     },
      //     {
      //     "_id": "230000200408264528",
      //     "thumb": "http://dummyimage.com/1200*600/79f2da)",
      //     "video": "\"https://www.runoob.com/try/demo_source/mov_bbb.mp4\"",
      //     "title": "Phdk Gafo Kqrgw Qauvm Rtoemdym"
      //     },
      // ]),

    }
  },
  _renderRow(row) {
    return (
      <Item key={row._id} onSelect={()=>this._loadPage(row)} row={row} />
    )
  },
  componentDidMount () {
    this._fetchData(1)
  },
  _fetchData (page) {
    var that = this
    if(page !==0){
      this.setState({
        isLoadingTail: true
      })
    }else{
      this.setState({
        isRefreshing:true
      })
    }
    request.get(config.api.base + config.api.creations, {
      accessToken: 'abcdef',
      page: page
    })
      .then((data) => {
        if (data.success) {
          var items = cachedResults.items.slice()
          if(page!==0){
            items = items.concat(data.data)
            cachedResults.nextPage +=1
          }else{
            items = data.data.concat(items)
          }
          cachedResults.items = items
          cachedResults.total = data.total
          setTimeout(() => {
            if(page !==0){
              that.setState({
                isLoadingTail: false,
                dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
              })
            }else{
              that.setState({
                isRefreshing: false,
                dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
              })
            }
          }, 2000);
        }
      })
      .catch((error) => {
        console.warn(error);
        if(page !==0){
          this.setState({
            isLoadingTail: false,
          })
        }else{
          this.setState({
            isRefreshing: false,
          })
        }
      });
  },
  _hasMore () {
    return cachedResults.items.length !== cachedResults.total
  },
  _fetchMoreData () {
    if (!this._hasMore() || this.state.isLoadingTail) {
      return
    }
    var page = cachedResults.nextPage
    this._fetchData(page)
  },
  _onRefresh(){
    if(!this._hasMore() || this.state.isRefreshing){
      return
    }
    this._fetchData(0)
  },
  _renderFooter(){
    if (!this._hasMore() && cachedResults.total !==0) {
      return (
        <View style={styles.loadingMore}>
          <Text style={styles.loadingText}>没有更多啦</Text>
        </View>
      )
    }
    if(!this.state.isLoadingTail){
      return <View style={styles.loadingMore} />
    }
    return <ActivityIndicatorIOS 
      style={styles.loadingMore}
    />
  },
  _loadPage(){
    this.props.navigator.push({
      name:'detail',
      component:Detail,
      params:{
        data:row
      }
    })
  },
  render () {
    return (
      <View>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>列表页面</Text>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          onEndReached={this._fetchMoreData}
          onEndReachedThreshold={20}
          refreshControl={<RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this._onRefresh}
            tintColor='#ff6600'
            title="拼命加载中"
            />}
          renderFooter={this._renderFooter}
          enableEmptySections={true}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
        />
      </View>
    )
  }
})

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  header: {
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: '#ee735c'
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  item: {
    width: width,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  thumb: {
    width: width,
    height: width * 0.56,
    resizeMode: 'cover',
  },
  title: {
    padding: 10,
    fontSize: 18,
    color: '#333',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eee',
  },
  handleBox: {
    padding: 10,
    flexDirection: 'row',
    width: width / 2 - 0.5,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  play: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 46,
    height: 46,
    paddingTop: 9,
    paddingLeft: 18,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 23,
    color: '#ed7b66',
  },
  handleText: {
    paddingLeft: 12,
    fontSize: 18,
    color: '#333',
  },
  up: {
    fontSize: 22,
    color: '#ed7b66'
  },
  down: {
    fontSize: 22,
    color: '#333'
  },
  commentIcon: {
    fontSize: 22,
    color: '#333',
  },
  loadingMore:{
    marginVertical:20,
  },
  loadingText:{
    color:'#777',
    textAlign:'center'
  },
})
module.exports = List;
