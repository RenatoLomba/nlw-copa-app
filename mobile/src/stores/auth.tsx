import { makeRedirectUri } from 'expo-auth-session'
import { useAuthRequest } from 'expo-auth-session/providers/google'
import { maybeCompleteAuthSession } from 'expo-web-browser'
import { createContext, ReactNode, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'

import { api } from '../lib'

interface User {
  id: string
  name: string
  avatarUrl: string
}

export interface AuthStoreData {
  user: User | null
  signIn: () => Promise<void>
  isLoadingUser: boolean
}

maybeCompleteAuthSession()

const authStore = createStore<AuthStoreData>()

const AuthContext = createContext({} as StoreApi<AuthStoreData>)

type SessionResponse = {
  accessToken: string
  user: {
    sub: string
    name: string
    avatarUrl: string
  }
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [, , promptAsync] = useAuthRequest({
    clientId:
      '799852879788-2u31ef7v7010oh9scfksqeabhpnvstep.apps.googleusercontent.com',
    redirectUri: makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email'],
  })

  const store = authStore((set) => ({
    isLoadingUser: false,
    user,
    signIn: async () => {
      set({ isLoadingUser: true })

      try {
        const result = await promptAsync()

        if (result.type === 'success' && result.authentication?.accessToken) {
          const { data } = await api.post<SessionResponse>('/session', {
            access_token: result.authentication?.accessToken,
          })

          const { user, accessToken } = data

          api.defaults.headers.common.Authorization = `Bearer ${accessToken}`

          setUser({ id: user.sub, name: user.name, avatarUrl: user.avatarUrl })
        }
      } catch (ex) {
        console.error('SIGN IN ERROR', ex)
      } finally {
        set({ isLoadingUser: false })
      }
    },
  }))

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>
}

const useAuthStore = () => {
  const store = useContext(AuthContext)
  return useStore(store)
}

export { useAuthStore, AuthProvider, AuthContext }
