"use client";

import {
  X,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Home,
  Plane,
  ExternalLink,
} from "lucide-react";
import { useState, useRef } from "react";
import Image from "next/image";
import { useAuth } from "../../contexts/AuthContext";
import { getToken } from "@/util/cookieMethods";

interface ProfileSetupProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

type UserType = "resident" | "tourist";

type ResidentDocType =
  | "emiratesIdFront"
  | "emiratesIdBack"
  | "passport"
  | "drivingLicense";

type TouristDocType = "passport" | "visa" | "idp";

type DocType = ResidentDocType | TouristDocType;

interface Document {
  type: DocType;
  file: File | null;
  preview: string | null;
  status: "pending" | "uploaded" | "verified";
}

export default function ProfileSetup({
  isOpen,
  onClose,
  onComplete,
}: ProfileSetupProps) {
  const { updateProfile } = useAuth();

  const [userType, setUserType] = useState<UserType>("resident");

  const [residentDocs, setResidentDocs] = useState<Document[]>([
    {
      type: "emiratesIdFront",
      file: null,
      preview: null,
      status: "pending" as const,
    },
    {
      type: "emiratesIdBack",
      file: null,
      preview: null,
      status: "pending" as const,
    },
    { type: "passport", file: null, preview: null, status: "pending" as const },
    {
      type: "drivingLicense",
      file: null,
      preview: null,
      status: "pending" as const,
    },
  ]);

  const [touristDocs, setTouristDocs] = useState<Document[]>([
    { type: "passport", file: null, preview: null, status: "pending" as const },
    { type: "visa", file: null, preview: null, status: "pending" as const },
    { type: "idp", file: null, preview: null, status: "pending" as const },
  ]);

  const documents = userType === "resident" ? residentDocs : touristDocs;
  const setDocuments =
    userType === "resident" ? setResidentDocs : setTouristDocs;

  // FIXED TYPED REFS
  const fileInputRefs = useRef<Record<DocType, HTMLInputElement | null>>({
    emiratesIdFront: null,
    emiratesIdBack: null,
    passport: null,
    drivingLicense: null,
    visa: null,
    idp: null,
  });

  /* ------------------ FILE HANDLING ------------------ */

  const handleFileSelect = (type: DocType, file: File) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const updated = documents.map((doc) =>
        doc.type === type
          ? {
              ...doc,
              file,
              preview: reader.result as string,
              status: "verified" as const, // FIXED
            }
          : doc,
      );

      setDocuments(updated);

      const allVerified = updated.every((d) => d.status === "verified");

      // if (allVerified) {
      //   updateProfile({
      //     profileComplete: true,
      //     documentsUploaded: true,
      //     isVerified: true,
      //   });
      // }
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent, type: DocType) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (
      file &&
      (file.type === "application/pdf" || file.type.startsWith("image/"))
    ) {
      handleFileSelect(type, file);
    }
  };

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: DocType,
  ) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(type, file);
  };

  const handleRemoveDocument = (type: DocType) => {
    setDocuments((docs) =>
      docs.map((doc) =>
        doc.type === type
          ? {
              ...doc,
              file: null,
              preview: null,
              status: "pending" as const, // FIXED
            }
          : doc,
      ),
    );
  };
  const handleSubmit = async () => {
    const allVerified = documents.every((doc) => doc.file);
    if (!allVerified) return;

    const formData = new FormData();

    formData.append("origin", userType === "resident" ? "1" : "2");

    documents.forEach((doc) => {
      if (!doc.file) return;

      let fieldName = doc.type;
      if (doc.type === "idp") fieldName = "drivingLicense";

      formData.append(fieldName, doc.file);
    });

    try {
      const token = getToken(); // ✅ THIS WAS MISSING

      if (!token) {
        alert("Session expired. Please login again.");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/complete-profile`, // ✅ FIXED URL
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`, // ✅ FIXED
          },
          credentials: "include",
        },
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Upload failed");
      }

      updateProfile({
        profileComplete: true,
        documentsUploaded: true,
        isVerified: true,
      });

      onComplete();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload documents. Please login again.");
    }
  };

  const progress = Math.round(
    (documents.filter((d) => d.status !== "pending").length /
      documents.length) *
      100,
  );

  const allUploaded = documents.every(
    (d) => d.status === "uploaded" || d.status === "verified",
  );

  const allVerified = documents.every((d) => d.status === "verified");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-dark-base/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-off-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-grey/10 hover:bg-grey/20"
        >
          <X className="w-5 h-5 text-dark-base" />
        </button>

        {/* --------------------------------------------------------------
            EVERYTHING BELOW IS EXACTLY YOUR UI, UNCHANGED
            ONLY ref and status typing fixed
           -------------------------------------------------------------- */}

        <div className="p-8">
          <Image
            src="/dlogo.png"
            width={200}
            height={60}
            unoptimized
            alt="logo"
            className="h-12 w-auto mb-4"
          />

          <h2 className="text-3xl font-bold text-dark-base mb-2">
            Complete Your Profile
          </h2>
          <p className="text-grey">
            Upload your documents to unlock car rentals.
          </p>

          {/* USER TYPE SWITCH */}
          <div className="flex gap-3 mb-8 mt-6">
            <button
              onClick={() => setUserType("resident")}
              className={`flex-1 py-3 px-4 rounded-xl border-2 font-semibold flex items-center justify-center gap-2 ${
                userType === "resident"
                  ? "bg-accent/10 border-accent text-accent"
                  : "bg-white border-grey/20 text-grey"
              }`}
            >
              <Home className="w-5 h-5" />
              UAE Resident
            </button>

            <button
              onClick={() => setUserType("tourist")}
              className={`flex-1 py-3 px-4 rounded-xl border-2 font-semibold flex items-center justify-center gap-2 ${
                userType === "tourist"
                  ? "bg-accent/10 border-accent text-accent"
                  : "bg-white border-grey/20 text-grey"
              }`}
            >
              <Plane className="w-5 h-5" />
              Tourist
            </button>
          </div>

          {/* PROGRESS BAR */}
          <div className="mb-8">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-dark-base">
                Profile Completion
              </span>
              <span className="text-sm font-bold text-accent">{progress}%</span>
            </div>
            <div className="h-2 w-full bg-grey/20 rounded-full">
              <div
                className="h-full bg-accent rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* IDP TIP */}
          {userType === "tourist" && (
            <a
              href="/idp-requirements"
              target="_blank"
              className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between group"
            >
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-blue-900">Need an IDP?</h4>
                  <p className="text-sm text-blue-700">
                    Check requirements for your nationality.
                  </p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-blue-700 group-hover:translate-x-0.5 transition" />
            </a>
          )}

          {/* DOCUMENT UPLOAD FIELDS */}
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.type}
                className="bg-white rounded-xl p-4 border border-grey/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-accent" />
                    <span className="font-semibold">{doc.type}</span>
                  </div>

                  {doc.status === "verified" && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                {!doc.preview ? (
                  <div
                    onClick={() => fileInputRefs.current[doc.type]?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, doc.type)}
                    className="border-2 border-dashed border-grey/30 p-6 rounded-xl text-center cursor-pointer hover:border-accent/50"
                  >
                    <Upload className="w-8 h-8 text-grey mx-auto mb-3" />
                    <p className="text-sm font-medium">
                      Drop your file or click to browse
                    </p>
                    <p className="text-xs text-grey">PDF, JPG, PNG — Max 5MB</p>

                    {/* FIXED REF CALLBACK */}
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      ref={(el) => {
                        fileInputRefs.current[doc.type] = el;
                      }}
                      onChange={(e) => handleFileInputChange(e, doc.type)}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="flex gap-3 p-3 bg-grey/5 border border-grey/20 rounded-lg">
                    {doc.file?.type === "application/pdf" ? (
                      <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-8 h-8 text-red-600" />
                      </div>
                    ) : (
                      <Image
                        src={doc.preview}
                        alt="Preview"
                        width={64}
                        height={64}
                        className="rounded-lg object-cover"
                        unoptimized
                      />
                    )}

                    <div className="flex-1">
                      <p className="text-sm font-medium truncate">
                        {doc.file?.name}
                      </p>
                      <p className="text-xs text-grey">
                        {(doc.file!.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemoveDocument(doc.type)}
                      className="text-grey hover:text-red-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* FINISH MESSAGE */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-blue-900">
              Once all documents are uploaded, you can instantly start booking.
            </p>
          </div>

          {/* BUTTONS */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-white border border-grey/20 rounded-xl font-semibold hover:bg-grey/5"
            >
              Skip for Now
            </button>

            <button
              onClick={handleSubmit}
              disabled={!allUploaded}
              className="flex-1 py-3 bg-accent text-white rounded-xl font-semibold disabled:opacity-50"
            >
              {allVerified ? "Done" : "Submit Documents"}
            </button>
          </div>

          <p className="text-xs text-grey text-center mt-4">
            Your documents are securely encrypted. We never share your data.
          </p>
        </div>
      </div>
    </div>
  );
}
