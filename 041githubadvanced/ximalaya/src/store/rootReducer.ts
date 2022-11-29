import { combineReducers } from '@reduxjs/toolkit'
import appSlice from './user/appSlice'

const rootReducer = combineReducers({
  app: appSlice.reducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
