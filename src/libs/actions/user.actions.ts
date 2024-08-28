export async function getUserStatus(email: string): Promise<{ id: string; photoUrl: string; onboarded: boolean } | null> {
  try {
    const response = await fetch(`/api/auth/onboarding?email=${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    const { id, photoUrl, onboarded } = data.data;
    
    return { id, photoUrl, onboarded };
    
  } catch (error) {
    console.error("Failed to fetch user status:", error);
    return null; // Maneja el error de manera adecuada en tu aplicación
  }
}

export async function fetchVeterinarianData(id: string) {
  try {
    const response = await fetch(`/api/profile?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const resBody = await response.json();

    if (!response.ok) {
      throw new Error(resBody.message || "Error fetching comments");
    }

    return resBody.data; // Asegúrate de que esto devuelva el comentario principal y sus childrenComments
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}
