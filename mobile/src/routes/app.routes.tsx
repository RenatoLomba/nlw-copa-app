import { useTheme } from 'native-base'
import { PlusCircle, SoccerBall } from 'phosphor-react-native'
import { Platform } from 'react-native'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { CreatePoolScreen, MyPoolsScreen } from '../screens'

const { Navigator, Screen } = createBottomTabNavigator()

export function AppRoutes() {
  const { colors, sizes } = useTheme()

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelPosition: 'beside-icon',
        tabBarActiveTintColor: colors.yellow[500],
        tabBarInactiveTintColor: colors.gray[300],
        tabBarStyle: {
          position: 'absolute',
          height: 87,
          borderTopWidth: 0,
          backgroundColor: colors.gray[800],
        },
        tabBarItemStyle: {
          position: 'relative',
          top: Platform.OS === 'android' ? -10 : 0,
        },
      }}
    >
      <Screen
        name="create-pool"
        component={CreatePoolScreen}
        options={{
          tabBarLabel: 'Novo bolão',
          tabBarIcon: ({ color }) => (
            <PlusCircle color={color} size={sizes[6]} />
          ),
        }}
      />
      <Screen
        name="my-pools"
        component={MyPoolsScreen}
        options={{
          tabBarLabel: 'Meus bolões',
          tabBarIcon: ({ color }) => (
            <SoccerBall color={color} size={sizes[6]} />
          ),
        }}
      />
    </Navigator>
  )
}
