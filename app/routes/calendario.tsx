import { json } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { prisma } from "~/db.evento";
import { useState } from "react";
import {
  ScheduleComponent,
  Inject,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";

// Loader para buscar os eventos do banco de dados
export const loader = async () => {
  const events = await prisma.evento.findMany();
  console.log("eventos no db", events);
  return json(events);
};

// Action para salvar um evento no banco de dados
export const action = async ({ request }) => {
  try {
    const formData = await request.formData();
	console.log("Dados recebidos:", Array.from(formData.entries()));
	
    const subject = formData.get("subject");
    const startTime = formData.get("startTime");
    const endTime = formData.get("endTime");
    const reminder = parseInt(formData.get("reminder"), 10) || 10;
	
	console.log("Evento a ser salvo:", { subject, startTime, endTime, reminder });

    // Validação simples para evitar inserir dados vazios
    if (!subject || !startTime || !endTime) {
      return new Response("Dados inválidos", { status: 400 });
    }

    console.log("Preparando para salvar o evento no banco de dados...");
	await prisma.evento.create({
      data: {
        subject,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        //reminder,
		IsAllDay: false,
		recurrenceRule: 'none',
      },
    });

    // Retorna uma resposta indicando sucesso
    return new Response("Evento criado com sucesso", { status: 200 });
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    return new Response("Erro ao criar evento", { status: 500 });
  }
};

export default function Calendario() {
  const events = useLoaderData();
  const [reminder, setReminder] = useState(10);

  const handleActionComplete = async (e) => {
    if (e.requestType === "eventCreated") {
      const addedEvent = e.addedRecords[0];

      const formData = new FormData();
      formData.append("subject", addedEvent.Subject);
      formData.append("startTime", addedEvent.StartTime);
      formData.append("endTime", addedEvent.EndTime);
      formData.append("reminder", reminder);

      try {
        const response = await fetch("/calendario", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          console.error("Erro ao salvar evento:", response.statusText);
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      }
    }
  };

  return (
    <div>
      <h1>Calendário de Eventos</h1>
      <ScheduleComponent
        height="650px"
        eventSettings={{
          dataSource: events.map((event) => ({
            Id: event.id,
            Subject: event.subject,
            StartTime: event.startTime,
            EndTime: event.endTime,
          })),
        }}
        actionComplete={handleActionComplete}
      >
        <Inject services={[Day, Week, WorkWeek, Month, Agenda, DragAndDrop]} />
      </ScheduleComponent>

      <label>Definir lembrete (minutos antes):</label>
      <input
        type="number"
        value={reminder}
        onChange={(e) => setReminder(e.target.value)}
      />
    </div>
  );
}
