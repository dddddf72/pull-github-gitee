import React from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "@/models/index";
import { IGuess } from "@/models/home";
import Touchable from "@/components/Touchable";
import Icon from "@/assets/iconfont";
const mapStateToProps = ({ home }: RootState) => {
  return {
    guess: home.guess,
  };
};
const connector = connect(mapStateToProps);
type ModelState = ConnectedProps<typeof connector>
class Guess extends React.Component<ModelState>{
  // componentDidMount(){
  //   this.fetch();
  // };
  fetch = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/fetchGuess',
    });
  };
  renderItem = ({ item }: { item: IGuess }) => {
    return (
      <Touchable style={styles.item} onPress={() => { alert('点击') }}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text numberOfLines={2}>{item.title}</Text>
      </Touchable>
    )
  }
  render() {
    const { guess } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Icon name="icon-fuwu" />
            <Text style={styles.headerTitle}>猜你喜欢</Text>
          </View>
          <View style={styles.headerRight}>
            <Icon name="icon-fuwu" />
            <Text style={styles.moreText}>更多</Text>
          </View>
        </View>
        <FlatList style={styles.list} numColumns={3} data={guess} renderItem={this.renderItem}></FlatList>
        {/* <Touchable style={styles.changeGuess} onPress={() =>{}}> */}
        <Touchable style={styles.changeGuess} onPress={this.fetch}>
          <Icon name="icon-fuwu" color="red" />
          <Text style={styles.changeGuessText}>换一批</Text>
        </Touchable>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
  },
  item: {
    flex: 1,
    marginVertical: 6,
    marginHorizontal: 10,
  },
  image: {
    height: 100,
    width: '100%',
    borderRadius: 8,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomColor: '#efefef',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  headerTitle: {
    marginLeft: 5,
    color: '#333'
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreText: {
    color: '#6f6f6f'
  },
  list: {
    padding: 10,
  },
  changeGuess: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  changeGuessText: {
    marginRight: 5,
  },

})
export default connector(Guess);
