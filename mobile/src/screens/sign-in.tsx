import { Center, Icon, Text } from 'native-base'

import { Fontisto } from '@expo/vector-icons'

import Logo from '../assets/logo.svg'
import { Button } from '../components'
import { useAuthStore } from '../stores'

export function SignInScreen() {
  const { signIn, isLoadingUser } = useAuthStore()

  return (
    <Center flex={1} bg="gray.900" p={7}>
      <Logo width={212} height={40} />

      <Button
        isLoading={isLoadingUser}
        type="secondary"
        title="ENTRAR COM O GOOGLE"
        leftIcon={<Icon as={Fontisto} name="google" color="white" size="md" />}
        mt={12}
        onPress={signIn}
      />

      <Text color="white" textAlign="center" mt={4}>
        Não utilizamos nenhuma informação além {'\n'} do seu e-mail para criação
        da sua conta.
      </Text>
    </Center>
  )
}
