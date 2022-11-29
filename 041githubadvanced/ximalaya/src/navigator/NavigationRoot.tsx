import React, { memo } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import defaultScreenOptions from './defaultScreenOptions'
import MainTabNavigator from './main/MainTabNavigator'
const MainStack = createStackNavigator()

const NavigationRoot = () => {
  
  return (
    <MainStack.Navigator screenOptions={defaultScreenOptions}>
      <MainStack.Screen name="MainTabNavigator" component={MainTabNavigator} />
    </MainStack.Navigator>
  )
}

export default memo(NavigationRoot)
