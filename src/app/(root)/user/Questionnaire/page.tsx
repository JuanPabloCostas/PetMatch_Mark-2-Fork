"use client";
import QuestionaireForm from "@/Components/QuestionaireFrom/QuestionaireForm";
import React, { useState } from "react";
import { Divider } from "@nextui-org/divider";
import { Image } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function Questionaire() {
  const [formValues, setFormValues] = useState({});
  const navigate = useRouter();
  const { user } = useUser();

  

  const handleSubmit = async () => {
    // Agrega la propiedad email a formValues
    const formData = { ...formValues, email: user?.primaryEmailAddress?.emailAddress };

    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      const data = await response.json();
      // Puedes manejar la respuesta del servidor aquí, por ejemplo, mostrando un mensaje de éxito

      if (data.code == 201) {
        alert(data.message);
        navigate.push('/user/PrincipalPage');
      }

      if (data.code == 500) {
        alert("Error al enviar el cuestionario");
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      // Puedes manejar el error aquí, por ejemplo, mostrando un mensaje de error
      alert("Error al enviar el formulario");
    }
  };

  return (
    <div>
      <div className="block">
        <h1 className="ml-10 text-6xl font-bold">Cuestionario</h1>
        <Divider />
      </div>
      <div className="mt-6 w-full h-full flex justify-between items-center">
        <div className="overflow-auto w-full max-h-[720px] p-6">
          <QuestionaireForm setFormValues={setFormValues} />
          <div className="bottom-10 right-20">
            <Button
              type="submit"
              className="bg-success-300 font-bold text-xl"
              onClick={handleSubmit}
            >
              Enviar Cuestionario
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
