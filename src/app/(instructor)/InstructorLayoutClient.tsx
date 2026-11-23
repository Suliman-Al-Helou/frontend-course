"use client";

import React from "react";
import type { User } from "@/types";

interface InstructorLayoutClientProps {
  user: User;
  children: React.ReactNode;
}

export default function InstructorLayoutClient({
  user: _user,
  children,
}: InstructorLayoutClientProps) {
  return <div className="min-h-screen bg-background text-foreground">{children}</div>;
}
