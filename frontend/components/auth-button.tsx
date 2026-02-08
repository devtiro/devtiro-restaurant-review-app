"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "react-oidc-context";

export default function AuthButton() {
  const { signinRedirect, signoutRedirect, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    try {
      await signinRedirect();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signoutRedirect();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isAuthenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage
              src="/placeholder.svg?height=32&width=32"
              alt="User avatar"
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/restaurants/create">Add Restaurant</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return <Button onClick={handleLogin}>Login</Button>;
}
