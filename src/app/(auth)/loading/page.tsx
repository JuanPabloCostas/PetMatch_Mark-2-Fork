"use client";

import { getUserStatus } from "@/libs/actions/user.actions";
import { useUser } from "@clerk/nextjs";
import { Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {

  const { user } = useUser();
  const router = useRouter();

  // useEffect(() => {
  //   const checkUserStatus = async () => {
  //     if (user && user.emailAddresses[0].emailAddress) {
  //       try {
  //         const email = user.emailAddresses[0].emailAddress;
  //         const userStatus = await getUserStatus(email);
  //         if (userStatus && userStatus.onboarded) {
  //           router.push('/user/PrincipalPage');
  //         } else {
  //           router.push('/Onboarding');
  //         }
  //       } catch (error) {
  //         console.error("Error fetching user status:", error);
  //       }
  //     }
  //   };

  //   checkUserStatus();
  // }, [user, router]);

  return (
    <>
      <div>Loading...</div>
      <Spinner />
    </>
  )
}