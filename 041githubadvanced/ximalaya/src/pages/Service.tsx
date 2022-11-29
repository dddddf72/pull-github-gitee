import React from "react";
import { RootStackNavigation } from "navigator";
// import { RootStackNavigation } from "@/navigator/index";
import { View, Text, Button } from "react-native";
interface IProps {
  navigation: RootStackNavigation
}
class Service extends React.Component<IProps> {

  render() {
    return (
      <View>
        <Text>服务</Text>
      </View>
    )
  }
}
export default Service
