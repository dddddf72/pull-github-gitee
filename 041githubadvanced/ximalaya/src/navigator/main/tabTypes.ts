import { StackNavigationProp } from '@react-navigation/stack'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'

export type MainTabType = 'More'

export type TabBarIconType = {
  focused: boolean
  color: string
  size: number
}

export type RootStackParamList = {
  MainTabs: undefined 
}

export type RootNavigationProp = StackNavigationProp<RootStackParamList>

