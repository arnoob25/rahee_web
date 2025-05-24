import { FILTER_FIELDS } from "../../config";

export const POLICY_TYPES = {
  checkInOut: {
    id: "checkInOut",
    label: "Check-In & Check-Out",
    description: "Timings and processes for guest arrival and departure.",
    field: FILTER_FIELDS.policies,
    icon: "log-in",
  },
  paymentAndDeposits: {
    id: "paymentAndDeposits",
    label: "Payment & Deposits",
    description:
      "Policies related to payment methods, deposits, and cancellations.",
    field: FILTER_FIELDS.policies,
    icon: "credit-card",
  },
  propertyRules: {
    id: "propertyRules",
    label: "Property Rules",
    description: "General rules and expected conduct within the property.",
    field: FILTER_FIELDS.policies,
    icon: "clock",
  },
  additionalPolicies: {
    id: "additionalPolicies",
    label: "Additional Policies",
    description: "Other relevant policies not covered in the main categories.",
    field: FILTER_FIELDS.policies,
    icon: "clock",
  },
};

export const POLICIES = {
  basicPolicies: {
    id: "basic_policies",
    label: "Basic Policies",
    description: "Generic Policies",
    field: FILTER_FIELDS.policies,
    icon: "",
    type: POLICY_TYPES.additionalPolicies,
  },
  checkInProcess: {
    id: "check_in_process",
    label: "Check-In Process",
    description: "A brief description of the check-in process.",
    field: FILTER_FIELDS.policies,
    icon: "check-in",
    type: POLICY_TYPES.checkInOut.id,
  },
  checkOutProcess: {
    id: "check_out_process",
    label: "Check-Out Process",
    description: "A brief description of the check-out process.",
    field: FILTER_FIELDS.policies,
    icon: "check-out",
    type: POLICY_TYPES.checkInOut.id,
  },
  luggageServices: {
    id: "luggage_services",
    label: "Luggage Services",
    description: "A brief description of the luggage services.",
    field: FILTER_FIELDS.policies,
    icon: "luggage",
    type: POLICY_TYPES.checkInOut.id,
  },
  acceptedPaymentMethods: {
    id: "accepted_payment_methods",
    label: "Accepted Payment Methods",
    description: "A brief description of the accepted payment methods.",
    field: FILTER_FIELDS.policies,
    icon: "payment-method",
    type: POLICY_TYPES.paymentAndDeposits.id,
  },
  depositPolicy: {
    id: "deposit_policy",
    label: "Deposit Policy",
    description: "A brief description of the deposit policy.",
    field: FILTER_FIELDS.policies,
    icon: "deposit",
    type: POLICY_TYPES.paymentAndDeposits.id,
  },
  cancellationPolicy: {
    id: "cancellation_policy",
    label: "Cancellation Policy",
    description: "A brief description of the cancellation policy.",
    field: FILTER_FIELDS.policies,
    icon: "cancellation",
    type: POLICY_TYPES.paymentAndDeposits.id,
  },
  additionalCharges: {
    id: "additional_charges",
    label: "Additional Charges",
    description: "A brief description of the additional charges.",
    field: FILTER_FIELDS.policies,
    icon: "charges",
    type: POLICY_TYPES.paymentAndDeposits.id,
  },
  noisePolicy: {
    id: "noise_policy",
    label: "Noise Policy",
    description: "A brief description of the noise policy.",
    field: FILTER_FIELDS.policies,
    icon: "noise",
    type: POLICY_TYPES.propertyRules.id,
  },
  smokingPolicy: {
    id: "smoking_policy",
    label: "Smoking Policy",
    description: "A brief description of the smoking policy.",
    field: FILTER_FIELDS.policies,
    icon: "smoking",
    type: POLICY_TYPES.propertyRules.id,
  },
  petPolicy: {
    id: "pet_policy",
    label: "Pet Policy",
    description: "A brief description of the pet policy.",
    field: FILTER_FIELDS.policies,
    icon: "pet",
    type: POLICY_TYPES.propertyRules.id,
  },
  poolAndFitnessCenterRules: {
    id: "pool_and_fitness_center_rules",
    label: "Pool and Fitness Center Rules",
    description: "A brief description of the pool and fitness center rules.",
    field: FILTER_FIELDS.policies,
    icon: "pool",
    type: POLICY_TYPES.propertyRules.id,
  },
  internetAccess: {
    id: "internet_access",
    label: "Internet Access",
    description: "A brief description of the internet access.",
    field: FILTER_FIELDS.policies,
    icon: "wifi",
    type: POLICY_TYPES.additionalPolicies.id,
  },
  parkingServices: {
    id: "parking_services",
    label: "Parking Services",
    description: "A brief description of the parking services.",
    field: FILTER_FIELDS.policies,
    icon: "parking",
    type: POLICY_TYPES.additionalPolicies.id,
  },
  ageRestrictions: {
    id: "age_restrictions",
    label: "Age Restrictions",
    description: "A brief description of the age restrictions.",
    field: FILTER_FIELDS.policies,
    icon: "age",
    type: POLICY_TYPES.additionalPolicies.id,
  },
  accessibility: {
    id: "accessibility",
    label: "Accessibility",
    description: "A brief description of the accessibility.",
    field: FILTER_FIELDS.policies,
    icon: "accessibility",
    type: POLICY_TYPES.additionalPolicies.id,
  },
};

export const RULE_DESCRIPTIONS = {
  // Check-in Process Rules
  two_pm_check_in: {
    id: "two_pm_check_in",
    policy: POLICIES.checkInProcess.id,
    label: "2 PM",
    description: "Check-in",
    field: FILTER_FIELDS.policies,
    icon: "check-in",
    featured: true,
  },
  standard_check_in: {
    id: "standard_check_in",
    policy: POLICIES.checkInProcess.id,
    label: "Standard Check-in",
    description: "From 3:00 PM",
    field: FILTER_FIELDS.policies,
    icon: "clock",
    featured: false,
  },
  early_check_in: {
    id: "early_check_in",
    policy: POLICIES.checkInProcess.id,
    label: "Early Check-in",
    description: "Subject to availability. Additional fee of $50 may apply.",
    field: FILTER_FIELDS.policies,
    icon: "clock",
    featured: false,
  },
  late_check_in: {
    id: "late_check_in",
    policy: POLICIES.checkInProcess.id,
    label: "Late Check-in",
    description:
      "Available 24/7. Please notify the hotel for arrivals after 10:00 PM.",
    field: FILTER_FIELDS.policies,
    icon: "clock",
    featured: false,
  },
  required_documents: {
    id: "required_documents",
    policy: POLICIES.checkInProcess.id,
    label: "Required Documents",
    description:
      "Government-issued photo ID and credit card required at check-in.",
    field: FILTER_FIELDS.policies,
    icon: "badge-check",
    featured: false,
  },
  // Check-out Process Rules
  eleven_am_check_out: {
    id: "eleven_am_check_out",
    policy: POLICIES.checkInProcess.id,
    label: "11 AM",
    description: "Check-out",
    field: FILTER_FIELDS.policies,
    icon: "check-out",
    featured: true,
  },
  standard_check_out: {
    id: "standard_check_out",
    policy: POLICIES.checkOutProcess.id,
    label: "Standard Check-out",
    description: "Until 12:00 PM (noon)",
    field: FILTER_FIELDS.policies,
    icon: "clock",
    featured: false,
  },
  late_check_out: {
    id: "late_check_out",
    policy: POLICIES.checkOutProcess.id,
    label: "Late Check-out",
    description:
      "Subject to availability. Additional fee of $20 per hour may apply.",
    field: FILTER_FIELDS.policies,
    icon: "clock",
    featured: false,
  },
  express_check_out: {
    id: "express_check_out",
    policy: POLICIES.checkOutProcess.id,
    label: "Express Check-out",
    description: "Available for all guests. Leave your key in the drop box.",
    field: FILTER_FIELDS.policies,
    icon: "package",
    featured: false,
  },
  pay_at_check_out: {
    id: "pay_at_check_out",
    policy: POLICIES.checkOutProcess.id,
    label: "Pay at Check-out",
    description: "Full payment not required at booking",
    field: FILTER_FIELDS.policies,
    icon: "payment",
    featured: true,
  },
  // Luggage Services Rules
  luggage_storage: {
    id: "luggage_storage",
    policy: POLICIES.luggageServices.id,
    label: "Luggage Storage",
    description:
      "Complimentary luggage storage available for early arrivals and late departures.",
    field: FILTER_FIELDS.policies,
    icon: "briefcase",
    featured: false,
  },
  porter_service: {
    id: "porter_service",
    policy: POLICIES.luggageServices.id,
    label: "Porter Service",
    description: "Available upon request. $5 per bag.",
    field: FILTER_FIELDS.policies,
    icon: "package",
    featured: false,
  },
  // Accepted Payment Methods Rules
  credit_cards: {
    id: "credit_cards",
    policy: POLICIES.acceptedPaymentMethods.id,
    label: "Credit Cards",
    description: "Visa, Mastercard, American Express, Discover",
    field: FILTER_FIELDS.policies,
    icon: "credit-card",
    featured: true,
  },
  cash: {
    id: "cash",
    policy: POLICIES.acceptedPaymentMethods.id,
    label: "Cash",
    description: "Accepted for all services",
    field: FILTER_FIELDS.policies,
    icon: "dollar-sign",
    featured: false,
  },
  digital_wallets: {
    id: "digital_wallets",
    policy: POLICIES.acceptedPaymentMethods.id,
    label: "Digital Wallets",
    description: "Apple Pay and Google Pay accepted at select points of sale",
    field: FILTER_FIELDS.policies,
    icon: "wallet",
    featured: false,
  },
  // Deposit Policy Rules
  booking_deposit: {
    id: "booking_deposit",
    policy: POLICIES.depositPolicy.id,
    label: "Booking Deposit",
    description:
      "A deposit equal to the first night's stay is required at booking.",
    field: FILTER_FIELDS.policies,
    icon: "piggy-bank",
    featured: false,
  },
  incidental_hold: {
    id: "incidental_hold",
    policy: POLICIES.depositPolicy.id,
    label: "Incidental Hold",
    description:
      "$100 per night hold for incidentals, released upon check-out.",
    field: FILTER_FIELDS.policies,
    icon: "dollar-sign",
    featured: false,
  },
  // Cancellation Policy Rules
  free_cancellation: {
    id: "free_cancellation",
    policy: POLICIES.cancellationPolicy.id,
    label: "Free Cancellation",
    description: "Cancel within 24 hours for full refund",
    field: FILTER_FIELDS.policies,
    icon: "cancellation",
    featured: false,
  },
  late_cancellation: {
    id: "late_cancellation",
    policy: POLICIES.cancellationPolicy.id,
    label: "Late Cancellation",
    description:
      "Cancellations within 48 hours of check-in are subject to a charge equal to one night's stay",
    field: FILTER_FIELDS.policies,
    icon: "calendar-x",
    featured: false,
  },
  no_show_policy: {
    id: "no_show_policy",
    policy: POLICIES.cancellationPolicy.id,
    label: "No-show Policy",
    description: "No-shows will be charged the full amount of the stay",
    field: FILTER_FIELDS.policies,
    icon: "calendar-x",
    featured: false,
  },
  // Additional Charges Rules
  resort_fee: {
    id: "resort_fee",
    policy: POLICIES.additionalCharges.id,
    label: "Resort Fee",
    description: "$25 per accommodation, per night",
    field: FILTER_FIELDS.policies,
    icon: "receipt",
    featured: false,
  },
  parking_self: {
    id: "parking_self",
    policy: POLICIES.parkingServices.id,
    label: "Self-Parking",
    description: "Available 24/7, $15 per day with in/out privileges",
    field: FILTER_FIELDS.policies,
    icon: "car",
    featured: false,
  },
  parking_valet: {
    id: "parking_valet",
    policy: POLICIES.parkingServices.id,
    label: "Valet Parking",
    description: "Available from 6:00 AM to 11:00 PM, $25 per day",
    field: FILTER_FIELDS.policies,
    icon: "car",
    featured: false,
  },
  electric_vehicle_charging: {
    id: "electric_vehicle_charging",
    policy: POLICIES.parkingServices.id,
    label: "Electric Vehicle Charging",
    description:
      "Two charging stations available, first-come-first-served basis",
    field: FILTER_FIELDS.policies,
    icon: "charger",
    featured: false,
  },
  pet_fee: {
    id: "pet_fee",
    policy: POLICIES.additionalCharges.id,
    label: "Pet Fee",
    description: "$50 per pet, per stay (max 2 pets per room)",
    field: FILTER_FIELDS.policies,
    icon: "dog",
    featured: false,
  },
  // Property Rules: Noise
  quiet_hours: {
    id: "quiet_hours",
    policy: POLICIES.noisePolicy.id,
    label: "Quiet Hours",
    description: "From 10:00 PM to 7:00 AM",
    field: FILTER_FIELDS.policies,
    icon: "moon",
    featured: false,
  },
  excessive_noise: {
    id: "excessive_noise",
    policy: POLICIES.noisePolicy.id,
    label: "Excessive Noise",
    description: "May result in a warning or eviction without refund",
    field: FILTER_FIELDS.policies,
    icon: "volume-x",
    featured: false,
  },
  party_policy: {
    id: "party_policy",
    policy: POLICIES.noisePolicy.id,
    label: "Party Policy",
    description:
      "Parties and large gatherings are not permitted in guest rooms.",
    field: FILTER_FIELDS.policies,
    icon: "users",
    featured: false,
  },
  // Smoking Policy Rules
  non_smoking_rooms: {
    id: "non_smoking_rooms",
    policy: POLICIES.smokingPolicy.id,
    label: "Non-smoking Rooms",
    description: "All rooms are non-smoking",
    field: FILTER_FIELDS.policies,
    icon: "ban",
    featured: false,
  },
  designated_smoking_areas: {
    id: "designated_smoking_areas",
    policy: POLICIES.smokingPolicy.id,
    label: "Designated Smoking Areas",
    description: "Available in outdoor spaces only",
    field: FILTER_FIELDS.policies,
    icon: "smoke",
    featured: false,
  },
  violation_fee: {
    id: "violation_fee",
    policy: POLICIES.smokingPolicy.id,
    label: "Violation Fee",
    description: "$250 cleaning fee for smoking in non-designated areas",
    field: FILTER_FIELDS.policies,
    icon: "alert-circle",
    featured: false,
  },
  // Pet Policy Rules
  allowed_pets: {
    id: "allowed_pets",
    policy: POLICIES.petPolicy.id,
    label: "Allowed Pets",
    description: "Dogs and cats only, maximum 2 pets per room",
    field: FILTER_FIELDS.policies,
    icon: "dog",
    featured: false,
  },
  pet_amenities: {
    id: "pet_amenities",
    policy: POLICIES.petPolicy.id,
    label: "Pet Amenities",
    description: "Pet beds and bowls available upon request",
    field: FILTER_FIELDS.policies,
    icon: "dog",
    featured: false,
  },
  service_animals: {
    id: "service_animals",
    policy: POLICIES.petPolicy.id,
    label: "Service Animals",
    description: "Welcome at no additional charge",
    field: FILTER_FIELDS.policies,
    icon: "dog",
    featured: false,
  },
  // Pool & Fitness Center Rules
  hours_of_operation: {
    id: "hours_of_operation",
    policy: POLICIES.poolAndFitnessCenterRules.id,
    label: "Hours of Operation",
    description: "6:00 AM to 10:00 PM daily",
    field: FILTER_FIELDS.policies,
    icon: "clock",
    featured: false,
  },
  pool_age_restrictions: {
    id: "pool_age_restrictions",
    policy: POLICIES.poolAndFitnessCenterRules.id,
    label: "Age Restrictions",
    description: "Children under 16 must be accompanied by an adult",
    field: FILTER_FIELDS.policies,
    icon: "user",
    featured: false,
  },
  proper_attire: {
    id: "proper_attire",
    policy: POLICIES.poolAndFitnessCenterRules.id,
    label: "Proper Attire",
    description: "Required in fitness center and when moving through the hotel",
    field: FILTER_FIELDS.policies,
    icon: "tshirt",
    featured: false,
  },
  // Additional Policies: Internet
  wifi_availability: {
    id: "wifi_availability",
    policy: POLICIES.internetAccess.id,
    label: "WiFi Availability",
    description: "Complimentary WiFi available in all rooms and public areas",
    field: FILTER_FIELDS.policies,
    icon: "wifi",
    featured: false,
  },
  premium_wifi: {
    id: "premium_wifi",
    policy: POLICIES.internetAccess.id,
    label: "Premium WiFi",
    description: "High-speed option available for $10 per day",
    field: FILTER_FIELDS.policies,
    icon: "wifi",
    featured: false,
  },
  device_limit: {
    id: "device_limit",
    policy: POLICIES.internetAccess.id,
    label: "Device Limit",
    description: "Standard WiFi access supports up to 3 devices per room.",
    field: FILTER_FIELDS.policies,
    icon: "devices",
    featured: false,
  },
  // Age Restrictions (Additional Policies)
  minimum_check_in_age: {
    id: "minimum_check_in_age",
    policy: POLICIES.ageRestrictions.id,
    label: "Minimum Check-in Age",
    description: "Guests must be 18 years or older to check-in",
    field: FILTER_FIELDS.policies,
    icon: "user-check",
    featured: false,
  },
  minors: {
    id: "minors",
    policy: POLICIES.ageRestrictions.id,
    label: "Minors",
    description: "Must be accompanied by an adult 21 years or older",
    field: FILTER_FIELDS.policies,
    icon: "user-friends",
    featured: false,
  },
  // Accessibility Rules
  ada_compliant_rooms: {
    id: "ada_compliant_rooms",
    policy: POLICIES.accessibility.id,
    label: "ADA Compliant Rooms",
    description: "Available upon request",
    field: FILTER_FIELDS.policies,
    icon: "accessible",
    featured: false,
  },
  mobility_equipment: {
    id: "mobility_equipment",
    policy: POLICIES.accessibility.id,
    label: "Mobility Equipment",
    description: "Wheelchairs and mobility scooters available for rent",
    field: FILTER_FIELDS.policies,
    icon: "wheelchair",
    featured: false,
  },
  service_animals_accessibility: {
    id: "service_animals_accessibility",
    policy: POLICIES.accessibility.id,
    label: "Service Animals",
    description: "Welcomed in all areas of the hotel",
    field: FILTER_FIELDS.policies,
    icon: "dog",
    featured: false,
  },
};

function getRuleData(id) {
  return RULE_DESCRIPTIONS[id] ?? null;
}

function getRules(ids) {
  const rules = ids.map((id) => getRuleData(id));
  return (
    rules.filter((rule) => rule !== null).sort((a, b) => a.label - b.label) ??
    []
  );
}

function getPolicy(id) {
  return Object.values(POLICIES).find((policy) => policy.id === id) ?? null;
}

export function getPolicyTypes() {
  return Object.values(POLICY_TYPES);
}

function groupRulesByPolicy(ruleIds) {
  const rules = getRules(ruleIds).filter((rule) => !rule.featured); // non featured rules only
  const rulesByPolicy = {};

  if (rules.length === 0) return {};

  rules.forEach((rule) => {
    if (!rulesByPolicy[rule.policy]) {
      rulesByPolicy[rule.policy] = [];
    }
    rulesByPolicy[rule.policy].push(rule);
  });

  return rulesByPolicy;
}

export function useFormatPolicyData(ruleIds) {
  const policiesWithRules = [];

  const rulesByPolicy = groupRulesByPolicy(ruleIds);
  const policyIds = Object.keys(rulesByPolicy);

  if (policyIds.length > 0) {
    policyIds.forEach((policyId) => {
      const policy = getPolicy(policyId);
      if (!policy) return;

      // group rules under common policy
      policiesWithRules.push({
        ...policy,
        rules: rulesByPolicy[policyId],
      });
    });
  }

  return policiesWithRules;
}

export function getFeaturedRules(ruleIds) {
  const rules = getRules(ruleIds);
  return rules.filter((rule) => rule.featured);
}

export function filterPoliciesByType(policies, type) {
  return policies
    .filter((policy) => policy.type === type)
    .sort((a, b) => a.label - b.label);
}
