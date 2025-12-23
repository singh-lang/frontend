"use client";

import React from "react";
import BookingAssistModal from "@/components/Auth/BookingAssistModal";

const BookPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = (data: { name: string; email: string; phone: string }) => {
    console.log("Form submitted with data:", data);
    // TODO: Add backend call or API route here (e.g., fetch("/api/book-assist", { method: "POST", body: JSON.stringify(data) }))
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Book Your Drive</h1>

      <button
        onClick={handleOpenModal}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Get Booking Assistance
      </button>

      <BookingAssistModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default BookPage;
