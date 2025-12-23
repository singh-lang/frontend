import React from "react";

export function createControlWithIcon(Icon: React.FC) {
  return function Control({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex items-center gap-2">
        <Icon />
        {children}
      </div>
    );
  };
}
