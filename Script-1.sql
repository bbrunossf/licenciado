SELECT 
    Evento.subject,
    Resource.name
FROM 
    EventResource
JOIN 
    Evento ON EventResource.eventId = Evento.id
JOIN 
    Resource ON EventResource.resourceId = Resource.id;
