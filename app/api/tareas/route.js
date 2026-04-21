import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NEXT_PUBLIC_NOTION_TOKEN,
});

export async function GET() {
  try {
    const databaseId = process.env.NOTION_DATABASE_TAREAS;

    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: "Creado",
          direction: "descending",
        },
      ],
    });

    // Extraer datos limpios de las tareas
    const tareas = response.results.map((page) => {
      const props = page.properties;
      return {
        id: page.id,
        titulo: props.Titulo?.title?.[0]?.plain_text || "Sin título",
        estado: props.Estado?.select?.name || "Sin estado",
        cliente: props.Cliente?.relation?.length > 0 ? props.Cliente.relation[0].id : null,
        prioridad: props.Prioridad?.select?.name || "Normal",
        fechaVencimiento: props["Fecha de vencimiento"]?.date?.start || null,
        asignado: props.Asignado?.people?.[0]?.name || "Sin asignar",
      };
    });

    return Response.json({
      success: true,
      data: tareas,
      total: response.results.length,
    });
  } catch (error) {
    console.error("Error fetching tareas:", error);
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}