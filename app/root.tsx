import { registerLicense } from '@syncfusion/ej2-base';
registerLicense('Ngo9BigBOggjHTQxAR8/V1NDaF5cWWtCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWH5ceXRcRmNfUUJ0VkE=');

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-buttons/styles/material.css';
import '@syncfusion/ej2-calendars/styles/material.css';
import '@syncfusion/ej2-dropdowns/styles/material.css';
import '@syncfusion/ej2-inputs/styles/material.css';
import '@syncfusion/ej2-lists/styles/material.css';
import '@syncfusion/ej2-navigations/styles/material.css';
import '@syncfusion/ej2-popups/styles/material.css';
import '@syncfusion/ej2-react-schedule/styles/material.css';

//import the loadCldr from ej2-base
import { loadCldr, L10n} from '@syncfusion/ej2-base';
import ptNumberData from '@syncfusion/ej2-cldr-data/main/pt/numbers.json';
import pttimeZoneData from '@syncfusion/ej2-cldr-data/main/pt/timeZoneNames.json';
import ptGregorian from '@syncfusion/ej2-cldr-data/main/pt/ca-gregorian.json';
import ptNumberingSystem from '@syncfusion/ej2-cldr-data/supplemental/numberingSystems.json';

loadCldr(ptNumberData, pttimeZoneData, ptGregorian, ptNumberingSystem);
L10n.load({
  'pt': {
    'schedule': {
      'day': 'dia',
      'week': 'semana',
      'workWeek': 'Semana de trabalho',
      'month': 'Mês',
      'agenda': 'Agenda',
      'weekAgenda': 'Agenda da semana',
      'workWeekAgenda': 'Agenda da Semana de Trabalho',
      'monthAgenda': 'Agenda do mês',
      'today': 'Hoje',
      'noEvents': 'Sem eventos',
      'allDay': 'Todo o dia',
      'start': 'Início',
      'end': 'Fim',
      'more': 'Mais',
      'close': 'Fechar',
      'cancel': 'Cancelar',
      'noTitle': '(Sem título)',
      'delete': 'Apagar',
      'deleteEvent': 'Excluir evento',
      'selectedItems': 'Itens selecionados',
      'deleteSeries': 'Apagar série',
      'edit': 'Editar',
      'editSeries': 'Editar série',
      'editEvent': 'Editar evento',
      'createEvent': 'Criar',
      'subject': 'Assunto',
      'addTitle': 'Adicionar título',
      'moreDetails': 'Mais detalhes',
      'save': 'Salvar',
      'editContent': 'Deseja editar apenas este evento ou toda a série?',
      'deleteRecurrenceContent': 'Deseja eliminar só este evento ou toda a série?',
      'deleteContent': 'Tem certeza que deseja apagar este evento?',
      'newEvent': 'Novo evento',
      'title': 'Título',
      'location': 'Localização',
      'description': 'Descrição',
      'timezone': 'Time Zone',
      'startTimezone': 'Hora inicial',
      'endTimezone': 'Hora final',
      'repeat': 'Repetir',
      'saveButton': 'Salvar',
      'cancelButton': 'Cancelar',
      'deleteButton': 'Apagar',
      'recurrence': 'Recorrência',
      'editRecurrence': 'Editar recorrência',
      'repeats': 'Repete',
      'alert': 'Alerta',
      'startEndError': 'A data de finalização selecionada ocorre antes da data de início.',
      'invalidDateError': 'O valor da data é inválido.',
      'ok': 'Confirmar',
      'occurrence': 'Ocorrência',
      'series': 'Série',
      'previous': 'Anterior',
      'next': 'Próximo',
      'timelineDay': 'Alocação de Hoje',
      'timelineWeek': 'Alocação Semanal',
      'timelineWorkWeek': 'Alocação do trabalho semanal',
      'timelineMonth': 'Alocação mensal'
    },
    'recurrenceeditor': {
      'none': 'Nenhum',
      'daily': 'Diário',
      'weekly': 'Semanal',
      'monthly': 'Mensal',
      'month': 'Mês',
      'yearly': 'Anual',
      'never': 'Nunca',
      'until': 'Até',
      'count': 'Contar',
      'first': 'Primeiro',
      'second': 'Segundo',
      'third': 'Terceiro',
      'fourth': 'Quarto',
      'last': 'Último',
      'repeat': 'Repetir',
      'repeatEvery': 'Repita cada',
      'on': 'Repita em',
      'end': 'Fim',
      'onDay': 'Dia',
      'days': 'Dias)',
      'weeks': 'Semanas)',
      'months': 'Meses)',
      'years': 'Anos)',
      'every': 'cada',
      'summaryTimes': 'vezes)',
      'summaryOn': 'em',
      'summaryUntil': 'até',
      'summaryRepeat': 'Repita',
      'summaryDay': 'dias)',
      'summaryWeek': 'semanas)',
      'summaryMonth': 'meses)',
      'summaryYear': 'anos)',
      'monthWeek': 'Mês da semana',
      'monthPosition': 'Posição do mês',
      'monthExpander': 'Expansor do mês',
      'yearExpander': 'Expansor do ano',
      'repeatInterval': 'Intervalo de repetição'
    },
    'calendar': {
      'today': 'Hoje'
    }
  }
});

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
