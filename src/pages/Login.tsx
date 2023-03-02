import { Button, Flex, Input, Link, Stack, Text } from '@chakra-ui/react';
import { FormEvent, useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const { signIn } = useContext(AuthContext);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const data = {
      login,
      password,
    };

    await signIn(data);
  }

  return (
    <Flex w="100vw" h="100vh" align="center" justify="center">
      <Flex
        as="form"
        width="100%"
        maxWidth={360}
        bg="gray.800"
        p="8"
        borderRadius={8}
        flexDir="column"
        onSubmit={handleSubmit}
      >
        <Text align={'center'} fontSize="3xl" marginBottom={'4'}>
          Sign In
        </Text>
        <Stack spacing={4}>
          <Input
            name="login"
            type="text"
            value={login}
            placeholder="Login"
            onChange={(event) => setLogin(event.target.value)}
          />

          <Input
            name="password"
            type="password"
            value={password}
            placeholder="password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </Stack>

        <Button type="submit" mt="6" colorScheme="pink" size="lg">
          Entrar
        </Button>
        <Link href="/signup" textAlign={'center'} marginTop={'4'}>
          Register
        </Link>
      </Flex>
    </Flex>
  );
}
