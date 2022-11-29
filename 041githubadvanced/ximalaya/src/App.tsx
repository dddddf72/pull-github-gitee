import 'react-native-gesture-handler'
import React, { useEffect, useMemo } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import {
  LogBox,
  Platform,
  StatusBar,
  UIManager,
  useColorScheme,
} from 'react-native'
import useAppState from 'react-native-appstate-hook'
import { ThemeProvider } from '@shopify/restyle'
import { useSelector } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { theme, darkThemeColors, lightThemeColors } from './theme/theme'
import NavigationRoot from './navigator/NavigationRoot'
import { useAppDispatch } from './store/store'
import appSlice from './store/user/appSlice'
import { RootState } from './store/rootReducer'
import { navigationRef } from './navigator/navigator'



const App = () => {
  const colorScheme = useColorScheme()

  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }
  }

  LogBox.ignoreLogs([
    "Accessing the 'state' property of the 'route' object is not supported.",
    'Setting a timer',
    'Calling getNode() on the ref of an Animated component',
    'Native splash screen is already hidden',
    'No Native splash screen',
    'RCTBridge required dispatch_sync to load',
    'Require cycle',
    'new NativeEventEmitter',
    'EventEmitter.removeListener(',
    'Internal React error:',
  ])

  const { appState } = useAppState()
  const dispatch = useAppDispatch()

  const {
    lastIdle,
    isPinRequired,
    authInterval,
    isRestored,
    isRequestingPermission,
    isLocked,
  } = useSelector((state: RootState) => state.app)



  // handle app state changes
  useEffect(() => {
    if (appState === 'background' && !isLocked) {
      dispatch(appSlice.actions.updateLastIdle())
      return
    }

    const isActive = appState === 'active'
    const now = Date.now()
    const expiration = now - authInterval
    const lastIdleExpired = lastIdle && expiration > lastIdle

    // pin is required and last idle is past user interval, lock the screen
    const shouldLock =
      isActive && isPinRequired && !isRequestingPermission && lastIdleExpired

    if (shouldLock) {
      dispatch(appSlice.actions.lock(true))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState])



  const colorAdaptedTheme = useMemo(
    () => ({
      ...theme,
      colors: colorScheme === 'light' ? lightThemeColors : darkThemeColors,
    }),
    [colorScheme],
  )

  return (
        <ThemeProvider theme={colorAdaptedTheme}>
            <SafeAreaProvider>
              {/* TODO: Will need to adapt status bar for light/dark modes */}
              {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
              {Platform.OS === 'android' && (
                <StatusBar translucent backgroundColor="transparent" />
              )}
              <NavigationContainer ref={navigationRef}>
                  <NavigationRoot />
              </NavigationContainer>
            </SafeAreaProvider>
        </ThemeProvider>
  )
}

export default App
