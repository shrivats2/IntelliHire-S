"use client";

import { ColumnDef } from "@tanstack/react-table";
export type Applicant = {
  id: number;
  rank: number;
  name: string;
  email: string;
};

export const columns: ColumnDef<Applicant>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "rank",
    header: "Rank",
  },
];
