"use client";

export default function JsonLd({ id, data }: { id: string; data: object | object[] }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
