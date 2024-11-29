// todos os outros campos permitidos:
// Description, Location, RecurrenceException,
//RecurrenceID, Recurrence Rule, isAllDay,
// subject, startTime, endTime

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
  //DialogModule,
  DragAndDrop,
  Resize,
  ViewsDirective,
  ViewDirective,
  RecurrenceEditorComponent,
  TimelineViews, TimelineMonth,
  ResourcesDirective, ResourceDirective  
} from '@syncfusion/ej2-react-schedule';
//import { useLoaderData } from '@remix-run/react';
//import { json } from '@remix-run/node';


export const loader = async () => {  
  const events = await prisma.evento.findMany();
  return json(events);
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
            IsAllDay: false,
            recurrenceRule: 'none',
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
          IsAllDay: false,
          recurrenceRule: 'none',
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
export default function Scheduler() {
  const events = useLoaderData<typeof loader>();

  const group = { resources: ['Airlines'] }
  const resourceData: Object[] =
    [
      { AirlineName: "Airways 1", AirlineId: 1, AirlineColor: "#EA7A57" },
      { AirlineName: "Airways 2", AirlineId: 2, AirlineColor: "#357cd2" },
      { AirlineName: "Airways 3", AirlineId: 3, AirlineColor: "#7fa900" }
    ];

  const onActionComplete = async (args) => {
    if (args.requestType === 'eventCreated' || 
        args.requestType === 'eventChanged' || 
        args.requestType === 'eventRemoved') {
      // const addedEvent = args.addedRecords[0];
      // const changedEvent = args.changedRecords[0];
      // const deletedEvent = args.deletedRecords[0];

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

      // Add event details to form data
      // if (args.data) {
      //   Object.keys(args.data).forEach(key => {
      //     formData.append(key, args.data[key]);
      //   });
      //   console.log("dadosss", Array.from(formData.entries()));
      // }
      // formData.append("subject", addedEvent.Subject);
      // formData.append("startTime", addedEvent.StartTime);
      // formData.append("endTime", addedEvent.EndTime);
      // formData.append("Id", addedEvent.id);
      formData.append("subject", targetEvent.Subject);
      formData.append("startTime", targetEvent.StartTime);
      formData.append("endTime", targetEvent.EndTime);
      formData.append("Id", targetEvent.Id);      

      // Envia para a rota de ação
      try {
        const response = await fetch('/calendar2', {
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
  <div>
    <ScheduleComponent
      eventSettings={{ 
        dataSource: events.map(event => ({
          Id: event.id,
          Subject: event.subject,
          StartTime: event.startTime,
          EndTime: event.endTime,
        }))
      }}
      locale='pt'
       currentView='Month'
       group={group}
      // Manipula todas as ações (criar, atualizar, excluir)
      actionComplete={onActionComplete}
    >
    <ResourcesDirective>
      <ResourceDirective field='AirlineId' title='Airline Name' name='Airlines' allowMultiple={true}
        dataSource={resourceData} textField='AirlineName' idField='AirlineId' colorField='AirlineColor'>
      </ResourceDirective>
    </ResourcesDirective>

    <ViewsDirective>
        <ViewDirective option='Day' />
        <ViewDirective option='Week' />
        <ViewDirective option='WorkWeek' />
        <ViewDirective option='Month' />
        <ViewDirective option='Agenda' />
        <ViewDirective option='TimelineDay' />
        <ViewDirective option='TimelineMonth' />
      </ViewsDirective>

      <Inject services={[
        Day, 
        Week, 
        WorkWeek, 
        Month, 
        Agenda,
        DragAndDrop,
        Resize,
        TimelineViews, TimelineMonth,
      ]} />
    </ScheduleComponent>   

    {/* Hidden RecurrenceEditor for handling recurrence rule generation */}
      <RecurrenceEditorComponent id='RecurrenceEditor' />

  </div>
);
}