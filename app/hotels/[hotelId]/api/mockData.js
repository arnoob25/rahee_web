import { Clock, CreditCard, Scroll, Info } from "lucide-react";

const facilities = [
  // Recreation Facilities
  {
    facility: {
      facilityCategory: {
        categoryId: "1",
        name: "Recreation",
        description: "Recreational facilities",
      },
      facilityId: "1",
      name: "Swimming Pool",
      description: "Outdoor swimming pool with ocean view",
    },
  },
  {
    facility: {
      facilityCategory: {
        categoryId: "1",
        name: "Recreation",
        description: "Recreational facilities",
      },
      facilityId: "2",
      name: "Tennis Court",
      description: "Outdoor tennis court with floodlights",
    },
  },
  {
    facility: {
      facilityCategory: {
        categoryId: "1",
        name: "Recreation",
        description: "Recreational facilities",
      },
      facilityId: "3",
      name: "Yoga Studio",
      description: "Fully equipped yoga and wellness studio",
    },
  },
  {
    facility: {
      facilityCategory: {
        categoryId: "2",
        name: "Childcare",
        description: "Childcare and kids' facilities",
      },
      facilityId: "4",
      name: "Kids Club",
      description: "Fun activities for children aged 3-12",
    },
  },
  {
    facility: {
      facilityCategory: {
        categoryId: "2",
        name: "Childcare",
        description: "Childcare and kids' facilities",
      },
      facilityId: "5",
      name: "Babysitting Service",
      description: "Qualified babysitters available on request",
    },
  },
  {
    facility: {
      facilityCategory: {
        categoryId: "2",
        name: "Childcare",
        description: "Childcare and kids' facilities",
      },
      facilityId: "6",
      name: "Art and Craft Studio",
      description: "Creative space for kids' art projects",
    },
  },
  {
    facility: {
      facilityCategory: {
        categoryId: "3",
        name: "Business",
        description: "Facilities for business travelers",
      },
      facilityId: "7",
      name: "Networking Lounge",
      description: "Exclusive lounge for business networking",
    },
  },
  {
    facility: {
      facilityCategory: {
        categoryId: "3",
        name: "Business",
        description: "Facilities for business travelers",
      },
      facilityId: "8",
      name: "Virtual Office Suite",
      description: "Private office spaces with high-speed internet",
    },
  },
  {
    facility: {
      facilityCategory: {
        categoryId: "3",
        name: "Business",
        description: "Facilities for business travelers",
      },
      facilityId: "9",
      name: "Digital Collaboration Wall",
      description: "Interactive digital wall for team collaboration",
    },
  },
  {
    facility: {
      facilityCategory: {
        categoryId: "4",
        name: "Accessibility",
        description: "Accessibility features for guests",
      },
      facilityId: "10",
      name: "Wheelchair Accessible",
      description: "Accessible rooms and pathways",
    },
  },
  {
    facility: {
      facilityCategory: {
        categoryId: "4",
        name: "Accessibility",
        description: "Accessibility features for guests",
      },
      facilityId: "11",
      name: "Visual Alert System",
      description: "Safety features for hearing-impaired guests",
    },
  },
  {
    facility: {
      facilityCategory: {
        categoryId: "4",
        name: "Accessibility",
        description: "Accessibility features for guests",
      },
      facilityId: "12",
      name: "Elevator",
      description: "Modern elevators for easy mobility",
    },
  },
  {
    facility: {
      facilityCategory: {
        categoryId: "5",
        name: "Entertainment",
        description: "Entertainment options for guests",
      },
      facilityId: "13",
      name: "Gaming Lounge",
      description: "Video games and recreational gaming setup",
    },
  },
  {
    facility: {
      facilityCategory: {
        categoryId: "5",
        name: "Entertainment",
        description: "Entertainment options for guests",
      },
      facilityId: "14",
      name: "Live Music",
      description: "Evening live music performances",
    },
  },
  {
    facility: {
      facilityCategory: {
        categoryId: "5",
        name: "Entertainment",
        description: "Entertainment options for guests",
      },
      facilityId: "15",
      name: "Movie Screening Room",
      description: "Private cinema with curated movie options",
    },
  },
];

export const mockHotelData = {
  hotel_listing_hotels: [
    {
      hotelId: "123",
      name: "Long Beach Hotel Cox's Bazar",
      description:
        "Experience luxury by the beach at Long Beach Hotel. Our property offers stunning ocean views, modern amenities, and exceptional service.",
      address: "14 Kalatoli, Hotel-Motel Zone, Cox's Bazar, Bangladesh",
      contactInfo: "+880 1234567890",
      starRating: 4,
      reviewScore: 8.5,
      media: [
        {
          mediaId: "1",
          url: "https://plus.unsplash.com/premium_photo-1732025157823-2fe37a94fcd2?q=80&w=2059&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          isCover: true,
          isFeatured: true,
        },
        {
          mediaId: "2",
          url: "https://images.unsplash.com/photo-1551043047-1d2adf00f3fa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          isCover: false,
          isFeatured: true,
        },
        {
          mediaId: "3",
          url: "https://images.unsplash.com/photo-1549778399-f94fd24d4697?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          isCover: false,
          isFeatured: true,
        },
        {
          mediaId: "4",
          url: "https://images.unsplash.com/photo-1542708993627-b6e5bbae43c4?q=80&w=2044&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          isCover: false,
          isFeatured: true,
        },
        {
          mediaId: "5",
          url: "https://plus.unsplash.com/premium_photo-1731329622391-fcb5682fa47c?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          isCover: false,
          isFeatured: true,
        },
      ],
      roomTypes: [
        {
          roomCategoryId: "a6537fdd-0035-43a8-8cdf-c73fd4f9632d",
          roomTypeId: "1",
          name: "Deluxe Double Room",
          pricePerNight: 5121,
          maxAdults: 2,
          maxGuests: 3,
          complementaryChild: 1,
          media: [
            {
              mediaId: "6",
              url: "https://plus.unsplash.com/premium_photo-1731329622391-fcb5682fa47c?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              isCover: true,
            },
            {
              mediaId: "7",
              url: "https://images.unsplash.com/photo-1551043047-1d2adf00f3fa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              isCover: true,
            },
            {
              mediaId: "8",
              url: "https://images.unsplash.com/photo-1549778399-f94fd24d4697?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              isCover: true,
            },
            {
              mediaId: "9",
              url: "https://images.unsplash.com/photo-1542708993627-b6e5bbae43c4?q=80&w=2044&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              isCover: true,
            },
          ],
          roomAmenitiesLinks: [
            {
              amenity: {
                amenityId: "1",
                name: "Free WiFi",
                description: "High-speed internet access",
              },
            },
            {
              amenity: {
                amenityId: "2",
                name: "Breakfast Included",
                description: "Complimentary breakfast buffet",
              },
            },
          ],
          roomsAggregate: {
            _count: 5,
          },
        },
        {
          roomCategoryId: "a6537fdd-0035-43a8-8cdf-c73fd4f9632d",
          roomTypeId: "2",
          name: "Superior King Room",
          pricePerNight: 7200,
          maxAdults: 2,
          maxGuests: 3,
          complementaryChild: 1,
          media: [
            {
              mediaId: "6",
              url: "https://plus.unsplash.com/premium_photo-1731329622391-fcb5682fa47c?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              isCover: true,
            },
            {
              mediaId: "7",
              url: "https://images.unsplash.com/photo-1551043047-1d2adf00f3fa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              isCover: true,
            },
            {
              mediaId: "8",
              url: "https://images.unsplash.com/photo-1549778399-f94fd24d4697?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              isCover: true,
            },
            {
              mediaId: "9",
              url: "https://images.unsplash.com/photo-1542708993627-b6e5bbae43c4?q=80&w=2044&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              isCover: true,
            },
          ],
          roomAmenitiesLinks: [
            {
              amenity: {
                amenityId: "1",
                name: "Free WiFi",
                description: "High-speed internet access",
              },
            },
            {
              amenity: {
                amenityId: "2",
                name: "Breakfast Included",
                description: "Complimentary breakfast buffet",
              },
            },
            {
              amenity: {
                amenityId: "3",
                name: "Mini Bar",
                description: "Stocked minibar with drinks and snacks",
              },
            },
          ],
          roomsAggregate: {
            _count: 10,
          },
        },
        {
          roomCategoryId: "ba9fde34-c61e-4dee-b58e-d4277ed304c0",
          roomTypeId: "3",
          name: "Family Suite",
          pricePerNight: 9800,
          maxAdults: 4,
          maxGuests: 5,
          complementaryChild: 2,
          media: [
            {
              mediaId: "6",
              url: "https://plus.unsplash.com/premium_photo-1731329622391-fcb5682fa47c?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              isCover: true,
            },
            {
              mediaId: "7",
              url: "https://images.unsplash.com/photo-1551043047-1d2adf00f3fa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              isCover: true,
            },
            {
              mediaId: "8",
              url: "https://images.unsplash.com/photo-1549778399-f94fd24d4697?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              isCover: true,
            },
            {
              mediaId: "9",
              url: "https://images.unsplash.com/photo-1542708993627-b6e5bbae43c4?q=80&w=2044&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              isCover: true,
            },
          ],
          roomAmenitiesLinks: [
            {
              amenity: {
                amenityId: "1",
                name: "Free WiFi",
                description: "High-speed internet access",
              },
            },
            {
              amenity: {
                amenityId: "2",
                name: "Breakfast Included",
                description: "Complimentary breakfast buffet",
              },
            },
            {
              amenity: {
                amenityId: "4",
                name: "Living Room",
                description: "Spacious seating area with sofa",
              },
            },
          ],
          roomsAggregate: {
            _count: 3,
          },
        },
        {
          roomCategoryId: "ba9fde34-c61e-4dee-b58e-d4277ed304c0",
          roomTypeId: "4",
          name: "Penthouse Suite",
          pricePerNight: 15500,
          maxAdults: 2,
          maxGuests: 3,
          complementaryChild: 1,
          media: [
            {
              mediaId: "6",
              url: "https://plus.unsplash.com/premium_photo-1731329622391-fcb5682fa47c?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              isCover: true,
            },
            {
              mediaId: "7",
              url: "https://images.unsplash.com/photo-1551043047-1d2adf00f3fa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              isCover: true,
            },
            {
              mediaId: "8",
              url: "https://images.unsplash.com/photo-1549778399-f94fd24d4697?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              isCover: true,
            },
            {
              mediaId: "9",
              url: "https://images.unsplash.com/photo-1542708993627-b6e5bbae43c4?q=80&w=2044&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              isCover: true,
            },
          ],
          roomAmenitiesLinks: [
            {
              amenity: {
                amenityId: "1",
                name: "Free WiFi",
                description: "High-speed internet access",
              },
            },
            {
              amenity: {
                amenityId: "5",
                name: "Private Pool",
                description: "Exclusive access to a private pool",
              },
            },
            {
              amenity: {
                amenityId: "6",
                name: "Rooftop Lounge",
                description: "Private lounge with panoramic views",
              },
            },
          ],
          roomsAggregate: {
            _count: 2,
          },
        },
      ],
      hotelTagAttributesLinks: [
        {
          tag: {
            tagId: "1",
            name: "Beachfront",
            description: "Located directly on the beach",
          },
        },
        {
          tag: {
            tagId: "2",
            name: "Luxury",
            description: "Offers premium services and amenities",
          },
        },
        {
          tag: {
            tagId: "3",
            name: "Family-Friendly",
            description: "Great for families with children",
          },
        },
      ],
      hotelFacilitiesLinks: facilities,
    },
  ],
};

export const policies = {
  "Check-in/Check-out": {
    icon: Clock,
    subcategories: {
      "Check-in Process": {
        "Standard Check-in": "From 3:00 PM",
        "Early Check-in":
          "Subject to availability. Additional fee of $50 may apply.",
        "Late Check-in":
          "Available 24/7. Please notify the hotel for arrivals after 10:00 PM.",
        "Required Documents":
          "Government-issued photo ID and credit card required at check-in.",
      },
      "Check-out Process": {
        "Standard Check-out": "Until 12:00 PM (noon)",
        "Late Check-out":
          "Subject to availability. Additional fee of $20 per hour may apply.",
        "Express Check-out":
          "Available for all guests. Leave your key in the drop box.",
      },
      "Luggage Services": {
        "Luggage Storage":
          "Complimentary luggage storage available for early arrivals and late departures.",
        "Porter Service": "Available upon request. $5 per bag.",
      },
    },
  },
  "Payment & Deposits": {
    icon: CreditCard,
    subcategories: {
      "Accepted Payment Methods": {
        "Credit Cards": "Visa, Mastercard, American Express, Discover",
        Cash: "Accepted for all services",
        "Digital Wallets":
          "Apple Pay and Google Pay accepted at select points of sale",
      },
      "Deposit Policy": {
        "Booking Deposit":
          "A deposit equal to the first night's stay is required at booking",
        "Incidental Hold":
          "$100 per night hold for incidentals, released upon check-out",
      },
      "Cancellation Policy": {
        "Free Cancellation": "Up to 48 hours before check-in",
        "Late Cancellation":
          "Cancellations within 48 hours of check-in are subject to a charge equal to one night's stay",
        "No-show Policy":
          "No-shows will be charged the full amount of the stay",
      },
      "Additional Charges": {
        "Resort Fee": "$25 per accommodation, per night",
        Parking: "Self parking: $15 per day, Valet parking: $25 per day",
        "Pet Fee": "$50 per pet, per stay (max 2 pets per room)",
      },
    },
  },
  "Property Rules": {
    icon: Scroll,
    subcategories: {
      "Noise Policy": {
        "Quiet Hours": "From 10:00 PM to 7:00 AM",
        "Excessive Noise": "May result in a warning or eviction without refund",
      },
      "Smoking Policy": {
        "Non-smoking Rooms": "All rooms are non-smoking",
        "Designated Smoking Areas": "Available in outdoor spaces only",
        "Violation Fee":
          "$250 cleaning fee for smoking in non-designated areas",
      },
      "Pet Policy": {
        "Allowed Pets": "Dogs and cats only, maximum 2 pets per room",
        "Pet Fee": "$50 per pet, per stay",
        "Pet Amenities": "Pet beds and bowls available upon request",
        "Service Animals": "Welcome at no additional charge",
      },
      "Pool and Fitness Center Rules": {
        "Hours of Operation": "6:00 AM to 10:00 PM daily",
        "Age Restrictions": "Children under 16 must be accompanied by an adult",
        "Proper Attire":
          "Required in fitness center and when moving through the hotel",
      },
    },
  },
  "Additional Policies": {
    icon: Info,
    subcategories: {
      "Internet Access": {
        "WiFi Availability":
          "Complimentary WiFi available in all rooms and public areas",
        "Premium WiFi": "High-speed option available for $10 per day",
      },
      "Parking Services": {
        "Self-parking": "Available 24/7, $15 per day with in/out privileges",
        "Valet Parking": "Available from 6:00 AM to 11:00 PM, $25 per day",
        "Electric Vehicle Charging":
          "Two charging stations available, first-come-first-served basis",
      },
      "Age Restrictions": {
        "Minimum Check-in Age": "Guests must be 18 years or older to check-in",
        Minors: "Must be accompanied by an adult 21 years or older",
      },
      Accessibility: {
        "ADA Compliant Rooms": "Available upon request",
        "Mobility Equipment":
          "Wheelchairs and mobility scooters available for rent",
        "Service Animals": "Welcomed in all areas of the hotel",
      },
    },
  },
};

export const reviews = [
  {
    rating: "10/10",
    title: "Exceptional",
    content: "Enjoyed staying there",
    author: "Mohammad",
    date: "Nov 23, 2024",
  },
  {
    rating: "10/10",
    title: "Exceptional",
    content:
      "Enjoyed my stay. Interior met USA standards, which was good. Staff was super friendly and helpful. Area around hotel was typical for Dhaka. I felt safe.",
    author: "Lester",
    date: "Nov 10, 2024",
  },
  {
    rating: "9/10",
    title: "Great Experience",
    content:
      "The hotel was clean and well-maintained. The breakfast was amazing, though the coffee could have been better.",
    author: "Aisha",
    date: "Oct 28, 2024",
  },
  {
    rating: "8/10",
    title: "Very Good Stay",
    content:
      "Room was spacious and comfortable. Noise from the street was a bit much, but otherwise excellent service.",
    author: "Rahul",
    date: "Oct 15, 2024",
  },
  {
    rating: "7/10",
    title: "Good but Could Be Better",
    content:
      "Staff was helpful, but the Wi-Fi was unreliable, and the check-in process took too long.",
    author: "Sophia",
    date: "Sep 30, 2024",
  },
  {
    rating: "6/10",
    title: "Decent Stay",
    content:
      "The location was convenient, but the air conditioning didn’t work properly. Not ideal for summer stays.",
    author: "Carlos",
    date: "Sep 15, 2024",
  },
  {
    rating: "5/10",
    title: "Average Experience",
    content:
      "The rooms were okay, but the bathroom needed better cleaning. Room service was slow.",
    author: "Emma",
    date: "Aug 20, 2024",
  },
  {
    rating: "4/10",
    title: "Disappointing",
    content:
      "Staff was unresponsive at times. The restaurant food wasn’t great. Not worth the price.",
    author: "Ahmed",
    date: "Aug 5, 2024",
  },
  {
    rating: "3/10",
    title: "Poor Service",
    content:
      "I faced issues with the hot water, and the room was not cleaned properly during my stay.",
    author: "John",
    date: "Jul 15, 2024",
  },
  {
    rating: "2/10",
    title: "Would Not Recommend",
    content:
      "The hotel was overcrowded, and the staff seemed overwhelmed. Not a pleasant experience.",
    author: "Anna",
    date: "Jun 30, 2024",
  },
  {
    rating: "1/10",
    title: "Terrible Experience",
    content:
      "The room smelled bad, and the bed was uncomfortable. I ended up leaving early.",
    author: "Liam",
    date: "Jun 10, 2024",
  },
];
