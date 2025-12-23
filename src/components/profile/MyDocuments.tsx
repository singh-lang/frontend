"use client";

import { FileText, CheckCircle, Download, Clock } from "lucide-react";
import { useGetDocumentsQuery } from "@/lib/api/document";

export default function MyDocuments() {
  const { data, isLoading, isError } = useGetDocumentsQuery({});

  // Your API shape: { success: true, data: { emiratesIdFront: {key, filename}, ... } }
  const docs = data?.data || {};

  const items = [
    { key: "emiratesIdFront", title: "Emirates ID", subtitle: "Front" },
    { key: "emiratesIdBack", title: "Emirates ID", subtitle: "Back" },
    { key: "drivingLicenseFront", title: "Driving License", subtitle: "Front" },
    { key: "drivingLicenseBack", title: "Driving License", subtitle: "Back" },
    { key: "passport", title: "Passport", subtitle: "Optional for residents" },
    { key: "visa", title: "Visa Copy", subtitle: "For tourists" },
  ].map((i) => {
    const f = docs[i.key];
    const uploaded = Boolean(f?.key);
    return {
      ...i,
      filename: f?.filename || "",
      href: f?.key || "",
      status: uploaded ? "Uploaded" : "Missing",
      Icon: uploaded ? CheckCircle : Clock,
    };
  });

  return (
    <div>
      <h2 className="text-xl font-bold text-dark-base mb-6">My Documents</h2>

      {isLoading && <p className="text-sm text-grey">Loading documents…</p>}
      {isError && (
        <p className="text-sm text-warning">Couldn’t load documents. Please try again.</p>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((doc, idx) => (
            <div
              key={idx}
              className="border-2 border-soft-grey/20 rounded-xl p-6 hover:border-accent/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-site-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-dark-base mb-1">{doc.title}</h3>
                  <p className="text-sm text-grey mb-3">{doc.subtitle}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <doc.Icon
                      className={`w-4 h-4 ${
                        doc.status === "Uploaded" ? "text-success" : "text-warning"
                      }`}
                    />
                    <span
                      className={`text-xs font-semibold ${
                        doc.status === "Uploaded" ? "text-success" : "text-warning"
                      }`}
                    >
                      {doc.status}
                    </span>
                    {doc.filename && <span className="text-xs text-grey">• {doc.filename}</span>}
                  </div>

                  {doc.status === "Uploaded" && doc.href ? (
                    <a
                      href={doc.href}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-site-accent hover:text-slate-teal transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </a>
                  ) : (
                    <button
                      className="flex items-center gap-2 text-sm text-grey/60 cursor-not-allowed"
                      disabled
                      title="No file available"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-xl">
        <p className="text-sm text-grey">
          <strong className="text-dark-base">Note:</strong> All documents are securely stored and
          encrypted. You can update your documents anytime from your profile setup.
        </p>
      </div>
    </div>
  );
}
