import {
  Wifi,
  Dumbbell,
  ShowerHeadIcon,
  Utensils,
  Car,
  Waves,
  Users,
  CoffeeIcon,
  Bed,
  Clock,
  Ban,
  CreditCard,
  MapPin,
  SofaIcon,
  AlertCircleIcon,
  Sparkle,
  Coffee,
  Tv,
  AirVent,
  ParkingMeterIcon as Parking,
  MenuIcon as Restaurant,
  SpadeIcon as Spa,
  BusIcon as Business,
  Wine,
  Fan,
  Cctv,
  LogIn,
  LogOut,
  Wallet,
  TicketX,
} from "lucide-react";

export const TAG_DEFAULT_ICON = MapPin;
export const FACILITY_CATEGORY_DEFAULT_ICON = Sparkle;
export const FACILITY_DEFAULT_ICON = Sparkle;
export const AMENITY_DEFAULT_ICON = Sparkle;
export const POLICY_DEFAULT_ICON = AlertCircleIcon;

const TAG_ICONS = {
  Beachfront: Waves,
  "Free WiFi": Wifi,
  "Breakfast Included": Coffee,
  Restaurant: Utensils,
  "City Center": MapPin,
};

const FACILITY_CATEGORY_ICONS = {
  Recreation: Dumbbell,
  Dining: Utensils,
  Connectivity: Wifi,
  Transportation: Car,
  Wellness: Waves,
  Business: Users,
  "Food & Drink": CoffeeIcon,
  "Room Features": Bed,
  Location: MapPin,
  kid: Fan,
  "living Room": SofaIcon,
};

const FACILITY_ICONS = {
  "Swimming Pool": ShowerHeadIcon,
  Restaurant: Utensils,
  WiFi: Wifi,
};

const AMENITY_ICONS = {
  wifi: Wifi,
  breakfast: Coffee,
  parking: Parking,
  tv: Tv,
  "air conditioning": AirVent,
  restaurant: Restaurant,
  gym: Dumbbell,
  spa: Spa,
  "business center": Business,
  bed: Bed,
  bar: Wine,
};

const POLICY_ICONS = {
  payment: Wallet,
  checkIn: Clock,
  restrictions: Ban,
  surveillance: Cctv,
  "check-in": LogIn,
  "check-out": LogOut,
  card: CreditCard,
  cancellation: TicketX,
};

export const ADDITIONAL_ICONS = {
  ...TAG_ICONS,
  ...FACILITY_CATEGORY_ICONS,
  ...FACILITY_ICONS,
  ...AMENITY_ICONS,
  ...POLICY_ICONS,
};
