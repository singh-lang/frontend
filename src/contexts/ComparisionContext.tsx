import { createContext, useContext, useState, ReactNode } from "react";
import { CarTypes } from "@/types/homePageTypes";

// Context type
export interface ComparisonContextType {
  comparisonCars: CarTypes[];
  addToComparison: (car: CarTypes) => void;
  removeFromComparison: (carId: string) => void;
  clearComparison: () => void;
  isInComparison: (carId: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(
  undefined
);

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [comparisonCars, setComparisonCars] = useState<CarTypes[]>([]);

  const addToComparison = (car: CarTypes) => {
    if (comparisonCars.length < 3 && !comparisonCars.find((c) => c._id === car._id)) {
      setComparisonCars([...comparisonCars, car]);
    }
  };

  const removeFromComparison = (carId: string) => {
    setComparisonCars(comparisonCars.filter((c) => c._id !== carId));
  };

  const clearComparison = () => {
    setComparisonCars([]);
  };

  const isInComparison = (carId: string) => {
    return comparisonCars.some((c) => c._id === carId);
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparisonCars,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
}
