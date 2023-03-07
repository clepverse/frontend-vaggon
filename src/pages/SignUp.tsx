import { Button, Flex, Input, Link, Stack, Text } from '@chakra-ui/react';
import { FormEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';

import { api } from '../services/api';

export function SignUp() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    await api
      .post('signup', {
        login,
        password,
      })
      .then(() => {
        toast.success('User created successfully.');
        navigate('/');
      })
      .catch((error) => {
        if (error.response.data.message) {
          const errors = error.response.data.message;
          errors.forEach((err: any) => {
            toast.error(err);
          });
        }
      });
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
          Sign Up
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
          Register
        </Button>

        <Link href="/" textAlign={'center'} marginTop={'4'}>
          Back to login
        </Link>
      </Flex>
    </Flex>
  );
}
