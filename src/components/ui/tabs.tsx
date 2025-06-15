
import * as React from "react";
import { cn } from "@/lib/utils";

export function Tabs({ value, onValueChange, children, className = "" }: any) {
  return (
    <div className={cn("tabs", className)}>
      {children}
    </div>
  );
}

export function TabsList({ children, className = "" }: any) {
  return (
    <div className={cn("flex gap-2", className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className = "", onClick }: any) {
  return (
    <button
      type="button"
      className={cn("rounded px-4 py-2 font-bold transition focus:outline-none", className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className = "" }: any) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
