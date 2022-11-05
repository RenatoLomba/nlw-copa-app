import {
  Button as NativeButton,
  IButtonProps as NativeButtonProps,
  Text,
} from 'native-base'

interface ButtonProps extends NativeButtonProps {
  title: string
  type?: 'primary' | 'secondary'
}

export function Button({ title, type = 'primary', ...props }: ButtonProps) {
  return (
    <NativeButton
      w="full"
      h={14}
      rounded="sm"
      fontSize="md"
      textTransform="uppercase"
      bg={type === 'secondary' ? 'red.500' : 'yellow.500'}
      _pressed={{
        bg: type === 'secondary' ? 'red.600' : 'yellow.600',
      }}
      _loading={{
        _spinner: { color: 'black' },
      }}
      {...props}
    >
      <Text
        fontSize="sm"
        fontFamily="heading"
        color={type === 'secondary' ? 'white' : 'black'}
      >
        {title}
      </Text>
    </NativeButton>
  )
}
