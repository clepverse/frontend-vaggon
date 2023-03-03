import { FormEvent, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, signOut } from '../contexts/AuthContext';

import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Input,
  Link,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';

import Cookies from 'universal-cookie';
import { Logo } from '../components/Logo';
import CalendarEvents from '../components/CalendarEvents';
import { api } from '../services/api';
import { toast } from 'react-toastify';

type Activity = {
  name: string;
  description: string;
  start_date_and_time: string;
  end_date_and_time: string;
  user_id: number;
};

export function Activities() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [startDateAndTime, setStartDateAndTime] = useState<string>();
  const [endDateAndTime, setEndDateAndTime] = useState<string>();

  const cookies = new Cookies();
  const navigate = useNavigate();

  async function handleCreateUser(event: FormEvent) {
    event.preventDefault();
    await api
      .post('/activity', {
        user_id: user.id,
        name: name,
        description: description,
        start_date_and_time: new Date(startDateAndTime),
        end_date_and_time: new Date(endDateAndTime),
        status: 'PENDANT',
      })
      .then(() => {
        toast.success('User created successfully.');
        setName('');
        setDescription('');
        setStartDateAndTime('');
        setEndDateAndTime('');
      });
  }

  function handleCancel() {
    setName('');
    setDescription('');
    setStartDateAndTime('');
    setEndDateAndTime('');
  }

  // function getData() {
  //   const userId = localStorage.getItem('userId');
  //   return api.get(`/me/${userId}`);
  // }

  useEffect(() => {
    const token = cookies.get('agenda.token');
    if (!token) {
      navigate('/');
    }
  }, []);

  // console.log(user);

  return (
    <div>
      <Box>
        <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6" flexDirection={'column'}>
          <Button
            type="submit"
            my="6"
            colorScheme="pink"
            size="lg"
            width={'6rem'}
            onClick={(e) => {
              navigate('/');
              cookies.remove('agenda.token');
              cookies.remove('user.id');
            }}
          >
            Sign Out
          </Button>
          <Box
            as="form"
            flex="1"
            borderRadius={8}
            bg="gray.800"
            p={['6', '8']}
            onSubmit={handleCreateUser}
          >
            <Heading size="lg" fontWeight="normal">
              Create activity
            </Heading>

            <Divider my="6" borderColor="gray.700" />

            <VStack spacing={['6', '8']}>
              <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                <Input
                  name="name"
                  value={name}
                  type="text"
                  placeholder="Name"
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  name="description"
                  value={description}
                  type="text"
                  placeholder="Description"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </SimpleGrid>
              <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
                <Input
                  name="start_date"
                  value={startDateAndTime}
                  type="datetime-local"
                  placeholder="Start date"
                  onChange={(e) => setStartDateAndTime(e.target.value)}
                />
                <Input
                  name="end_date"
                  value={endDateAndTime}
                  type="datetime-local"
                  placeholder="End date"
                  onChange={(e) => setEndDateAndTime(e.target.value)}
                />
              </SimpleGrid>
            </VStack>

            <Flex mt="8" justify="flex-end">
              <HStack spacing="4">
                <Button as="a" colorScheme="whiteAlpha" onClick={handleCancel}>
                  Cancel
                </Button>

                <Button type="submit" colorScheme="pink">
                  Create
                </Button>
              </HStack>
            </Flex>
          </Box>
        </Flex>
      </Box>
      <Flex justifyContent={'center'}>
        {/* <pre>{JSON.stringify(user?.activities, null, 2)}</pre> */}
        {/* <div>
          {user?.activities.map((item) => {
            return <div key={item.id}>{item.name}</div>;
          })}
        </div> */}
      </Flex>

      <CalendarEvents activities={user?.activities} />
    </div>
  );
}
