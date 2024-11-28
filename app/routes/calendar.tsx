//import { loadCldr } from "@syncfusion/ej2-base";
//import enNumberData from "@syncfusion/ej2-cldr-data/main/en/numbers.json";
//import entimeZoneData from "@syncfusion/ej2-cldr-data/main/en/timeZoneNames.json";
//import {setCulture, setCurrencyCode} from '@syncfusion/ej2-base';

//import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import {loadCldr, L10n, setCulture} from "@syncfusion/ej2-base";
import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  ViewsDirective,
  ViewDirective,
  RecurrenceEditorComponent,
  TimelineViews, TimelineMonth
} from '@syncfusion/ej2-react-schedule';

// import pkg from '@syncfusion/ej2-react-schedule';

// const {ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject, ViewsDirective, ViewDirective, RecurrenceEditorComponent} = pkg;

//setCulture('pt');
//setCurrencyCode('BRL');

import type { EventSettingsModel } from '@syncfusion/ej2-react-schedule';

// Sample data with recurrent events
const scheduleData = [
  {
    Id: 1,
    Subject: 'Weekly Team Meeting',
    StartTime: new Date(2024, 0, 15, 10, 0), // Jan 15, 2024, 10:00 AM
    EndTime: new Date(2024, 0, 15, 11, 30),  // Jan 15, 2024, 11:30 AM
    RecurrenceRule: 'FREQ=WEEKLY;INTERVAL=1;COUNT=10', // Repeats weekly for 10 occurrences
    IsReadonly: false,
  },
  {
    Id: 2,
    Subject: 'Monthly Review',
    StartTime: new Date(2024, 0, 20, 14, 0), // Jan 20, 2024, 2:00 PM
    EndTime: new Date(2024, 0, 20, 15, 30),  // Jan 20, 2024, 3:30 PM
    RecurrenceRule: 'FREQ=MONTHLY;INTERVAL=1;COUNT=6', // Repeats monthly for 6 months
    IsReadonly: false,
  }
];

type LoaderData = {
  events: typeof scheduleData;
};

export const loader: LoaderFunction = async () => {
  // In a real app, you'd fetch this from a database
  return json<LoaderData>({ events: scheduleData });
};

export default function Calendar() {
  const { events } = useLoaderData<LoaderData>();
  console.dir (Calendar.name)

  const eventSettings: EventSettingsModel = {
    dataSource: events,
    fields: {
      id: 'Id',
      subject: { name: 'Subject' },
      startTime: { name: 'StartTime' },
      endTime: { name: 'EndTime' },
      recurrenceRule: { name: 'RecurrenceRule' },
      isReadonly: { name: 'IsReadonly' }
    },
    enableRecurrenceValidation: true
  };

  return (
    <div className="calendar-container m-4">
      <h1>Calendar</h1>
      <ScheduleComponent
        height='650px'
        selectedDate={new Date()}
        eventSettings={eventSettings}
        enableRecurrenceValidation={true}
        showQuickInfo={true}
        locale='pt'
      >
        <ViewsDirective>
          <ViewDirective option='Day' />
          <ViewDirective option='Week' />
          <ViewDirective option='WorkWeek' />
          <ViewDirective option='Month' />
          <ViewDirective option='Agenda' />
          <ViewDirective option='TimelineDay' />
          <ViewDirective option='TimelineMonth' />
        </ViewsDirective>
        <Inject services={[Day, Week, WorkWeek, Month, Agenda, TimelineViews, TimelineMonth]} />
      </ScheduleComponent>
      
      {/* Hidden RecurrenceEditor for handling recurrence rule generation */}
      <RecurrenceEditorComponent id='RecurrenceEditor' />
    </div>
  );
}