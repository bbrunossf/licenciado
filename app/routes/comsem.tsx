// teste sem as checkboxes. Está mostrando todos os eventos, mesmo aqueles que não tem recurso
// 'resources' ainda está como objeto
// Tem que pensar na forma de popular as tabelas, para que a consulta seja possível

import { useEffect, useRef } from 'react';
import { extend } from '@syncfusion/ej2-base';
import { Query, Predicate } from '@syncfusion/ej2-data';

import { prisma } from "~/db.evento";
import { data, json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from 'react';
import { 
  ScheduleComponent,   
  Month,
  Week,
  Agenda, 
  Inject,
  ViewsDirective,
  ViewDirective,
  EventSettingsModel,  
  ResourcesDirective, 
  ResourceDirective  
} from '@syncfusion/ej2-react-schedule';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';

import PropertyPane from "~/components/PropertyPane";
import '../resources.css';

export const loader: LoaderFunction = async () => {    
    const events = await prisma.evento.findMany({
        include: {
            EventResource: {
                include: {
                    resource: true // Inclui os dados dos recursos associados
                },
            },
        },
    });
                    
    
    const transformedEvents = events.map(event => ({
        id: event.id,
        subject: event.subject,
        startTime: event.startTime,
        endTime: event.endTime,
        resources: event.EventResource.map(er => ({
            id: er.resource?.id || null,
            name: er.resource?.name || null,
        })),
        }));
    return transformedEvents;
  };

export default function SchedulePage() {
    const  events  = useLoaderData<typeof loader>();    
    console.log("dados que chegam no default", events);

    const eventSettings: EventSettingsModel = {
        dataSource: events,
        fields: {
          id: "id",
          subject: { name: "subject" },
          startTime: { name: "startTime" },
          endTime: { name: "endTime" },
        },
      };
        
  
    return (   
        <div style={{ display: "flex", gap: "5px" }}>
            <div style={{ flex: 3 }}>          
                <ScheduleComponent 
                    width='80%' 
                    height='650px' 
                    selectedDate={new Date(2024, 12, 6)} 
                    locale='pt'
                    currentView='Month'                    
                    eventSettings={eventSettings}                
                >
                    
                <ViewsDirective>
                    <ViewDirective option='Day' />
                    <ViewDirective option='Week' />                        
                    <ViewDirective option='Month' />
                    <ViewDirective option='Agenda' />                        
                    <ViewDirective option='TimelineMonth' />
                </ViewsDirective>
                <Inject services={[Month, Week, Agenda]} />
                </ScheduleComponent>  
            </div>                       
        </div>
    );
}