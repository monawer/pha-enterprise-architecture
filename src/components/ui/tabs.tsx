
import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

export function Tabs({ 
  value, 
  onValueChange, 
  children, 
  className = "",
  defaultValue 
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  defaultValue?: string;
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "");
  
  const currentValue = value !== undefined ? value : internalValue;
  const handleValueChange = onValueChange || setInternalValue;

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={cn("tabs", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex gap-2 border-b border-gray-200 mb-4", className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({ 
  value, 
  children, 
  className = "" 
}: { 
  value: string; 
  children: React.ReactNode; 
  className?: string; 
}) {
  const context = React.useContext(TabsContext);
  
  if (!context) {
    throw new Error("TabsTrigger must be used within a Tabs component");
  }

  const isActive = context.value === value;

  return (
    <button
      type="button"
      className={cn(
        "rounded-t px-4 py-2 font-medium transition focus:outline-none border-b-2",
        isActive 
          ? "border-blue-500 text-blue-600 bg-blue-50" 
          : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300",
        className
      )}
      onClick={() => context.onValueChange(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ 
  value, 
  children, 
  className = "" 
}: { 
  value: string; 
  children: React.ReactNode; 
  className?: string; 
}) {
  const context = React.useContext(TabsContext);
  
  if (!context) {
    throw new Error("TabsContent must be used within a Tabs component");
  }

  if (context.value !== value) {
    return null;
  }

  return (
    <div className={className}>
      {children}
    </div>
  );
}
