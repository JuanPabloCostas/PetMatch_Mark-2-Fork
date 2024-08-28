'use client'

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button, Tooltip, useDisclosure, Link } from "@nextui-org/react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import FormModal from "../FormModal/FormModal";
import { getUserStatus } from "@/libs/actions/user.actions";

export default function Sidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useUser();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null); // Estado para almacenar el id del usuario
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      const isMobileDevice = window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (user && user.emailAddresses[0].emailAddress) {
        try {
          const email = user.emailAddresses[0].emailAddress;
          const userStatus = await getUserStatus(email);
          if (userStatus) {
            setUserId(userStatus.id); 
            if (!userStatus.onboarded) {
              router.push("/Onboarding");
            }
          }
        } catch (error) {
          console.error("Error fetching user status:", error);
        }
      }
    };

    checkUserStatus();
  }, [user, router]);

  return (
    <nav
      className="xl:h-screen shadow-xl xl:w-fit w-full flex justify-between lg:flex-col p-1 sm:p-4"
      style={{ boxShadow: "1px 0 6px rgba(0, 0, 0, 0.05)" }}
    >
      <div className="flex xl:h-full xl:flex-col xl:gap-4 w-full justify-between flex-row">
        <Image
          src="/ZORRO_SIN1.webp"
          width={60}
          height={60}
          alt="Logo"
          className="hidden xl:block -mt-6"
        />
        <div className="flex flex-row sm:gap-10 w-full justify-evenly xl:h-full xl:flex-col xl:gap-8 xl:mt-4 lg:gap-6 lg:mt-2 xl:text-center xl:items-center">
          <Tooltip content="Recomendaciones" placement="right" size="sm">
            <Button
              variant="light"
              className="p-6 bg-primary hover:bg-primary-500 hover:text-white transition-all duration-300"
              color="primary"
              radius="sm"
              isIconOnly
              as={Link}
              href={isMobile ? "/user/MobilePrincipalPage" : "/user/PrincipalPage"}
            >
              <span className="material-symbols-outlined">local_library</span>
            </Button>
          </Tooltip>
          <Tooltip content="Catálogo" placement="right" size="sm">
            <Button
              variant="light"
              className="p-6 bg-primary hover:bg-primary-500 hover:text-white transition-all duration-300"
              color="primary"
              radius="sm"
              isIconOnly
              as={Link}
              href={isMobile ? "/user/MobileCatalogue" : "/user/Catalogue"}
            >
              <span className="material-symbols-outlined">auto_stories</span>
            </Button>
          </Tooltip>
          <Tooltip content="Comunidad" placement="right" size="sm">
            <Button
              variant="light"
              className="p-6 bg-primary hover:bg-primary-500 hover:text-white transition-all duration-300"
              color="primary"
              radius="sm"
              isIconOnly
              as={Link}
              href="/user/Community"
            >
              <span className="material-symbols-outlined">groups</span>
            </Button>
          </Tooltip>
          <Tooltip content="Subir" placement="right" size="sm">
            <Button
              variant="light"
              className="p-6 bg-primary hover:bg-primary-500 hover:text-white transition-all duration-300"
              color="primary"
              radius="sm"
              isIconOnly
              onPress={onOpen}
            >
              <span className="material-symbols-outlined">add_a_photo</span>
            </Button>
          </Tooltip>
          <Tooltip content="Consultar" placement="right" size="sm">
            <Button
              variant="light"
              className="p-6 bg-primary hover:bg-primary-500 hover:text-white transition-all duration-300"
              color="primary"
              radius="sm"
              isIconOnly
              onClick={() => {
                if (userId) {
                  router.push(`/user/Profile/${userId}`);
                } else {
                  console.error("User ID not available");
                }
              }}
            >
              <span className="material-symbols-outlined">assignment_ind</span>
            </Button>
          </Tooltip>
          
          <div className="mt-auto">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </div>
        </div>
      </div>

      <FormModal isOpen={isOpen} onClose={onClose} />
    </nav>
  );
}
