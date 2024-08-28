import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Extraer el parentId de los parámetros de la solicitud
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId');

    if (!parentId) {
      return NextResponse.json({
        code: 400,
        message: "El parámetro 'parentId' es requerido.",
      });
    }


    // Contar el número de comentarios hijos que tienen el mismo parentId
    const childrenCount = await prisma.comment.count({
      where: {
        parentId: parentId,
      },
    });

    // Devolver una respuesta JSON con el número de comentarios hijos
    return NextResponse.json({
      code: 200,
      message: "Número de comentarios hijos recuperados correctamente.",
      data: { parentId, childrenCount },
    });

  } catch (error) {
    console.error("Error fetching children comments count:", error);
    return NextResponse.json({
      code: 500,
      message: "Ocurrió un error en el servidor.",
    });
  }
}
