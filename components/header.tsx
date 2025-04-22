"use server";

import { cn } from "@/lib/utils";
import React from "react";

import Link from "next/link";
import { auth } from "@/auth";
import AccountDropdownButton from "./account-dropdown-button";

export default async function Header({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const session = await auth();

  return (
    <div
      className={cn(
        "flex gap-6 h-14 justify-between items-center ms-5 me-5",
        className
      )}
      {...props}
    >
      <div>
        <Link href="/">
          <h1 className="text-xl font-bold">Quizzer</h1>
        </Link>
      </div>
      <div className="flex gap-5">
        <AccountDropdownButton session={session} />
      </div>
    </div>
  );
}
