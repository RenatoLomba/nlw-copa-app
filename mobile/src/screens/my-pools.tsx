import { Icon, VStack } from 'native-base'

import { Octicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

import { Button, Header } from '../components'

export function MyPoolsScreen() {
  const { navigate } = useNavigation()

  return (
    <VStack flex={1} bg="gray.900">
      <Header title="Meus bolões" />

      <VStack
        mt={6}
        mx={5}
        borderBottomWidth={1}
        borderBottomColor="gray.600"
        pb={4}
        mb={4}
        alignItems="center"
      >
        <Button
          leftIcon={
            <Icon as={Octicons} name="search" color="black" size="md" />
          }
          title="Buscar bolão por código"
          onPress={() => navigate('find-pool')}
        />
      </VStack>

      <VStack mx={5} alignItems="center"></VStack>
    </VStack>
  )
}
