"use client";

import { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function NavbarHome() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  async function handleLogoff() {
    await axios.get("/api/auth/logoff");
    router.push("/");
  }

  const menuItems = [
    { label: "Início", url: "/" },
    { label: "Sobre o sistema", url: "#" },
    { label: "Contato", url: "#" },
  ];

  return (
    <Navbar
      style={{ backgroundColor: "transparent" }}
      isBordered
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <img width={200} src="logo-2023102012330337783.jpeg" alt="" />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={`${item.label}-${index}`}>
            <Link className="text-white" href={item.url}>
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            as={Link}
            color="primary"
            onClick={handleLogoff}
            variant="flat"
          >
            Logoff
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu style={{ backgroundColor: "rgb(0,0,0,0.8)" }}>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.label}-${index}`}>
            <Link className="text-white w-full" href={item.url} size="lg">
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
