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
          timestamp: "created_time",
          direction: "descending",
        },
      ],
    });

    const clientes = response.results.map((page) => {
      const props = page.properties;
      return {
        id: page.id,
        nombre: props["Cliente"]?.title?.[0]?.plain_text || "Sin nombre",
        email: props["Email"]?.email || null,
        whatsapp: props["WhatsApp"]?.phone_number || null,
        rubro: props["Rubro / Nicho"]?.rich_text?.[0]?.plain_text || null,
        etapaActual: props["Etapa Actual"]?.select?.name || "Sin etapa",
        saludProyecto: props["Salud del Proyecto"]?.select?.name || "Sin estado",
        contactoPrincipal: props["Contacto Principal"]?.rich_text?.[0]?.plain_text || null,
        responsable: props["Responsable Principal"]?.people?.[0]?.name || "Sin asignar",
        instagram: props["Instagram"]?.url || null,
        web: props["Web"]?.url || null,
        proximoEntregable: props["Pr\u00f3ximo Entregable"]?.rich_text?.[0]?.plain_text || null,
        origenLead: props["Origen del Lead"]?.select?.name || null,
        inversionAcordada: props["Inversi\u00f3n Acordada"]?.number || null,
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
