'use client';

import React, { useState } from 'react';
import AuthModal from '@/components/Auth/AuthModel';

const AuthPage = () => {
  const [showModal, setShowModal] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div>
        <h1 className="text-2xl font-semibold mb-4">Auth Module Test Page</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Open Auth Modal
        </button>

        {/* ✅ Include required onSuccess prop */}
        {showModal && (
          <AuthModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              console.log('Auth success!');
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
