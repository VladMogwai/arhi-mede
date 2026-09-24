export const siteUrl = "https://www.arhi-mede.ro";

export const studio = {
  name: "Arhi Mede Studio",
  wordmark: "Arhi Mede",
  address: {
    street: "Str. Dr. Constantin Caracaș nr. 4",
    district: "Sector 1",
    city: "București",
    country: "România",
  },
  email: "office@arhi-mede.ro",
  // The old site only shows a placeholder ("07xx xxx xxx"); waiting for the real number from the studio.
  phone: null as string | null,
  hours: { weekdays: "9–17", saturday: "9–13" },
} as const;
