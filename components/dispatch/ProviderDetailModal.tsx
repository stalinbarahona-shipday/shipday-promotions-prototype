"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";

interface ProviderDetail {
  name: string;
  subtitle: string;
  logoColor: string;
  logoLetter: string;
  howItWorks: string;
  pricing: string;
  availability: string;
  availabilityWarning: boolean;
  acceptText: string;
}

const providerDetails: Record<string, ProviderDetail> = {
  nash: {
    name: "Nash",
    subtitle: "Multi-carrier delivery orchestration",
    logoColor: "#2563EB",
    logoLetter: "N",
    howItWorks:
      "Nash aggregates multiple delivery providers into a single API. When an order is placed, Nash automatically finds the best available driver across all connected carriers, optimizing for cost, speed, and reliability. Orders are dispatched in real-time with full tracking visibility.",
    pricing: "Per-delivery fee based on distance and carrier rates",
    availability: "Available in 250+ US cities",
    availabilityWarning: false,
    acceptText:
      "I agree to share order details and customer information with Nash",
  },
  doordash: {
    name: "DoorDash Drive",
    subtitle: "On-demand delivery fulfillment",
    logoColor: "#FF3008",
    logoLetter: "D",
    howItWorks:
      "DoorDash Drive provides access to DoorDash's network of Dashers for your delivery needs. Orders are automatically matched with nearby available drivers. Real-time tracking and proof of delivery included with every order. Average pickup time is 15–20 minutes in supported markets.",
    pricing: "Starting at $6.99 per delivery, volume discounts available",
    availability: "Available in all DoorDash markets across the US",
    availabilityWarning: false,
    acceptText:
      "I agree to share order details and customer information with DoorDash",
  },
  uber: {
    name: "Uber Direct",
    subtitle: "Delivery powered by Uber",
    logoColor: "#000000",
    logoLetter: "U",
    howItWorks:
      "Uber Direct connects your business to Uber's extensive driver network for on-demand delivery. Orders are dispatched to the nearest available driver with real-time ETA updates. White-label tracking links are provided for your customers. Supports scheduled and on-demand delivery.",
    pricing: "Distance-based pricing, starting at $5.99 per delivery",
    availability: "Limited availability — currently expanding to new markets",
    availabilityWarning: true,
    acceptText:
      "I agree to share order details and customer information with Uber",
  },
  relay: {
    name: "Relay",
    subtitle: "Local delivery service for businesses",
    logoColor: "#16A34A",
    logoLetter: "R",
    howItWorks:
      "Relay provides dedicated delivery drivers for local businesses. Drivers are pre-assigned to your area for faster pickup times. Batch delivery optimization reduces per-order costs for high-volume merchants. All deliveries include real-time tracking and customer notifications.",
    pricing: "Monthly subscription + per-delivery fee",
    availability: "Currently available in select metro areas only",
    availabilityWarning: true,
    acceptText:
      "I agree to share order details and customer information with Relay",
  },
  "doordash-catering": {
    name: "DoorDash Catering",
    subtitle: "Catering delivery fulfillment",
    logoColor: "#FF3008",
    logoLetter: "D",
    howItWorks:
      "DoorDash Catering connects you to DoorDash's network of drivers specialized in handling larger catering orders. Orders are matched with drivers experienced in multi-bag and tray deliveries. Real-time tracking and proof of delivery included with every order.",
    pricing: "Starting at $12.99 per delivery, volume discounts available",
    availability: "Available in major DoorDash markets across the US",
    availabilityWarning: false,
    acceptText:
      "I agree to share order details and customer information with DoorDash",
  },
  dlivrd: {
    name: "Dlivrd",
    subtitle: "Premium catering delivery service",
    logoColor: "#6B21A8",
    logoLetter: "d",
    howItWorks:
      "Dlivrd specializes in catering deliveries with professional drivers trained for large orders. Drivers handle setup and presentation at the delivery location. Includes scheduled delivery windows, real-time tracking, and photo confirmation on every order.",
    pricing: "Per-delivery fee based on order size and distance",
    availability: "Available in 30+ major US metro areas",
    availabilityWarning: false,
    acceptText:
      "I agree to share order details and customer information with Dlivrd",
  },
};

interface ProviderDetailModalProps {
  providerId: string;
  onClose: () => void;
  onConnect: (providerId: string) => void;
}

export default function ProviderDetailModal({
  providerId,
  onClose,
  onConnect,
}: ProviderDetailModalProps) {
  const [accepted, setAccepted] = useState(false);
  const detail = providerDetails[providerId];

  if (!detail) return null;

  return (
    /* Overlay */
    <div
      className="fixed inset-0 flex flex-col justify-center items-center"
      style={{
        background: "rgba(10, 10, 10, 0.5)",
        zIndex: 3,
        padding: "40px 0",
      }}
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="flex flex-col bg-white rounded-[20px]"
        style={{ width: 636, height: 630 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex flex-row items-start"
          style={{ padding: 24, gap: 20, height: 108 }}
        >
          {/* Logo + Title */}
          <div
            className="flex flex-row items-center flex-1"
            style={{ gap: 20 }}
          >
            {/* Logo container */}
            <div
              className="box-border flex items-center justify-center border border-border-default rounded-lg"
              style={{ width: 60, height: 60, padding: 10 }}
            >
              <div
                className="flex items-center justify-center rounded-[4px]"
                style={{
                  width: 40,
                  height: 40,
                  background: detail.logoColor,
                }}
              >
                <span
                  className="text-white font-[800]"
                  style={{ fontSize: 20, lineHeight: 1 }}
                >
                  {detail.logoLetter}
                </span>
              </div>
            </div>

            {/* Title text */}
            <div className="flex flex-col flex-1" style={{ gap: 4 }}>
              <h2
                className="font-[800] text-neutral-950 tracking-[-0.02em]"
                style={{ fontSize: 24, lineHeight: "140%" }}
              >
                {detail.name}
              </h2>
              <p
                className="text-neutral-600"
                style={{ fontSize: 16, fontWeight: 400, lineHeight: "140%" }}
              >
                {detail.subtitle}
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="flex items-start bg-white rounded-[99px] cursor-pointer border-none"
            style={{ padding: 8, width: 40, height: 40 }}
          >
            <Icon name="close" size={24} color="#404040" />
          </button>
        </div>

        {/* Content container */}
        <div className="flex flex-col" style={{ height: 430 }}>
          {/* Info fields */}
          <div className="flex flex-col">
            {/* How it works */}
            <div
              className="flex flex-col"
              style={{ padding: "8px 24px 16px", gap: 4 }}
            >
              <span
                className="font-medium text-neutral-950"
                style={{ fontSize: 16, lineHeight: "140%" }}
              >
                How it works
              </span>
              <p
                className="text-neutral-600"
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  lineHeight: "150%",
                  margin: 0,
                }}
              >
                {detail.howItWorks}
              </p>
            </div>

            {/* Pricing */}
            <div
              className="flex flex-col"
              style={{ padding: "16px 24px", gap: 4 }}
            >
              <span
                className="font-medium text-neutral-950"
                style={{ fontSize: 16, lineHeight: "140%" }}
              >
                Pricing
              </span>
              <p
                className="text-neutral-600"
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  lineHeight: "150%",
                  margin: 0,
                }}
              >
                {detail.pricing}
              </p>
            </div>

            {/* Availability */}
            <div
              className="flex flex-col"
              style={{ padding: "16px 24px", gap: 4 }}
            >
              <span
                className="font-medium text-neutral-950"
                style={{ fontSize: 16, lineHeight: "140%" }}
              >
                Availability
              </span>
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  lineHeight: "150%",
                  margin: 0,
                  color: detail.availabilityWarning ? "#D92D20" : "#404040",
                }}
              >
                {detail.availability}
              </p>
            </div>
          </div>

          {/* Checkbox section */}
          <div
            className="flex flex-col"
            style={{ padding: "8px 24px 24px", gap: 4 }}
          >
            <div
              className="flex flex-row items-center cursor-pointer"
              style={{ height: 40 }}
              onClick={() => setAccepted(!accepted)}
            >
              {/* Checkbox icon */}
              <div
                className="flex items-center justify-center"
                style={{ width: 40, height: 40, padding: 8 }}
              >
                {accepted ? (
                  <Icon name="check_box" size={24} color="#008062" fill={true} />
                ) : (
                  <Icon name="check_box_outline_blank" size={24} color="#737373" />
                )}
              </div>
              <span
                className="text-neutral-950"
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  lineHeight: "150%",
                }}
              >
                {detail.acceptText}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="box-border flex flex-row justify-end items-center border-t border-border-default"
          style={{ padding: "20px 28px", gap: 16, height: 92 }}
        >
          {/* Cancel button */}
          <button
            onClick={onClose}
            className="flex justify-center items-center bg-white rounded-lg cursor-pointer border-none"
            style={{ padding: "11px 20px", height: 48 }}
          >
            <span
              className="font-medium text-neutral-700"
              style={{ fontSize: 16, lineHeight: "22px" }}
            >
              Cancel
            </span>
          </button>

          {/* Connect service button */}
          <button
            onClick={() => accepted && onConnect(providerId)}
            className="flex justify-center items-center rounded-lg border-none"
            style={{
              padding: "11px 20px",
              height: 48,
              background: accepted ? "#008062" : "#F4F4F8",
              cursor: accepted ? "pointer" : "default",
            }}
          >
            <span
              className="font-medium"
              style={{
                fontSize: 16,
                lineHeight: "22px",
                color: accepted ? "#FFFFFF" : "#A3A3A3",
              }}
            >
              Connect service
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
