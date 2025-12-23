// src/data/signinSteps.ts
import type { Step } from "../components/MultiStepForm";

const signinSteps: Step[] = [
  {
    subtitle: "Please enter your personal details",
    fields: [
      { label: "Full Name", type: "text", name: "name" },
      { label: "Email", type: "text", name: "email" },
    ],
  },

  {
    subtitle: "Let’s confirm your personal info",
    fields: [
      { label: "Nationality", type: "country", name: "nationality" },
      { label: "Mobile Number", type: "phone", name: "phone" },
    ],
  },

  {
    subtitle: "Almost there! Just a few more details",
    fields: [
      { label: "Date of Birth", type: "date", name: "dob" },
      { label: "Country of Residence", type: "country", name: "country" },
    ],
  },

  {
    subtitle: "Tell us your preferences",
    fields: [
      {
        label: "City",
        type: "city",
        name: "city",
        options: ["Mumbai", "Delhi", "Bangalore"],
      },
      {
        label: "Preferred Category",
        type: "category",
        name: "category",
        options: ["SUV", "Sedan", "Hatchback"],
      },
    ],
  },
];

export default signinSteps;
