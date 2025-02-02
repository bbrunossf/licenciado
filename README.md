# Uso do Calendar da SyncFusion


## Resumo

Testes com a biblioteca Calendar, buscando salvar os registros em um banco de dados, e usar alguns recursos, tais como:
> Agrupamento por recursos: exibir somente as tarefas com determinado recurso associado;  
> Campos personalizados: adicionar campos de recursos à tela de adicionar tarefas;


## Descrição das Rotas e arquivos acessórios
> * root.tsx: contém a importação da licença do SyncFusion, .css para exibição do calendário, arquivos para tradução da interface 
> * db.evento.ts: exporta o cliente Prisma (normal, sem enhanced), para conexão com o banco de dados  
> * components/PropertyPane.tsx: painel lateral sugerido pela SyncFusion. Como fica dentro do componentes, fica fácil de arrastar e soltar dados para a agenda ou o Gantt  
> * recursos/index.tsx: painel de controle para gerenciamento dos recursos (tabela separada)

> routes/  
>    * calendar2.tsx: 
        função loader: lê os dados do banco de dados com o Prisma;  
        função action: define a ação para os 3 casos possíveis: create, update, delete  
        função default: tem resourceData, group, e onActionComplete
>    * comsem.tsx:  
        função loader: lê os dados do banco de dados com o Prisma, e inclui a tabela de recursos (separada);  
        função action: define a ação para os 3 casos possíveis: create, update, delete  
        função default: tem resourceData, group, e onActionComplete  
>    * novo.tsx:  
        lê os dados das tarefas + recursos, tenta juntar tudo para poder filtrar usando checkboxes (não funcionou) 
>    * resources.tsx:  
        lista as tarefas que possuem recurso associado  
>    * temp.tsx:  
        outra tentativa de usar as checkboxes dentro do PropertyPane

## O que pode ser aproveitado:
> A janela PropertyPane (não fica 'dentro' do componente Agenda, mas fica ao lado dele);  
> A lógica de action com os 3 casos possíveis

## O que deve ser melhorado:
> O uso das checkboxes, vital para exibir a agenda somente de um determinado recurso