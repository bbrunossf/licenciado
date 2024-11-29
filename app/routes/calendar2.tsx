import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from 'react';
import { 
  ScheduleComponent, 
  Day, 
  Week, 
  WorkWeek, 
  Month, 
  Agenda, 
  Inject,
  //DialogModule,
  DragAndDrop,
  Resize
} from '@syncfusion/ej2-react-schedule';
import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import { PrismaClient } from '@prisma/client';

export const loader = async () => {
  const prisma = new PrismaClient();
  const events = await prisma.evento.findMany();
  return json(events);
};

export const action = async ({ request }) => {
  const prisma = new PrismaClient();
  const formData = await request.formData();
  const eventData = Object.fromEntries(formData);

  switch (eventData.actionType) {
    case 'create':
      const newEvent = await prisma.evento.create({
        data: {
          title: eventData.Subject,
          start: new Date(eventData.StartTime),
          end: new Date(eventData.EndTime),
          allDay: eventData.IsAllDay === 'true',
          notes: eventData.Description
        }
      });
      return json(newEvent);

    case 'update':
      const updatedEvent = await prisma.evento.update({
        where: { id: eventData.Id },
        data: {
          title: eventData.Subject,
          start: new Date(eventData.StartTime),
          end: new Date(eventData.EndTime),
          allDay: eventData.IsAllDay === 'true',
          notes: eventData.Description
        }
      });
      return json(updatedEvent);

    case 'delete':
      const deletedEvent = await prisma.evento.delete({
        where: { id: eventData.Id }
      });
      return json(deletedEvent);
  }
};

export default function Scheduler() {
  const events = useLoaderData<typeof loader>();

  const onActionComplete = async (args) => {
    if (args.requestType === 'eventCreated' || 
        args.requestType === 'eventChanged' || 
        args.requestType === 'eventRemoved') {
      const formData = new FormData();
      
      // Map Syncfusion event data to form data
      formData.append('actionType', 
        args.requestType === 'eventCreated' ? 'create' :
        args.requestType === 'eventChanged' ? 'update' :
        'delete'
      );

      // Add event details to form data
      if (args.data) {
        Object.keys(args.data).forEach(key => {
          formData.append(key, args.data[key]);
        });
      }

      // Send to action route
      await fetch('/calendar2', {
        method: 'POST',
        body: formData
      });
    }
  };

  return (
    <div>
      <ScheduleComponent
        eventSettings={{ 
          dataSource: events.map(event => ({
            Id: event.id,
            Subject: event.title,
            StartTime: event.start,
            EndTime: event.end,
            IsAllDay: event.allDay,
            Description: event.notes
          }))
        }}
        // Handle all actions (create, update, delete)
        actionComplete={onActionComplete}
        
        // Enable interaction features
        //allowSelecting={true} //nao existe
        //allowResizing={true} // default já é true
        //allowDragging={true} //não existe, tem o allowDragAndDrop
      >
        <Inject services={[
          Day, 
          Week, 
          WorkWeek, 
          Month, 
          Agenda,
          //DialogModule,
          DragAndDrop,
          Resize
        ]} />
      </ScheduleComponent>
    </div>
  );
}