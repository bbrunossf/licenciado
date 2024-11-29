import { PrismaClient } from '@prisma/client';
import { json, LoaderFunction, ActionFunction, redirect } from '@remix-run/node';
import { useLoaderData } from "@remix-run/react";
import { Form } from 'react-router-dom';

const prisma = new PrismaClient();

// Loader para carregar todos os recursos
export const loader = async () => {  
  const resources = await prisma.resource.findMany();
  return json( resources );
};

// Action para deletar um recurso
export let action: ActionFunction = async ({ request }) => {
  const formData = new URLSearchParams(await request.text());
  const resourceId = formData.get('resourceId');
  if (resourceId) {
    await prisma.resource.delete({
      where: { id: Number(resourceId) },
    });
  }
  return redirect('/recursos');
};

export default function Resources() {
  const resources = useLoaderData<typeof loader>();
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Lista de Recursos</h1>
  
      <ul className="space-y-4">
        {/* Aqui, listamos todos os recursos */}
        {resources.map((resource) => (
          <li key={resource.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">{resource.name}</span>
              <span className="text-gray-600">{resource.description}</span>
            </div>
  
            {/* Botões */}
            <div className="flex space-x-4">
              {/* Botão para editar */}
              <a
                href={`/resources/edit/${resource.id}`}
                className="text-blue-500 hover:text-blue-700 transition-colors"
              >
                Editar
              </a>
  
              {/* Formulário para excluir */}
              <Form method="post" className="inline">
                <input type="hidden" name="resourceId" value={resource.id} />
                <button
                  type="submit"
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  Excluir
                </button>
              </Form>
            </div>
          </li>
        ))}
      </ul>
  
      {/* Botão para criar novo recurso */}
      <div className="mt-8 text-center">
        <a
          href="/recursos/new"
          className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
        >
          Criar Novo Recurso
        </a>
      </div>
    </div>
  )
}