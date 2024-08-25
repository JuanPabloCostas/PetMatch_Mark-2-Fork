"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

import {
  Modal,
  ModalContent,
  Button,
  CircularProgress,
  ModalFooter,
} from "@nextui-org/react";
import FormNewPost from "../FormNewPost/FormNewPost";
import { useUser } from "@clerk/nextjs";

interface FormData {
  types?: string[];
  breeds?: string[];
  colors?: string[];
  size?: string[];
  age?: string[];
  training?: string[];
  temperament?: string[];
  cost?: string[];
  time?: string[];
  weather?: string[];
  sizeH?: string[];
  description?: string;
  instagram?: string;
  whatsapp?: string;
  facebook?: string;
}

const initialFormData: FormData = {
  types: [],
  breeds: [],
  colors: [],
  size: [],
  age: [],
  training: [],
  temperament: [],
  cost: [],
  time: [],
  weather: [],
  sizeH: [],
  description: "",
  instagram: "",
  whatsapp: "",
  facebook: "",
};

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FormModal({ isOpen, onClose }: FormModalProps) {
  const [step, setStep] = useState<number>(1);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const imageIptRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useUser();

  const handleShowImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024 || !file.type.startsWith("image/")) {
        alert("El archivo debe ser una imagen y no superar los 8MB");
        setImageUrl(null);
        e.target.value = "";
        return;
      }
      setImageUrl(URL.createObjectURL(file));
      e.target.value = "";
    }
  };

  const handleFormDataChange = (data: FormData) => {
    setFormData(data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2);
      return; // No enviar el formulario en el primer paso
    }

    if (step === 2 && !imageUrl) {
      alert("Por favor, selecciona una imagen antes de enviar.");
      return;
    }
    setIsLoading(true);

    try {
      if (imageUrl) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        const imageFormData = new FormData();
        imageFormData.append("image", blob, "image.jpg");

        const uploadResponse = await fetch("/api/uploadImage", {
          method: "POST",
          body: imageFormData,
        });

        if (uploadResponse.ok) {
          const data = await uploadResponse.json();
          console.log("Imagen subida correctamente. URL:", data.url);

          const postFormData = {
            ...formData,
            imageUrl: data.url,
            email: user?.primaryEmailAddress?.emailAddress,
          };

          const postResponse = await fetch("/api/posts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(postFormData),
          });

          if (postResponse.ok) {
            console.log("Formulario enviado correctamente.");
          } else {
            console.error(
              "Error al enviar los datos. Estado:",
              postResponse.status
            );
          }
        } else {
          console.error(
            "Error al subir la imagen. Estado:",
            uploadResponse.status
          );
        }
      } else {
        console.error("La URL de la imagen es nula. No se puede subir.");
      }
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="p-2"
      size="lg"
      hideCloseButton
    >
      <ModalContent className="max-h-[90vh] overflow-auto">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <FormNewPost
                onFormDataChange={handleFormDataChange}
                formData={formData}
              />
            </div>
          )}
          {step === 2 && (
            <div className="flex flex-col items-center justify-center gap-4 p-4 border-2 border-dashed border-gray-400 rounded-lg h-[500px]">
              {!imageUrl ? (
                <div className="flex flex-col items-center justify-center">
                  <p className="text-gray-600 text-center">
                    Arrastra las fotos aquí
                  </p>
                  <Button
                    size="lg"
                    className="text-black bg-secondary-200 mt-4"
                    onPress={() => imageIptRef.current?.click()}
                  >
                    Seleccionar Imagen
                  </Button>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={imageUrl}
                    alt="Imagen seleccionada"
                    layout="fill"
                    objectFit="contain"
                    className="rounded-lg"
                  />
                  <Button
                    size="sm"
                    className="absolute top-2 right-2 bg-red-600 text-white"
                    onPress={handleRemoveImage}
                  >
                    Cambiar Imagen
                  </Button>
                </div>
              )}

              <input
                type="file"
                className="hidden"
                accept="image/*"
                ref={imageIptRef}
                onChange={handleShowImage}
              />
            </div>
          )}
          <ModalFooter className="flex justify-between w-full mt-4">
            {step === 2 && (
              <Button
                onPress={() => setStep(1)}
                size="lg"
                className="bg-secondary-200"
              >
                Atrás
              </Button>
            )}
            <Button type="submit" size="lg" className="bg-success-300">
              {isLoading ? (
                <CircularProgress size="sm" color="secondary" />
              ) : step === 1 ? (
                "Siguiente"
              ) : (
                "Subir Publicación"
              )}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}