//teste para exibir os eventos e recursos

import { prisma } from "~/db.evento";
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
  DragAndDrop,
  Resize,
  ViewsDirective,
  ViewDirective,
  RecurrenceEditorComponent,
  TimelineViews, TimelineMonth,
  ResourcesDirective, ResourceDirective  
} from '@syncfusion/ej2-react-schedule';


export const loader = async () => {  
    // // Fetch events with associated resources
    const events = await prisma.eventResource.findMany({
      include: {
        event: true, // Inclui os dados da tabela Evento
        resource: true, // Inclui os dados da tabela Resource
      }
    });
    
    // Retornar somente os campos necessários
    const events2 = events.map(({ event, resource }) => ({
      subject: event.subject,
      name: resource.name,
      id: resource.id
    }));
    
    
    // Transform events to include resource IDs
    const formattedEvents = events2.map(event => ({
      ...event,
      resourceIds: events2.map(er => er.id)      
    }));
    return (formattedEvents);
  };

  export const action = async ({ request }) => {
    const formData = await request.formData();
    const actionType = formData.get("actionType");
    const resourceIds = formData.getAll("resourceIds[]");
  }


  export default function EventResourceList() {
    const eventResources = useLoaderData();
  
    return (
      <div>
        <h1>Event Resources</h1>
        <ul>
          {eventResources.map((item, index) => (
            <li key={index}>
              <strong>Event:</strong> {item.subject} | <strong>Resource:</strong> {item.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
    