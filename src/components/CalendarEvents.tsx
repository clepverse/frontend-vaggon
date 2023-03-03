import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Input,
  Link,
  Select,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';

import { FaPencilAlt, FaTrash } from 'react-icons/fa';

import '../styles/modal.css';
import '../styles/calendar.css';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';

import Modal from 'react-modal';
import { useState } from 'react';
import { api } from '../services/api';
import { toast } from 'react-toastify';

import { formatISO9075 } from 'date-fns';

const customStyles = {
  content: {
    width: '50%',
    maxWidth: '600px',
  },
};

const modalOverlay = {
  content: {
    background: 'rgba(0, 0, 0, 0.5)',

    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

type ActivityProps = {
  activities: Activity[];
};

type Activity = {
  id: number;
  name: string;
  description: string;
  start_date_and_time: string;
  end_date_and_time: string;
  status: Status;
  user_id: number;
};

enum Status {
  PEDANT,
  COMPLETED,
  CANCELED,
}

type EventsProps = {
  id: number;
  title: string;
  start: string;
  end: string;
};

type extendEventsCalendarProps = {
  description: string;
  status: string;
};

export default function CalendarEvents({ activities }: ActivityProps) {
  const [modalIsOpen, setIsOpen] = useState(false);

  const [eventsCalendar, setEventCalendar] = useState<EventsProps>();
  const [extendEventsCalendar, setExtendEventsCalendar] = useState<extendEventsCalendarProps>();

  const [idEvent, setIdEvent] = useState(eventsCalendar?.id);
  const [titleEvent, setTitleEvent] = useState(eventsCalendar?.title);
  const [descriptionEvent, setDescriptionEvent] = useState(extendEventsCalendar?.description);
  const [startEvent, setStartEvent] = useState(eventsCalendar?.start);
  const [endEvent, setEndEvent] = useState(eventsCalendar?.end);
  const [statusEvent, setStatusEvent] = useState(extendEventsCalendar?.status);

  const events = activities?.map((item: Activity) => {
    return {
      id: String(item.id),
      title: item.name,
      description: item.description,
      start: item.start_date_and_time,
      end: item.end_date_and_time,
      status: item.status,
      className: 'fc-event-' + item.status,
    };
  });

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function handleGetEventCalendar({ id, title, start, end }, { description, status }) {
    const startFormatted = formatISO9075(start, {
      format: 'extended',
      representation: 'complete',
    });

    const endFormatted = formatISO9075(end, {
      format: 'extended',
      representation: 'complete',
    });

    setIdEvent(id);
    setTitleEvent(title);
    setDescriptionEvent(description);
    setStartEvent(startFormatted);
    setEndEvent(endFormatted);
    setStatusEvent(status);
  }

  async function handleDeleteEventCalendar() {
    await api.delete(`/activity/${idEvent}`).then(() => {
      toast.success(`Deleted ${titleEvent}`);
      closeModal();
    });
  }

  async function handleUpdateEventCalendar() {
    await api
      .put(`/activity/${idEvent}`, {
        name: titleEvent,
        description: descriptionEvent,
        start_date_and_time: new Date(startEvent),
        end_date_and_time: new Date(endEvent),
        status: statusEvent,
      })
      .then(() => {
        toast.success('Activity successfully updated');
        closeModal();
      });
  }
  return (
    <div>
      <Box>
        <Modal
          ariaHideApp={false}
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Activities"
          overlayClassName="react-modal-overlay"
          className="react-modal-content"
        >
          <Box>
            <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6" flexDirection={'column'}>
              <Box flex="1" borderRadius={8} bg="gray.800" p={['6', '8']}>
                <Heading size="lg" fontWeight="normal">
                  Activity
                </Heading>

                <Divider my="6" borderColor="gray.700" />

                <VStack spacing={['6', '8']}>
                  <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                    <Input
                      name="name"
                      value={titleEvent}
                      type="text"
                      placeholder="Name"
                      onChange={(e) => setTitleEvent(e.target.value)}
                    />
                    <Input
                      name="description"
                      value={descriptionEvent}
                      type="text"
                      placeholder="Description"
                      onChange={(e) => setDescriptionEvent(e.target.value)}
                    />
                  </SimpleGrid>
                  <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
                    <Input
                      name="start_date"
                      value={startEvent}
                      type="datetime-local"
                      placeholder="Start date"
                      onChange={(e) => setStartEvent(e.target.value)}
                    />
                    <Input
                      name="end_date"
                      value={endEvent}
                      type="datetime-local"
                      placeholder="End date"
                      onChange={(e) => setEndEvent(e.target.value)}
                    />
                    <Select
                      value={statusEvent}
                      onChange={(e) => {
                        setStatusEvent(e.target.value);
                      }}
                    >
                      <option value="PENDANT">PENDANT</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELED">CANCELED</option>
                    </Select>
                  </SimpleGrid>
                </VStack>

                <Flex mt="8" justify="flex-end">
                  <HStack spacing="4">
                    <Button as="a" colorScheme="whiteAlpha" onClick={handleDeleteEventCalendar}>
                      Delete
                      <FaTrash style={{ margin: '0.5rem' }} />
                    </Button>

                    <Button onClick={handleUpdateEventCalendar} colorScheme="pink">
                      Edit
                      <FaPencilAlt style={{ margin: '0.5rem' }} />
                    </Button>
                  </HStack>
                </Flex>
              </Box>
            </Flex>
          </Box>
        </Modal>
      </Box>
      <Flex zIndex={-1} w="100%" my="6" maxWidth={1480} mx="auto" px="6" flexDirection={'column'}>
        <FullCalendar
          height={600}
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={{ events }}
          locale={ptBrLocale}
          eventClick={(e) => {
            handleGetEventCalendar(
              e.event,
              e.event._def.extendedProps as extendEventsCalendarProps,
            );

            openModal();
          }}
          editable={true}
        />
      </Flex>
    </div>
  );
}
