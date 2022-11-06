/* eslint-disable camelcase */
import { NativeBaseProvider, StatusBar } from 'native-base'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

import { Loading } from './src/components'
import {
  // CreatePoolScreen,
  // SignInScreen,
  // FindPoolScreen,
  MyPoolsScreen,
} from './src/screens'
import { AuthProvider } from './src/stores'
import { theme } from './src/styles'

function Router() {
  return (
    <AuthProvider>
      {/* <FindPoolScreen /> */}
      <MyPoolsScreen />
      {/* <SignInScreen /> */}
      {/* <CreatePoolScreen /> */}
    </AuthProvider>
  )
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  })

  return (
    <NativeBaseProvider theme={theme}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {!fontsLoaded ? <Loading /> : <Router />}
    </NativeBaseProvider>
  )
}
