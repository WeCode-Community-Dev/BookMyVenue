"use client";

import { Info, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  createDefaultPricingFormState,
  DEFAULT_CURRENCY,
  type PricingFormState,
  type PricingModelId,
  PRICING_MODEL_OPTIONS,
  pricingModelToApiType,
  resolvePricingFormFromRecords,
  SUPPORTED_CURRENCIES,
} from "@/lib/data/space-manage";
import { cn } from "@/lib/utils";
import {
  getSpacePricing,
  upsertSpacePricing,
} from "@/services/venueServices";

type ManageSpacePricingProps = {
  spaceId: string;
};

type CurrencyFieldProps = {
  id: string;
  label: string;
  amount: string;
  currency: string;
  onAmountChange: (value: string) => void;
  onCurrencyChange: (value: string) => void;
  disabled?: boolean;
};

function CurrencyField({
  id,
  label,
  amount,
  currency,
  onAmountChange,
  onCurrencyChange,
  disabled = false,
}: CurrencyFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={`${id}-amount`}>{label}</Label>
      <div className="flex gap-2">
        <Input
          id={`${id}-amount`}
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={amount}
          disabled={disabled}
          onChange={(e) => onAmountChange(e.target.value)}
          className="flex-1"
        />
        <Select
          value={currency}
          disabled={disabled}
          onValueChange={onCurrencyChange}
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_CURRENCIES.map((code) => (
              <SelectItem key={code} value={code}>
                {code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function cloneFormState(state: PricingFormState): PricingFormState {
  return { ...state };
}

export function ManageSpacePricing({ spaceId }: ManageSpacePricingProps) {
  const [form, setForm] = useState<PricingFormState>(
    createDefaultPricingFormState(),
  );
  const [savedSnapshot, setSavedSnapshot] = useState<PricingFormState>(
    createDefaultPricingFormState(),
  );
  const [pricingRecords, setPricingRecords] = useState<
    Awaited<ReturnType<typeof getSpacePricing>>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadPricing = useCallback(async () => {
    try {
      setIsLoading(true);
      const records = await getSpacePricing(spaceId);
      const nextForm = resolvePricingFormFromRecords(records);
      setPricingRecords(records);
      setForm(nextForm);
      setSavedSnapshot(cloneFormState(nextForm));
    } catch (error) {
      toast.error(
        (error as Error)?.message ?? "Failed to load pricing settings.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [spaceId]);

  useEffect(() => {
    loadPricing();
  }, [loadPricing]);

  const updateForm = (patch: Partial<PricingFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const handleModelChange = (model: PricingModelId) => {
    const existing = pricingRecords.find(
      (record) => record.pricingType === pricingModelToApiType(model),
    );

    if (existing) {
      updateForm({
        model,
        amount: existing.pricingType === "CUSTOM" ? "" : existing.amount,
        currency: existing.currency,
        minBooking:
          existing.minBooking != null ? String(existing.minBooking) : "",
        maxBooking:
          existing.maxBooking != null ? String(existing.maxBooking) : "",
      });
      return;
    }

    updateForm({
      model,
      amount: "",
      currency: DEFAULT_CURRENCY,
      minBooking: "",
      maxBooking: "",
    });
  };

  const handleCancel = () => {
    setForm(cloneFormState(savedSnapshot));
  };

  const validateForm = (): boolean => {
    if (form.model === "custom") {
      return true;
    }

    const amount = Number(form.amount);
    if (!form.amount || Number.isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid price greater than zero.");
      return false;
    }

    if (form.model === "hourly") {
      const min =
        form.minBooking.trim() === "" ? null : Number(form.minBooking);
      const max =
        form.maxBooking.trim() === "" ? null : Number(form.maxBooking);

      if (min != null && (Number.isNaN(min) || min < 1)) {
        toast.error("Minimum hours must be at least 1.");
        return false;
      }
      if (max != null && (Number.isNaN(max) || max < 1)) {
        toast.error("Maximum hours must be at least 1.");
        return false;
      }
      if (min != null && max != null && max < min) {
        toast.error("Maximum hours must be greater than or equal to minimum hours.");
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    const pricingType = pricingModelToApiType(form.model);
    const payload =
      form.model === "custom"
        ? {
            pricingType,
            amount: 1,
            currency: DEFAULT_CURRENCY,
          }
        : {
            pricingType,
            amount: Number(form.amount),
            currency: form.currency,
            ...(form.model === "hourly" && form.minBooking.trim() !== ""
              ? { minBooking: Number(form.minBooking) }
              : {}),
            ...(form.model === "hourly" && form.maxBooking.trim() !== ""
              ? { maxBooking: Number(form.maxBooking) }
              : {}),
          };

    try {
      setIsSaving(true);
      const saved = await upsertSpacePricing(spaceId, payload);
      const records = await getSpacePricing(spaceId);
      const nextForm = resolvePricingFormFromRecords(records);

      setPricingRecords(records);
      setForm(nextForm);
      setSavedSnapshot(cloneFormState(nextForm));
      toast.success(
        saved.pricingType === "CUSTOM"
          ? "Custom quote pricing saved."
          : "Pricing saved successfully.",
      );
    } catch (error) {
      toast.error((error as Error)?.message ?? "Failed to save pricing.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderPricingDetails = () => {
    switch (form.model) {
      case "hourly":
        return (
          <div className="flex flex-col gap-6">
            <CurrencyField
              id="hourly-rate"
              label="Hourly Rate"
              amount={form.amount}
              currency={form.currency}
              onAmountChange={(value) => updateForm({ amount: value })}
              onCurrencyChange={(value) => updateForm({ currency: value })}
            />
            <Separator />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="min-hours">Minimum Hours</Label>
                <Input
                  id="min-hours"
                  type="number"
                  min="1"
                  placeholder="e.g. 1"
                  value={form.minBooking}
                  onChange={(e) => updateForm({ minBooking: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="max-hours">Maximum Hours</Label>
                <Input
                  id="max-hours"
                  type="number"
                  min="1"
                  placeholder="e.g. 8"
                  value={form.maxBooking}
                  onChange={(e) => updateForm({ maxBooking: e.target.value })}
                />
              </div>
            </div>
          </div>
        );
      case "daily":
        return (
          <CurrencyField
            id="daily-price"
            label="Daily Price"
            amount={form.amount}
            currency={form.currency}
            onAmountChange={(value) => updateForm({ amount: value })}
            onCurrencyChange={(value) => updateForm({ currency: value })}
          />
        );
      case "event":
        return (
          <CurrencyField
            id="event-price"
            label="Event Price"
            amount={form.amount}
            currency={form.currency}
            onAmountChange={(value) => updateForm({ amount: value })}
            onCurrencyChange={(value) => updateForm({ currency: value })}
          />
        );
      case "session":
        return (
          <CurrencyField
            id="session-price"
            label="Session Price"
            amount={form.amount}
            currency={form.currency}
            onAmountChange={(value) => updateForm({ amount: value })}
            onCurrencyChange={(value) => updateForm({ currency: value })}
          />
        );
      case "custom":
        return (
          <div className="flex items-start gap-3 rounded-lg border border-outline-variant/40 bg-primary-container/10 p-4">
            <Info className="mt-0.5 size-5 shrink-0 text-surface-tint" />
            <div className="flex flex-col gap-2">
              <Badge variant="secondary" className="w-fit">
                Custom quote
              </Badge>
              <p className="text-sm text-on-surface-variant">
                Customers will submit a booking request and you can send a
                custom quotation manually.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-10 animate-spin text-surface-tint" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-on-surface">Pricing</h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          Configure how customers are charged for booking this space.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pricing Model</CardTitle>
          <CardDescription>Choose how customers are charged.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={form.model}
            onValueChange={(value) => handleModelChange(value as PricingModelId)}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {PRICING_MODEL_OPTIONS.map((option) => (
              <label
                key={option.id}
                htmlFor={`pricing-model-${option.id}`}
                className={cn(
                  "relative flex cursor-pointer flex-col gap-2 rounded-lg border p-4 transition-colors",
                  form.model === option.id
                    ? "border-surface-tint bg-primary-container/20 ring-2 ring-surface-tint"
                    : "border-outline-variant/40 hover:border-outline-variant hover:bg-muted/30",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-on-surface">
                      {option.label}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      {option.description}
                    </span>
                  </div>
                  <RadioGroupItem
                    id={`pricing-model-${option.id}`}
                    value={option.id}
                    className="mt-0.5"
                  />
                </div>
              </label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing Details</CardTitle>
          <CardDescription>
            Set the rates for your selected pricing model.
          </CardDescription>
        </CardHeader>
        <CardContent>{renderPricingDetails()}</CardContent>
      </Card>

      <div className="flex justify-end gap-3 rounded-lg border border-outline-variant/30 bg-surface-container-low px-5 py-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="bg-surface-tint text-on-primary hover:bg-surface-tint/90"
        >
          {isSaving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Pricing"
          )}
        </Button>
      </div>
    </div>
  );
}
