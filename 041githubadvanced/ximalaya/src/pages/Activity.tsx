import React from "react";
import { RootStackNavigation } from "navigator";
// import { RootStackNavigation } from "@/navigator/index";
import { View, Text, Button } from "react-native";
interface IProps {
  navigation: RootStackNavigation
}
class Activity extends React.Component<IProps> {
  onPress = () => {
    const { navigation } = this.props;
    navigation.navigate('Detail', { id: 100, })

  }
  render() {
    return (
      <View>
        <Text>Activity</Text>
        <Button title="跳转到详情页" onPress={this.onPress}></Button>
      </View>
    )
  }
}
export default Activity
