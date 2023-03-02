import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import React, { useContext, useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import pt from 'date-fns/locale/pt-BR';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../services/api';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: pt,
});

const events123 = [
  {
    title: 'title 01',
    allDay: true,
    start: new Date(2023, 3, 1),
    end: new Date(2023, 3, 2),
  },

  {
    title: 'title 02',
    allDay: true,
    start: new Date(2023, 3, 5),
    end: new Date(2023, 3, 6),
  },
  {
    title: 'title 03',
    allDay: true,
    start: new Date(2023, 3, 7),
    end: new Date(2023, 3, 8),
  },

  {
    title: 'title 04',
    allDay: true,
    start: new Date(2023, 3, 11),
    end: new Date(2023, 3, 14),
  },
];

// type User = {
//   id: number;
//   login: string;
//   activities: Activity[];
// };

// type Activity = {
//   id: number;
//   name: string;
//   description: string;
//   start_date_and_time: string;
//   end_date_and_time: string;
//   status: Status;
//   user_id: number;
// };

// enum Status {
//   PEDANT,
//   COMPLETED,
//   CANCELED,
// }

export default function CalendarEvents({ events }: any) {
  //const newData = events.activities.map(element => ({
  //   title: element,
  //   allDay: true,
  //   start: ,
  //   end: new Date(2023, 3, 14),
  // }));

  // function handleAddEvent() {
  //   setAllEvents([...allEvents, newEvents]);
  // }

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events123}
        startAccessor={'start'}
        endAccessor={'end'}
        style={{
          height: 500,
          margin: '50px',
          backgroundColor: '#A0AEC0',
          fontFamily: 'fantasy',
        }}
      />
    </div>
  );
}
