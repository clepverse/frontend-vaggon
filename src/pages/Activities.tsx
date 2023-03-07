import { FormEvent, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

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
import { useForm, SubmitHandler } from 'react-hook-form';

type Activity = {
  name: string;
  description: string;
  start_date_and_time: string;
  end_date_and_time: string;
  user_id: number;
};

export function Activities() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Activity>({
    defaultValues: {
      name: '',
      description: '',
      start_date_and_time: '',
      end_date_and_time: '',
      user_id: null,
    },
  });

  const { user } = useContext(AuthContext);
  // const [name, setName] = useState<string>();
  // const [description, setDescription] = useState<string>();
  // const [startDateAndTime, setStartDateAndTime] = useState<string>();
  // const [endDateAndTime, setEndDateAndTime] = useState<string>();

  const cookies = new Cookies();
  const navigate = useNavigate();

  const refreshPage = () => {
    navigate(0);
  };

  const handleCreate: SubmitHandler<Activity> = async ({
    name,
    description,
    start_date_and_time,
    end_date_and_time,
  }) => {
    if (!start_date_and_time && !end_date_and_time) {
      // toast.error('Put the start date and end date.');
    } else {
      if (end_date_and_time <= start_date_and_time) {
        toast.error('Put the end date greater than the start date.');
        setValue('end_date_and_time', '');
      } else {
        await api
          .post('/activity', {
            user_id: user.id,
            name: name,
            description: description,
            start_date_and_time: new Date(start_date_and_time),
            end_date_and_time: new Date(end_date_and_time),
            status: 'PENDANT',
          })
          .then(() => {
            toast.success('User created successfully.');
            // setName('');
            // setDescription('');
            // setStartDateAndTime('');
            // setEndDateAndTime('');

            refreshPage();
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
    }
  };

  // async function handleCreateUser(event: FormEvent) {
  //   event.preventDefault();

  //   if (endDateAndTime <= startDateAndTime) {
  //     toast.error('Put the end date greater than the start date.');
  //     setEndDateAndTime('');
  //   } else {
  //     await api
  //       .post('/activity', {
  //         user_id: user.id,
  //         name: name,
  //         description: description,
  //         start_date_and_time: new Date(startDateAndTime),
  //         end_date_and_time: new Date(endDateAndTime),
  //         status: 'PENDANT',
  //       })
  //       .then(() => {
  //         toast.success('User created successfully.');
  //         setName('');
  //         setDescription('');
  //         setStartDateAndTime('');
  //         setEndDateAndTime('');

  //         refreshPage();
  //       });
  //   }
  // }

  function handleCancel() {
    setValue('name', '');
    setValue('description', '');
    setValue('start_date_and_time', '');
    setValue('end_date_and_time', '');
  }

  useEffect(() => {
    const token = cookies.get('agenda.token');
    if (!token) {
      navigate('/');
    }
  }, []);

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
            onClick={() => {
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
            onSubmit={handleSubmit(handleCreate)}
          >
            <Heading size="lg" fontWeight="normal">
              Create activity
            </Heading>

            <Divider my="6" borderColor="gray.700" />

            <VStack spacing={['6', '8']}>
              <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                <Input
                  name="name"
                  // value={name}
                  type="text"
                  placeholder="Name"
                  {...register('name')}
                />

                <Input
                  name="description"
                  // value={description}
                  type="text"
                  placeholder="Description"
                  {...register('description')}
                  // onChange={(e) => setDescription(e.target.value)}
                />
              </SimpleGrid>
              <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
                <Input
                  name="start_date"
                  // value={startDateAndTime}
                  type="datetime-local"
                  placeholder="Start date"
                  {...register('start_date_and_time')}
                  // onChange={(e) => setStartDateAndTime(e.target.value)}
                />
                <Input
                  name="end_date"
                  // value={endDateAndTime}
                  type="datetime-local"
                  placeholder="End date"
                  {...register('end_date_and_time')}
                  // onChange={(e) => setEndDateAndTime(e.target.value)}
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

          {/* <Box
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
          </Box> */}
        </Flex>
      </Box>
      <Flex justifyContent={'center'}></Flex>

      <CalendarEvents activities={user?.activities} />
    </div>
  );
}
