import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NEXT_PUBLIC_NOTION_TOKEN,
});

export async function GET() {
  try {
    const databaseId = process.env.NOTION_DATABASE_CLIENTES;

    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: "Creado",
          direction: "descending",
        },
      ],
    });

    // Extraer datos limpios de los clientes
    const clientes = response.results.map((page) => {
      const props = page.properties;
      return {
        id: page.id,
        nombre: props.Nombre?.title?.[0]?.plain_text || "Sin nombre",
        email: props.Email?.email || "Sin email",
        telefono: props.Teléfono?.phone_number || "Sin teléfono",
        empresa: props.Empresa?.rich_text?.[0]?.plain_text || "Sin empresa",
        estado: props.Estado?.select?.name || "Activo",
        proyecto: props.Proyecto?.relation?.length > 0 ? props.Proyecto.relation[0].id : null,
      };
    });

    return Response.json({
      success: true,
      data: clientes,
      total: response.results.length,
    });
  } catch (error) {
    console.error("Error fetching clientes:", error);
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}