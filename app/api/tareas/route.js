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
          timestamp: "created_time",
          direction: "descending",
        },
      ],
    });

    const tareas = response.results.map((page) => {
      const props = page.properties;
      return {
        id: page.id,
        titulo: props["Tarea"]?.title?.[0]?.plain_text || "Sin titulo",
        estado: props["Estado"]?.select?.name || "Sin estado",
        prioridad: props["Prioridad"]?.select?.name || "Normal",
        etapa: props["Etapa"]?.select?.name || "Sin etapa",
        persona: props["Persona"]?.people?.[0]?.name || "Sin asignar",
        deadline: props["Deadline"]?.date?.start || null,
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
