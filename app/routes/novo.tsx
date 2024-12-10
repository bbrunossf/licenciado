// todos os outros campos permitidos:
// Description, Location, RecurrenceException,
//RecurrenceID, Recurrence Rule, isAllDay,
// subject, startTime, endTime

//mostra todos os eventos; filtro pelo checkbox não está funcionando
// tive que fazer o mapeamento no eventSettings mesmo fazendo o mapeamento no loader
//

import { useEffect, useRef } from 'react';
import { extend } from '@syncfusion/ej2-base';
import { Query, Predicate } from '@syncfusion/ej2-data';
import { CheckBox } from '@syncfusion/ej2-react-buttons';

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
  DragAndDrop,
  Resize,
  ViewsDirective,
  ViewDirective,  
  TimelineViews, TimelineMonth,
  ResourcesDirective, ResourceDirective  
} from '@syncfusion/ej2-react-schedule';
import { CheckBoxComponent, ChangeEventArgs } from '@syncfusion/ej2-react-buttons';


import PropertyPane from "~/components/PropertyPane";
import '../resources.css'; // dá a cor dos recursos
//import * as dataSource from '../dados/datasource.json';

// trazer a função action para lidar com operações CRUD com o banco de dados


export const loader: LoaderFunction = async () => {
    try {
      const resources = await prisma.resource.findMany({
        select: {
          id: true,
          name: true,
          //color: true
        }
      });
      //console.log("recursos", resources);

      const data = await prisma.evento.findMany();
      //console.log("data na função loader", data);
      
  
      // Formatando os dados dos recursos para corresponder à estrutura esperada
      const resourceData = resources.map(resource => ({
        Text: resource.name,
        Id: resource.id,
        //Color: resource.color
      }));
      console.log("resourceData", resourceData);

      // Formatando os dados dos eventos para corresponder à estrutura esperada
      const eventos = data.map(evento => ({
        subject: evento.subject,
        startTime: new Date(evento.startTime.toString()),
        endTime: new Date(evento.endTime.toString()),
        isAllDay: evento.IsAllDay,
        recurrenceRule: 'none',
        description: evento.description || '',        
        
      }));
      console.log("eventos", eventos);
  
      return json({
        title: "Configurações x",
        resourceData,
        data: eventos
      });
    } catch (error) {
      console.error("Erro ao carregar recursos:", error);
      return json({
        title: "Configurações",
        resourceData: [],
        error: "Falha ao carregar recursos"
      });
    }
  };


export default function SchedulePage() {
    //const { title } = useLoaderData();
    const { title, resourceData, data } = useLoaderData<typeof loader>();
    let scheduleObj = useRef<ScheduleComponent>(null);
    console.log("data recebido no componente", data);
    
    // Criar refs dinamicamente para cada recurso
    const checkboxRefs = useRef<{ [key: string]: CheckBoxComponent | null }>({});

    const onChange = (): void => {
        let predicate: Predicate;
        
        // Itera sobre os recursos para verificar os checkboxes
        resourceData.forEach((resource) => {
            const checkBoxObj = checkboxRefs.current[`resource-${resource.Id}`];
            if (checkBoxObj?.checked) {
                if (predicate) {
                    predicate = predicate.or('OwnerId', 'equal', resource.Id);
                } else {
                    predicate = new Predicate('OwnerId', 'equal', resource.Id);
                }
            }
        });
        
        scheduleObj.current.eventSettings.query = new Query().where(predicate);
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
                    IsAllDay: event.IsAllDay,
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
                        // colorField='Color' 
                    />
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
                                                //cssClass={`resource-${resource.Id}`}
                                                checked={true}
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
};