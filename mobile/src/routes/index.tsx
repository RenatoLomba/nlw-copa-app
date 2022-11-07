import { Box } from 'native-base'

import { NavigationContainer } from '@react-navigation/native'

import { SignInScreen } from '../screens'
import { useAuthStore } from '../stores'
import { AppRoutes } from './app.routes'

export function Routes() {
  const { user } = useAuthStore()

  return (
    <Box flex={1} bg="gray.950">
      <NavigationContainer>
        {user ? <AppRoutes /> : <SignInScreen />}
      </NavigationContainer>
    </Box>
  )
}
