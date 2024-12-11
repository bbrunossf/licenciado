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

  export const action = async ({ request }) => {
    const formData = await request.formData();
    
    // Log para verificar os dados recebidos
    console.log("Dados recebidos:", Object.fromEntries(formData.entries()));
  
    const subject = formData.get("subject");
    const startTime = formData.get("startTime");
    const endTime = formData.get("endTime");
    const actionType = formData.get("actionType");
    const id = formData.get("Id");
    const description = formData.get("Description");
    const isAllDay = formData.get("IsAllDay")  === 'true';
    // Validação dos dados
    if (!subject || !startTime || !endTime) {
      return json({ error: "Dados inválidos" }, { status: 400 });
    }
  
    try {
      switch (actionType) {
        case 'create':
          const newEvent = await prisma.evento.create({
            data: {
              subject: subject.toString(),
              startTime: new Date(startTime.toString()),
              endTime: new Date(endTime.toString()),
              IsAllDay: isAllDay,
              recurrenceRule: 'none',
              description: description.toString() || '',
            }
          });
          return json(newEvent);
        case 'update':
        const updatedEvent = await prisma.evento.update({
          where: { id: parseInt(id, 10) },
          data: {
            subject: subject.toString(),
            startTime: new Date(startTime.toString()),
            endTime: new Date(endTime.toString()),
            IsAllDay: isAllDay,
            recurrenceRule: 'none',
            description: description.toString() || '',
          }
        });
        return json(updatedEvent);
        case 'delete':
        const deletedEvent = await prisma.evento.delete({
          where: { id: parseInt(id, 10) }
        });
        return json(deletedEvent);
        // Outros casos (update, delete) podem ser tratados similarmente
        default:
          return json({ error: "Ação não reconhecida" }, { status: 400 });
        }            
    } catch (error) {
      console.error("Erro ao processar evento:", error);
      return json({ error: "Erro ao processar evento" }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };    

export default function SchedulePage() {
    const  events  = useLoaderData<typeof loader>();    
    console.log("dados que chegam no default", events);

    
    
    const onActionComplete = async (args) => {
    if (args.requestType === 'eventCreated' || 
        args.requestType === 'eventChanged' || 
        args.requestType === 'eventRemoved') {    
        // Identificação dinâmica do registro do evento
        const targetEvent = 
        args.requestType === 'eventCreated' ? args.addedRecords[0] :
        args.requestType === 'eventChanged' ? args.changedRecords[0] :
        args.requestType === 'eventRemoved' ? args.deletedRecords[0] :
        null;

        console.log("Tipo de Ação:", args.requestType);
        console.log("Evento Processado:", targetEvent);

        // Verifica se o evento existe
        if (targetEvent) {
        const formData = new FormData();
        
        // Map Syncfusion event data to form data
        formData.append('actionType', 
        args.requestType === 'eventCreated' ? 'create' :
        args.requestType === 'eventChanged' ? 'update' :
        'delete'
        );
        formData.append("subject", targetEvent.Subject);
        formData.append("startTime", targetEvent.StartTime);
        formData.append("endTime", targetEvent.EndTime);
        formData.append("Id", targetEvent.Id);      
        formData.append("Description", targetEvent.Description);
        formData.append("IsAllDay", targetEvent.IsAllDay);
        // Envia para a rota de ação
        try {
        const response = await fetch('/comsem', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Falha ao sincronizar evento');
        }
        } catch (error) {
        console.error("Erro ao sincronizar evento:", error);
        // Opcional: Adicionar tratamento de erro para o usuário
        }
    }
    }
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
                    eventSettings={{ 
                        dataSource: events.map(event => ({
                          Id: event.id,
                          Subject: event.subject,
                          StartTime: event.startTime,
                          EndTime: event.endTime,
                          Description: event.description,
                          IsAllDay: event.IsAllDay,
                        }))
                      }}
                    actionComplete={onActionComplete}                
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