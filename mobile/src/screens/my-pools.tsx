import { Icon, VStack } from 'native-base'

import { Octicons } from '@expo/vector-icons'

import { Button, Header } from '../components'

export function MyPoolsScreen() {
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
        />
      </VStack>

      <VStack mx={5} alignItems="center"></VStack>
    </VStack>
  )
}
