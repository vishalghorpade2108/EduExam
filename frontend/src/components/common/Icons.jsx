// File: Icons.jsx
import React from "react";

// 1️⃣ Upload Exam (PDF)
export const UploadIcon = ({ width = 44, height = 44 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M12 3V15M12 3L8 7M12 3L16 7" stroke="#00437E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 21H20C20 21 20 15 20 12C20 9 20 3 20 3H4C4 3 4 9 4 12C4 15 4 21 4 21Z" stroke="#0092E3" strokeWidth="2"/>
  </svg>
);

// 2️⃣ Customizable Exams / Personalization
export const UserCustomizationIcon = ({ width = 44, height = 44 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="7" r="4" stroke="#00437E" strokeWidth="2"/>
    <path d="M4 21C4 16 8 14 12 14C16 14 20 16 20 21" stroke="#0092E3" strokeWidth="2"/>
    <path d="M2 7H6" stroke="#00437E" strokeWidth="2"/>
    <path d="M18 7H22" stroke="#00437E" strokeWidth="2"/>
  </svg>
);

// 3️⃣ Secure Browser / Anti-Cheating
export const LockIcon = ({ width = 44, height = 44 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <rect x="5" y="11" width="14" height="10" stroke="#00437E" strokeWidth="2"/>
    <path d="M12 7V11" stroke="#0092E3" strokeWidth="2"/>
    <path d="M8 11V7C8 5.34315 9.34315 4 11 4H13C14.6569 4 16 5.34315 16 7V11" stroke="#00437E" strokeWidth="2"/>
  </svg>
);

// 4️⃣ Collect Exams / LMS Integration
export const CloudIcon = ({ width = 44, height = 44 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M20 17.58C21.1667 16.8333 22 15.4167 22 14C22 11.7909 20.2091 10 18 10C17.5 10 16.9167 10.0833 16.3333 10.25C15.5 8.83333 13.8333 8 12 8C9.79086 8 8 9.79086 8 12H6C3.79086 12 2 13.7909 2 16C2 18.2091 3.79086 20 6 20H19C19.3333 20 19.6667 19.9583 20 19.875V17.58Z" stroke="#00437E" strokeWidth="2"/>
  </svg>
);

// 5️⃣ Auto-Mark / Manual Marking
export const CheckIcon = ({ width = 44, height = 44 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M5 13L10 18L20 6" stroke="#0092E3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default {
  UploadIcon,
  UserCustomizationIcon,
  LockIcon,
  CloudIcon,
  CheckIcon
};
