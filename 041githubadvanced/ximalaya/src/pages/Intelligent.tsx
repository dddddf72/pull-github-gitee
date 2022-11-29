import React from "react";
import { createMaterialTopTabNavigator,MaterialTopTabBar, MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import Home from '@/pages/Home';
import { StyleSheet,View } from "react-native";
import TopTabBarWrapper from "@/pages/views/TopTabBarWrapper";


const FTab = createMaterialTopTabNavigator();
class Listens extends React.Component {
  renderTabBar = (props:MaterialTopTabBarProps) =>{
    return <TopTabBarWrapper {...props} />
  };
  render() {
    return (
      <FTab.Navigator
        lazy={true}
        tabBar={this.renderTabBar}
        sceneContainerStyle={styles.sceneContainer}
        tabBarOptions={{
          scrollEnabled: true,
          tabStyle: {
            width: 80,
            padding: 0,
          },
          indicatorStyle: {
            height: 4,
            width: 20,
            marginLeft: 30,
            borderRadius: 2,
            backgroundColor: '#21a3f1',
          },
          activeTintColor: '#21a3f1',
          inactiveTintColor: '#333'
        }}
      >
        <FTab.Screen name="home" component={Home} options={{ tabBarLabel: '影视' }} />
        <FTab.Screen name="home1" component={Home} options={{ tabBarLabel: '特色' }} />
      </FTab.Navigator>
    )
  }
}
const styles = StyleSheet.create({
  sceneContainer:{
    backgroundColor: 'transparent',
  },
})
export default Listens;
