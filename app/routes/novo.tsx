// todos os outros campos permitidos:
// Description, Location, RecurrenceException,
//RecurrenceID, Recurrence Rule, isAllDay,
// subject, startTime, endTime

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
import * as dataSource from '../dados/datasource.json';

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
      console.log(resources);

      const data = await prisma.evento.findMany();
      console.log("data", data);
      
  
      // Formatando os dados para corresponder à estrutura esperada
      const resourceData = resources.map(resource => ({
        Text: resource.name,
        Id: resource.id,
        //Color: resource.color
      }));
      console.log("resourceData", resourceData);
  
      return json({
        title: "Configurações x",
        resourceData,
        data
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


    // let scheduleObj = useRef<ScheduleComponent>(null);
    // let ownerOneObj = useRef<CheckBoxComponent>(null);
    // let ownerTwoObj = useRef<CheckBoxComponent>(null);
    // let ownerThreeObj = useRef<CheckBoxComponent>(null);

    // // Criar refs dinamicamente para cada recurso
    // const checkboxRefs = useRef<{ [key: string]: CheckBoxComponent | null }>({});


    // //const data: Record<string, any>[] = extend([], (dataSource as Record<string, any>).resourceSampleData, null, true) as Record<string, any>[];
    // const data: Record<string, any>[] = extend([], 
    //     (dataSource as Record<string, any>).resourceSampleData, 
    //     null, 
    //     true
    //   ) as Record<string, any>[];

    // // const resourceData: Record<string, any>[] = [
    // //     { Text: 'Margaret', Id: 1, Color: '#ea7a57' },
    // //     { Text: 'Robert', Id: 2, Color: '#df5286' },
    // //     { Text: 'Laura', Id: 3, Color: '#865fcf' }
    // // ];

    // const onChange = (): void => {
    //     let predicate: Predicate;
    //     let checkBoxes: CheckBox[] = [ownerOneObj.current, ownerTwoObj.current, ownerThreeObj.current];
    //     checkBoxes.forEach((checkBoxObj: CheckBox) => {
    //         if (checkBoxObj.checked) {
    //             if (predicate) {
    //                 predicate = predicate.or('OwnerId', 'equal', parseInt(checkBoxObj.value, 10));
    //             } else {
    //                 predicate = new Predicate('OwnerId', 'equal', parseInt(checkBoxObj.value, 10));
    //             }
    //         }
    //     });
    //     scheduleObj.current.eventSettings.query = new Query().where(predicate);
    //}

  
    return (   
        <div style={{ display: "flex", gap: "5px" }}>
        <div style={{ flex: 3 }}>          
        <ScheduleComponent cssClass='resource' 
                width='80%' 
                height='650px' 
                selectedDate={new Date(2021, 5, 6)} 
                ref={scheduleObj} 
                eventSettings={{ dataSource: data }} >

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
                    <ViewDirective option='Month' />
                </ViewsDirective>
                <Inject services={[Month]} />
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
                                                cssClass={`resource-${resource.Id}`}
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