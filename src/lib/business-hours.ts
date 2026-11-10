/**
 * Kosick's business hours: the single source for the Contact page status line
 * and the LocalBusiness structured data. Times are local to the office
 * (America/Vancouver), which is how schema.org reads opens/closes.
 */
export const BUSINESS_HOURS = {
  timeZone: "America/Vancouver",
  /** 24-hour clock, local time */
  opens: "08:00",
  closes: "17:00",
  openHour: 8,
  closeHour: 17,
  /** schema.org day names */
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  label: "Monday to Friday, 8:00 AM to 5:00 PM Pacific",
} as const;

/** Google's documented LocalBusiness form of the hours above. */
export const OPENING_HOURS_SPECIFICATION = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [...BUSINESS_HOURS.days],
    opens: BUSINESS_HOURS.opens,
    closes: BUSINESS_HOURS.closes,
  },
];
