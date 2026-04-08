"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface InviteLocalModalProps {
  onClose: () => void;
  onInvite: (company: { name: string; email: string }) => void;
}

export default function InviteLocalModal({ onClose, onInvite }: InviteLocalModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const isValid = name.trim().length > 0 && email.trim().includes("@");

  const handleSubmit = () => {
    if (!isValid) return;
    onInvite({ name: name.trim(), email: email.trim() });
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: "rgba(10,10,10,0.5)", zIndex: 10 }}
      onClick={onClose}
    >
      <div
        className="flex flex-col bg-white rounded-[20px]"
        style={{ width: 520 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex flex-row items-start justify-between"
          style={{ padding: "28px 28px 0" }}
        >
          <div className="flex flex-col" style={{ gap: 6 }}>
            <span
              className="font-[800] tracking-[-0.02em]"
              style={{ fontSize: 20, lineHeight: "140%", color: "#0A0A0A" }}
            >
              Invite a local delivery partner
            </span>
            <span
              style={{ fontSize: 15, fontWeight: 400, lineHeight: "160%", color: "#525252" }}
            >
              We'll send them an email to join your Shipday network.
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center bg-white rounded-full cursor-pointer border-none shrink-0"
            style={{ width: 36, height: 36, marginLeft: 16 }}
          >
            <X size={20} color="#404040" />
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col" style={{ padding: "24px 28px", gap: 16 }}>
          {/* Company name */}
          <div className="flex flex-col" style={{ gap: 6 }}>
            <label
              style={{ fontSize: 14, fontWeight: 500, lineHeight: "140%", color: "#262626" }}
            >
              Company name
            </label>
            <input
              type="text"
              placeholder="e.g. City Runners"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="outline-none rounded-lg"
              style={{
                height: 44,
                padding: "0 14px",
                fontSize: 15,
                color: "#0A0A0A",
                border: "1.5px solid #E8E8E4",
                background: "#FFFFFF",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#008062")}
              onBlur={(e) => (e.target.style.borderColor = "#E8E8E4")}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col" style={{ gap: 6 }}>
            <label
              style={{ fontSize: 14, fontWeight: 500, lineHeight: "140%", color: "#262626" }}
            >
              Contact email
            </label>
            <input
              type="email"
              placeholder="contact@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="outline-none rounded-lg"
              style={{
                height: 44,
                padding: "0 14px",
                fontSize: 15,
                color: "#0A0A0A",
                border: "1.5px solid #E8E8E4",
                background: "#FFFFFF",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#008062")}
              onBlur={(e) => (e.target.style.borderColor = "#E8E8E4")}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex flex-row justify-end items-center border-t border-border-default"
          style={{ padding: "18px 28px", gap: 10 }}
        >
          <button
            onClick={onClose}
            className="flex justify-center items-center bg-white rounded-lg cursor-pointer border-none hover:bg-neutral-50 transition-colors"
            style={{ padding: "10px 20px", height: 44 }}
          >
            <span className="font-medium" style={{ fontSize: 15, color: "#525252" }}>
              Cancel
            </span>
          </button>
          <button
            onClick={handleSubmit}
            className="flex justify-center items-center rounded-lg border-none transition-opacity duration-150"
            style={{
              padding: "10px 20px",
              height: 44,
              background: isValid ? "#008062" : "#F4F4F8",
              cursor: isValid ? "pointer" : "default",
            }}
          >
            <span
              className="font-medium"
              style={{ fontSize: 15, color: isValid ? "#FFFFFF" : "#A3A3A3" }}
            >
              Send invite
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
