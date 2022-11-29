import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  getSecureItem,
  setSecureItem,
  signOut,
} from '../../utils/secureAccount'

export type AppState = {
  isSettingUpHotspot: boolean
  isRestored: boolean
  authInterval: number
  lastIdle: number | null
  isLocked: boolean
  isRequestingPermission: boolean
  walletLinkToken?: string
}
const initialState: AppState = {
  isSettingUpHotspot: false,
  isRestored: false,
  authInterval: 5000,
  lastIdle: null,
  isLocked: false,
  isRequestingPermission: false,
}

type Restore = {
  isBackedUp: boolean
  authInterval: number
  isLocked: boolean
  walletLinkToken?: string
}

export const restoreAppSettings = createAsyncThunk<Restore>(
  'app/restoreAppSettings',
  async () => {
    const [ authInterval, walletLinkToken] = await Promise.all([
      getSecureItem('authInterval'),
      getSecureItem('walletLinkToken'),
    ])
    return {
      authInterval: authInterval
        ? parseInt(authInterval, 10)
        : 5000,
    } as Restore
  },
)

// This slice contains data related to the state of the app
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    backupAccount: (state, action: PayloadAction<string>) => {
      
    },
    startHotspotSetup: (state) => {
      state.isSettingUpHotspot = false
    },
    signOut: () => {
      signOut()
      return { ...initialState, isRestored: true }
    },
    updateAuthInterval: (state, action: PayloadAction<number>) => {
      state.authInterval = action.payload
      setSecureItem('authInterval', action.payload.toString())
    },
    updateLastIdle: (state) => {
      state.lastIdle = Date.now()
    },
    storeWalletLinkToken: (
      state,
      { payload: token }: PayloadAction<string>,
    ) => {
      state.walletLinkToken = token
      setSecureItem('walletLinkToken', token)
    },
    lock: (state, action: PayloadAction<boolean>) => {
      state.isLocked = action.payload
      if (!state.isLocked) {
        state.lastIdle = null
      }
    },
    requestingPermission: (state, action: PayloadAction<boolean>) => {
      state.isRequestingPermission = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(restoreAppSettings.fulfilled, (state, { payload }) => {
      return { ...state, ...payload, isRestored: true }
    })
  },
})

export default appSlice
