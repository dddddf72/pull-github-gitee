
import { Platform, StyleSheet, StatusBar } from 'react-native';
import { HeaderStyleInterpolators,CardStyleInterpolators,TransitionSpecs } from '@react-navigation/stack';
export default {
  headerTitleAlign: 'center',
  headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  headerStatusBarHeight: StatusBar.currentHeight,
  headerStyle: {
    backgroundColor: '#21a3f1',
    ...Platform.select({
      android: {
        elevation: 0,
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
    }),
  },
  headerShown: false,
  cardStyle: { backgroundColor: 'transparent' },
  transitionSpec: {
    open: TransitionSpecs.TransitionIOSSpec,
    close: TransitionSpecs.TransitionIOSSpec,
  },
}
