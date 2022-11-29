import React, {  memo, useMemo, useCallback } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { TabBarIconType, MainTabType } from './tabTypes'
import TabBarIcon from './TabBarIcon'
import { useColors } from '../../theme/themeHooks'
import { wp } from '../../utils/index'
import defaultScreenOptions from '@/navigator/defaultScreenOptions'


import Icon from "@/assets/iconfont";
import Listens from '@/navigator/Listens'
import Intelligent from "@/pages/Intelligent";
import Service from "@/pages/Service";
import Activity from "@/pages/Activity";


const MainTab = createBottomTabNavigator()

const MainTabs = () => {
  const { surfaceContrast } = useColors()

  const tabBarOptions = useMemo(
    () => ({
      showLabel: false,
      style: {
        backgroundColor: surfaceContrast,
        paddingHorizontal: wp(12),
      },
      "tabBarShowLabel": false,
      "tabBarStyle": [
        {
          "display": "flex"
        },
        null
      ]
    }),
    [surfaceContrast],
  )

  return (
    <MainTab.Navigator
      initialRouteName="Intelligent"
      screenOptions={defaultScreenOptions}
    >
        <MainTab.Screen name="Intelligent" component={Intelligent} options={{ tabBarLabel: '智能', tabBarIcon: ({ color, size }) => <Icon name="icon-fuwu" color={color} size={size} /> }} />
        <MainTab.Screen name="Listens" component={Listens} options={{ tabBarLabel: '视听', tabBarIcon: ({ color, size }) => <Icon name="icon-shouye" color={color} size={size} /> }} />
        <MainTab.Screen name="Service" component={Service} options={{ tabBarLabel: '服务', tabBarIcon: ({ color, size }) => <Icon name="icon-fuwu1" color={color} size={size} /> }} />
        <MainTab.Screen name="Activity" component={Activity} options={{ tabBarLabel: '活动', tabBarIcon: ({ color, size }) => <Icon name="icon-huodong" color={color} size={size} /> }} />
    </MainTab.Navigator>
  )
}
export default memo(MainTabs)
