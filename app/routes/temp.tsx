// Mostra só os eventos com recurso
// Mesmo com a mudança na função onChange, os filtros não estão funcionando
//

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
  ResourcesDirective, 
  ResourceDirective  
} from '@syncfusion/ej2-react-schedule';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';

import PropertyPane from "~/components/PropertyPane";
import '../resources.css';

export const loader: LoaderFunction = async () => {
    try {
      const resources = await prisma.resource.findMany({
        select: {
          id: true,
          name: true,
        }
      });

    //   //'evento' tem 'resource' porque está definido no schema.prisma
    //  // ou usa o 'include' ou usa o 'select'; não pode ser os 2 ao mesmo tempo
    //  // MySQL e PostgreSQL suportam 'join', mas tem que adicionar o 'join' no schema.prisma
    //   const teste = await prisma.evento.findMany({        
    //     include: { resources: true,            
    //         },        
    // });
    // //'resources' tem os campos da tabela EventResource       
    // const formattedTeste = teste.map(teste2 => ({
    //     Campo1: teste2.id,
    //     Campo2: teste2.resources.map(resource => resource.eventId),
    //     Campo3: teste2.resources.map(resource => resource.resourceId),
    //   }));
    // console.log("formattedTeste", formattedTeste);

      const resourceData = resources.map(resource => ({
        Text: resource.name,
        Id: resource.id,
      }));

      const eventos = await prisma.eventResource.findMany({
        include: {
          event: true, // Inclui os dados da tabela Evento
          resource: true, // Inclui os dados da tabela Resource
        },
      });          

      const formattedEventos = eventos.map(evento => ({
        id: evento.event.id,
        subject: evento.event.subject,
        startTime: new Date(evento.event.startTime.toString()),
        endTime: new Date(evento.event.endTime.toString()),
        isAllDay: evento.event.IsAllDay,
        description: evento.event.description || '',
        OwnerId: [evento.resource.id],
      }));
      console.log("formattedEventos", formattedEventos);
  
      return json({
        title: "Recursos do Calendário",
        resourceData,
        data: formattedEventos
      });
    } catch (error) {
      console.error("Erro ao carregar recursos:", error);
      return json({
        title: "Recursos do Calendário",
        resourceData: [],
        data: [],
        error: "Falha ao carregar recursos"
      });
    }
  };

export default function SchedulePage() {
    const { title, resourceData, data } = useLoaderData<typeof loader>();
    let scheduleObj = useRef<ScheduleComponent>(null);
    console.log("dados que chegam no default", data);
    const checkboxRefs = useRef<{ [key: string]: CheckBoxComponent | null }>({});

    const onChange = (): void => {
        const selectedResourceIds = resourceData
            .filter(resource => 
                checkboxRefs.current[`resource-${resource.Id}`]?.checked
            )
            .map(resource => resource.Id);

        if (selectedResourceIds.length === 0) {
            scheduleObj.current.eventSettings.query = null;
            return;
        }
    }
  
    return (   
        <div style={{ display: "flex", gap: "5px" }}>
            <div style={{ flex: 3 }}>          
                <ScheduleComponent 
                    width='80%' 
                    height='650px' 
                    selectedDate={new Date(2024, 12, 6)} 
                    locale='pt'
                    currentView='Month'
                    ref={scheduleObj} 
                    eventSettings={{ 
                        dataSource: data.map(event => ({
                            Id: event.id,
                            Subject: event.subject,
                            StartTime: event.startTime,
                            EndTime: event.endTime,
                            Description: event.description,
                            IsAllDay: event.isAllDay,
                            //OwnerId: event.OwnerId,
                            ...(event.OwnerId?.length ? { OwnerId: event.OwnerId } : [])
                        }))
                    }}
                >
                    <ResourcesDirective>
                        <ResourceDirective 
                            field='OwnerId' 
                            title='Owners' 
                            name='Owners' 
                            allowMultiple={true} 
                            dataSource={resourceData} 
                            textField='Text' 
                            idField='Id' 
                        />
                    </ResourcesDirective>
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
            <div style={{ flex: 1 }}>
                <PropertyPane title={title}>
                    <table id='property' title='Properties' className='property-panel-table' >
                        <tbody>
                            {resourceData.map((resource) => (
                                <tr key={resource.Id}>
                                    <td>
                                        <CheckBoxComponent 
                                            ref={(el) => checkboxRefs.current[`resource-${resource.Id}`] = el}
                                            value={resource.Id.toString()}
                                            id={`resource-${resource.Id}`}
                                            checked={false}
                                            label={resource.Text}
                                            change={onChange}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </PropertyPane>
            </div>   
        </div>
    );
}