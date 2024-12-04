import React from "react";

import { DynamicIcon } from "@/app/components/DynamicIcon";
import { AlertCircle } from "lucide-react";
import { POLICY_DEFAULT_ICON } from "@/config/icons-map";

// Default policies data
const defaultPolicies = [
  {
    policyId: "1",
    type: "cancellation",
    description: "Free cancellation before 24 hours",
  },
  {
    policyId: "2",
    type: "payment",
    description: "Pay at check-in",
  },
  {
    policyId: "3",
    type: "checkIn",
    description: "Check-in from 2:00 PM",
  },
  {
    policyId: "4",
    type: "restrictions",
    description: "No pets allowed",
  },
];

const FeaturedPolicies = ({ policies = defaultPolicies, className = "" }) => {
  return (
    <div
      className={`flex flex-wrap gap-2 text-sm text-muted-foreground ${className}`}
    >
      {policies.map((policy) => {
        return (
          <div key={policy.policyId} className="flex items-center gap-1">
            <DynamicIcon
              name={policy.type}
              FallbackIcon={POLICY_DEFAULT_ICON}
              className="h-4 w-4"
            />
            <span>{policy.description}</span>
          </div>
        );
      })}
    </div>
  );
};

export default FeaturedPolicies;
