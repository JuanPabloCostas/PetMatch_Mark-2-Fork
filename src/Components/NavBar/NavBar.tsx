import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import Image from "next/image";

export default function NavBar() {
    return (
        <Navbar isBordered>
            <NavbarBrand>
                <Image
                    src="/Logo.svg"
                    width={50}
                    height={50}
                    alt="Picture of the author"
                />
                <p className="font-bold text-inherit text-xl">PetMatch</p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4m justify-between" >
                <NavbarItem isActive>
                    <Link color="foreground" href="#">
                        Inicio
                    </Link>
                </NavbarItem>
                <NavbarItem >
                    <Link color="foreground" href="#">
                        Adopta +
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Acerca de Nosotros
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <Button as={Link} href="#" variant="bordered" className="border-[#FEAE21] text-md">
                        Iniciar Sesión
                    </Button>
                </NavbarItem>
                <NavbarItem>
                    <Button as={Link} href="#" variant="solid" className="bg-[#99E550] font-bold text-md">
                        Registrate
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}