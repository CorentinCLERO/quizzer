'use client'

import React from "react";
import { ModeToggle } from "./mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { BadgeCheck, LogIn, LogOut } from "lucide-react";
import { Session } from "next-auth";
import { logout } from "../app/lib/actions/auth";

export default function AccountDropdownButton({
  session,
}: {
  session: Session | null;
}) {
  const nameInitials = session && session.user?.name
  ? session.user.name
      .split(" ")
      .map((n, i) => (i <= 1 ? n[0] : ""))
      .join("")
  : "QZ"
  const picture = session && session.user?.image ? session.user.image : undefined

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage src={picture} alt={"salut"} />
            <AvatarFallback className="rounded-md">
              {nameInitials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          // side={isMobile ? "bottom" : "right"}
          align="start"
          sideOffset={4}
        >
          {session ? (
            <>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-md">
                    <AvatarImage src={picture} alt={"corentin"} />
                    <AvatarFallback className="rounded-md">
                      {session.user?.name}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {session.user?.name}
                    </span>
                    <span className="truncate text-xs">{"user.email"}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem onClick={() => (window.location.href = "/login")}>
              <LogIn />
              Log In
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ModeToggle />
    </>
  );
}
