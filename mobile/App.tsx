/* eslint-disable camelcase */
import { NativeBaseProvider, StatusBar } from 'native-base'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

import { Loading } from './src/components/loading'
import { SignInScreen } from './src/screens/sign-in'
import { theme } from './src/styles/theme'

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

      {!fontsLoaded ? <Loading /> : <SignInScreen />}
    </NativeBaseProvider>
  )
}
