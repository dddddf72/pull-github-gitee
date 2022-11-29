import './src/utils/polyfill'
import React from 'react'
import { AppRegistry } from 'react-native'
import { Provider } from 'react-redux'
// import App from './src/App'
import App from './index.ios'
import { name as appName } from './app.json'
import store from './src/store/store'

const render = () => {
  return (
      <Provider store={store}>
        <App />
      </Provider>
  )
}

AppRegistry.registerComponent(appName, () => render)
