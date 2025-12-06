import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  RefreshCw,
  Save,
  Loader2,
  ArrowRightLeft,
  TrendingUp,
  TrendingDown,
  Clock,
  Edit2,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Currency, currencyInfo, CurrencyRate } from "@/types/vendor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock exchange rates (relative to USD)
const mockExchangeRates: CurrencyRate[] = [
  { code: "USD", name: "US Dollar", symbol: "$", rate: 1.0, lastUpdated: new Date().toISOString() },
  { code: "EUR", name: "Euro", symbol: "€", rate: 0.92, lastUpdated: new Date().toISOString() },
  { code: "GBP", name: "British Pound", symbol: "£", rate: 0.79, lastUpdated: new Date().toISOString() },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", rate: 1.36, lastUpdated: new Date().toISOString() },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", rate: 1.53, lastUpdated: new Date().toISOString() },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", rate: 0.88, lastUpdated: new Date().toISOString() },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 149.50, lastUpdated: new Date().toISOString() },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", rate: 7.24, lastUpdated: new Date().toISOString() },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", rate: 1550.00, lastUpdated: new Date().toISOString() },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", rate: 153.50, lastUpdated: new Date().toISOString() },
  { code: "ZAR", name: "South African Rand", symbol: "R", rate: 18.75, lastUpdated: new Date().toISOString() },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵", rate: 14.85, lastUpdated: new Date().toISOString() },
  { code: "XOF", name: "CFA Franc BCEAO", symbol: "CFA", rate: 603.50, lastUpdated: new Date().toISOString() },
  { code: "XAF", name: "CFA Franc BEAC", symbol: "FCFA", rate: 603.50, lastUpdated: new Date().toISOString() },
];

interface AdminCurrencySettingsProps {
  defaultCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

export function AdminCurrencySettings({ defaultCurrency, onCurrencyChange }: AdminCurrencySettingsProps) {
  const [rates, setRates] = useState<CurrencyRate[]>(mockExchangeRates);
  const [baseCurrency, setBaseCurrency] = useState<Currency>(defaultCurrency);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingRate, setEditingRate] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [conversionAmount, setConversionAmount] = useState<string>("100");
  const [fromCurrency, setFromCurrency] = useState<Currency>("USD");
  const [toCurrency, setToCurrency] = useState<Currency>("EUR");
  const [isSaving, setIsSaving] = useState(false);

  const handleRefreshRates = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Simulate rate changes
    setRates((prev) =>
      prev.map((rate) => ({
        ...rate,
        rate: rate.code === "USD" ? 1 : rate.rate * (0.98 + Math.random() * 0.04),
        lastUpdated: new Date().toISOString(),
      }))
    );
    
    setIsRefreshing(false);
    toast({
      title: "Rates Updated",
      description: "Exchange rates have been refreshed from the latest market data.",
    });
  };

  const handleEditRate = (code: string) => {
    const rate = rates.find((r) => r.code === code);
    if (rate) {
      setEditingRate(code);
      setEditValue(rate.rate.toString());
    }
  };

  const handleSaveRate = (code: string) => {
    const newRate = parseFloat(editValue);
    if (isNaN(newRate) || newRate <= 0) {
      toast({
        title: "Invalid Rate",
        description: "Please enter a valid positive number.",
        variant: "destructive",
      });
      return;
    }

    setRates((prev) =>
      prev.map((rate) =>
        rate.code === code
          ? { ...rate, rate: newRate, lastUpdated: new Date().toISOString() }
          : rate
      )
    );
    setEditingRate(null);
    toast({
      title: "Rate Updated",
      description: `${code} exchange rate has been manually updated.`,
    });
  };

  const convertCurrency = (amount: number, from: Currency, to: Currency): number => {
    const fromRate = rates.find((r) => r.code === from)?.rate || 1;
    const toRate = rates.find((r) => r.code === to)?.rate || 1;
    // Convert to USD first, then to target currency
    const usdAmount = amount / fromRate;
    return usdAmount * toRate;
  };

  const handleBaseCurrencyChange = async (currency: Currency) => {
    setBaseCurrency(currency);
    onCurrencyChange(currency);
    
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    
    toast({
      title: "Default Currency Changed",
      description: `Platform default currency is now ${currencyInfo[currency].name} (${currency})`,
    });
  };

  const getConvertedAmount = () => {
    const amount = parseFloat(conversionAmount) || 0;
    return convertCurrency(amount, fromCurrency, toCurrency);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Currency & Exchange Rates
              </CardTitle>
              <CardDescription>
                Manage platform currency and exchange rates for conversions
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConversionModal(true)}
              >
                <ArrowRightLeft className="h-4 w-4 mr-1" />
                Converter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshRates}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh Rates
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Default Currency Selection */}
          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
            <div className="space-y-1">
              <Label className="text-base font-medium">Platform Default Currency</Label>
              <p className="text-sm text-muted-foreground">
                All new orders will use this currency by default
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={baseCurrency} onValueChange={(v) => handleBaseCurrencyChange(v as Currency)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(currencyInfo) as Currency[]).map((code) => (
                    <SelectItem key={code} value={code}>
                      <span className="flex items-center gap-2">
                        <span className="font-mono w-8">{currencyInfo[code].symbol}</span>
                        <span>{code}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isSaving && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
          </div>

          <Separator />

          {/* Exchange Rates Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium">Exchange Rates (Base: USD)</h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Last updated: {new Date(rates[0].lastUpdated).toLocaleString()}
              </div>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Currency</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Rate (1 USD =)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rates.map((rate) => (
                    <TableRow key={rate.code}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{rate.code}</span>
                          <span className="text-muted-foreground text-sm">{rate.name}</span>
                          {rate.code === baseCurrency && (
                            <Badge variant="secondary" className="text-xs">Default</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{rate.symbol}</TableCell>
                      <TableCell>
                        {editingRate === rate.code ? (
                          <Input
                            type="number"
                            step="0.0001"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-32 h-8"
                            autoFocus
                          />
                        ) : (
                          <span className="font-mono">
                            {rate.rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {rate.code !== "USD" && (
                          editingRate === rate.code ? (
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleSaveRate(rate.code)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                onClick={() => setEditingRate(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleEditRate(rate.code)}
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                          )
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-start gap-2 mt-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
              <div className="text-xs text-amber-700 dark:text-amber-400">
                <p className="font-medium">Manual Rate Override</p>
                <p>Manually edited rates will not update when refreshing. Use this for custom rates or when API rates are unavailable.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currency Converter Modal */}
      <Dialog open={showConversionModal} onOpenChange={setShowConversionModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5" />
              Currency Converter
            </DialogTitle>
            <DialogDescription>
              Convert amounts between currencies using current rates
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                value={conversionAmount}
                onChange={(e) => setConversionAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
              <div className="space-y-2">
                <Label>From</Label>
                <Select value={fromCurrency} onValueChange={(v) => setFromCurrency(v as Currency)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(currencyInfo) as Currency[]).map((code) => (
                      <SelectItem key={code} value={code}>
                        {code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="mb-0.5"
                onClick={() => {
                  setFromCurrency(toCurrency);
                  setToCurrency(fromCurrency);
                }}
              >
                <ArrowRightLeft className="h-4 w-4" />
              </Button>

              <div className="space-y-2">
                <Label>To</Label>
                <Select value={toCurrency} onValueChange={(v) => setToCurrency(v as Currency)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(currencyInfo) as Currency[]).map((code) => (
                      <SelectItem key={code} value={code}>
                        {code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-1">Converted Amount</p>
              <p className="text-3xl font-bold">
                {currencyInfo[toCurrency].symbol}
                {getConvertedAmount().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                1 {fromCurrency} = {convertCurrency(1, fromCurrency, toCurrency).toFixed(4)} {toCurrency}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConversionModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
