import Image from "next/image";

interface DirhamSymbolProps {
  className?: string;
}

export default function DirhamSymbol({
  className = "w-17 h-17",
}: DirhamSymbolProps) {
  return (
    <Image
      src="/assets/dirham.png"
      alt="AED"
      className={`inline-block ${className}`}
      height={100}
      width={100}
    />
  );
}
