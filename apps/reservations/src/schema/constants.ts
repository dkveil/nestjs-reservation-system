export const RESERVATION_CONSTANTS = {
  MIN_GUESTS: 1,
  MAX_GUESTS: 10,
  CURRENCIES: ['PLN', 'EUR', 'USD'] as const,
  DEFAULT_CURRENCY: 'PLN',
  STATUSES: ['PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED', 'REJECTED'] as const,
} as const;

export type SupportedCurrency = (typeof RESERVATION_CONSTANTS.CURRENCIES)[number];
