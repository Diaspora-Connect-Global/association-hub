export type Currency = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY" | "CNY" | "NGN" | "KES" | "ZAR" | "GHS" | "XOF" | "XAF";

export interface VendorMilestoneTemplate {
  id: string;
  name: string;
  description?: string;
  percentage: number;
  order: number;
}

export interface VendorEscrowSettings {
  vendorId: string;
  escrowEnabled: boolean;
  autoReleaseAfterDays: number; // 0 = manual only
  requireBuyerConfirmation: boolean;
  disputeWindowDays: number;
  defaultMilestones: VendorMilestoneTemplate[];
  escrowFeePercentage: number;
  minimumOrderAmountForEscrow: number;
  currency: Currency;
  createdAt: string;
  updatedAt: string;
}

export interface CurrencyRate {
  code: Currency;
  name: string;
  symbol: string;
  rate: number; // Rate relative to USD
  lastUpdated: string;
}

export const currencyInfo: Record<Currency, { name: string; symbol: string }> = {
  USD: { name: "US Dollar", symbol: "$" },
  EUR: { name: "Euro", symbol: "€" },
  GBP: { name: "British Pound", symbol: "£" },
  CAD: { name: "Canadian Dollar", symbol: "C$" },
  AUD: { name: "Australian Dollar", symbol: "A$" },
  CHF: { name: "Swiss Franc", symbol: "CHF" },
  JPY: { name: "Japanese Yen", symbol: "¥" },
  CNY: { name: "Chinese Yuan", symbol: "¥" },
  NGN: { name: "Nigerian Naira", symbol: "₦" },
  KES: { name: "Kenyan Shilling", symbol: "KSh" },
  ZAR: { name: "South African Rand", symbol: "R" },
  GHS: { name: "Ghanaian Cedi", symbol: "₵" },
  XOF: { name: "CFA Franc BCEAO", symbol: "CFA" },
  XAF: { name: "CFA Franc BEAC", symbol: "FCFA" },
};

export const defaultVendorEscrowSettings: VendorEscrowSettings = {
  vendorId: "",
  escrowEnabled: true,
  autoReleaseAfterDays: 14,
  requireBuyerConfirmation: true,
  disputeWindowDays: 7,
  defaultMilestones: [],
  escrowFeePercentage: 2.5,
  minimumOrderAmountForEscrow: 50,
  currency: "USD",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
