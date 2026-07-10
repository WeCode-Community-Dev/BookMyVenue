import React, { useState } from 'react';
import {
  Users,
  User,
  Mail,
  Phone,
  MessageSquare,
  Upload,
  FileSpreadsheet,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

type Props = {
  guests: number;
  maxCapacity: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  specialRequests: string;
  onChange: (data: any) => void;
};

const GuestSection: React.FC<Props> = ({
  guests,
  maxCapacity,
  contactName,
  contactEmail,
  contactPhone,
  specialRequests,
  onChange,
}) => {
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [parsedGuests, setParsedGuests] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleGuestChange = (val: number) => {
    const updated = Math.max(1, val);
    onChange({ guests: updated });
  };

  const isExceeded = maxCapacity > 0 && guests > maxCapacity;

  const presets: number[] = [];
  if (maxCapacity > 5) {
    presets.push(Math.round(maxCapacity * 0.25));
    presets.push(Math.round(maxCapacity * 0.5));
    presets.push(Math.round(maxCapacity * 0.75));
    presets.push(maxCapacity);
  }
  const uniquePresets = Array.from(new Set(presets)).filter((val) => val > 0 && val <= maxCapacity);

  const downloadTemplate = () => {
    const headers = 'Full Name,Email,Phone,Special Notes\n';
    const sample1 = 'Aarav Sharma,aarav@example.com,+919876543210,Vegetarian\n';
    const sample2 = 'Diya Patel,diya@example.com,+919876543211,Access ramp required\n';
    const csvContent =
      'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + sample1 + sample2);

    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', 'bmv_guest_list_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV template downloaded!');
  };

  const parseCsvText = (text: string) => {
    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    if (lines.length <= 1) {
      toast.error('CSV file is empty or only contains headers.');
      return;
    }

    const headers = lines[0].split(',').map((h) => h.trim().replace(/['"]/g, '').toLowerCase());
    const rows: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim().replace(/['"]/g, ''));
      if (values.length === 0 || (values.length === 1 && values[0] === '')) continue;

      const rowObj: any = {};
      headers.forEach((header, index) => {
        rowObj[header] = values[index] || '';
      });
      rows.push(rowObj);
    }

    if (rows.length === 0) {
      toast.error('Could not parse any guest records from the CSV file.');
      return;
    }

    setParsedGuests(rows);
    onChange({
      guests: rows.length,
      guestList: rows,
      guestFileName: csvFileName,
    });
    toast.success(`Successfully imported ${rows.length} guests from CSV!`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a valid .csv file.');
      return;
    }

    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCsvText(text);
    };
    reader.readAsText(file);
  };

  const clearCsv = () => {
    setCsvFileName(null);
    setParsedGuests([]);
    onChange({
      guests: 1,
      guestList: undefined,
      guestFileName: undefined,
    });
    toast.success('CSV list cleared. Guest count reset.');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a valid .csv file.');
      return;
    }

    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCsvText(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-5 transition-all hover:shadow-md">
      <div className="flex items-center gap-2.5 sm:gap-3 border-b border-border pb-3 sm:pb-4">
        <div className="bg-primary/10 text-primary p-1.5 sm:p-2 rounded-xl shrink-0">
          <Users size={18} className="sm:w-5 sm:h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            Guest & Contact Information
          </h3>
          <p className="text-xs text-muted">Provide attendee count and primary contact details</p>
        </div>
      </div>

      {/* Guest Count Selector */}
      <div className="space-y-3">
        <div className="flex justify-between items-center bg-background p-3 sm:p-4 rounded-xl border border-border gap-3">
          <div className="min-w-0">
            <label className="text-sm font-bold text-foreground block">Number of Guests</label>
            <span className="text-xs text-muted">
              Venue capacity: max {maxCapacity || 'N/A'} guests
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              disabled={!!csvFileName}
              onClick={() => handleGuestChange(guests - 1)}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border border-border text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary rounded-xl transition-all font-bold text-lg select-none disabled:opacity-30 disabled:cursor-not-allowed"
            >
              -
            </button>
            <input
              type="number"
              min={1}
              max={maxCapacity || undefined}
              disabled={!!csvFileName}
              value={guests}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                handleGuestChange(isNaN(val) ? 1 : val);
              }}
              className="w-14 sm:w-16 text-center font-bold text-base sm:text-lg text-foreground bg-background border border-border rounded-xl py-1.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              type="button"
              disabled={!!csvFileName}
              onClick={() => handleGuestChange(guests + 1)}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border border-border text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary rounded-xl transition-all font-bold text-lg select-none disabled:opacity-30 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
        </div>

        {uniquePresets.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 p-1">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
              Quick Presets:
            </span>
            {uniquePresets.map((preset) => (
              <button
                key={preset}
                type="button"
                disabled={!!csvFileName}
                onClick={() => handleGuestChange(preset)}
                className={`px-2 sm:px-2.5 py-1 text-[10px] font-bold border rounded-lg transition-all hover:bg-primary hover:text-white hover:border-primary cursor-pointer active:scale-95 ${
                  guests === preset
                    ? 'bg-primary text-white border-primary'
                    : 'bg-background text-muted border-border'
                }`}
              >
                {preset === maxCapacity ? 'Max' : preset} (
                {preset === maxCapacity ? '100%' : `${Math.round((preset / maxCapacity) * 100)}%`})
              </button>
            ))}
          </div>
        )}

        {isExceeded && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs p-3 rounded-xl flex items-start gap-2">
            <span className="shrink-0">⚠️</span>
            <span className="font-semibold">
              Warning: Guest count ({guests}) exceeds the recommended venue capacity of{' '}
              {maxCapacity} guests.
            </span>
          </div>
        )}
      </div>

      {/* CSV Bulk Uploader */}
      <div className="border border-border/80 rounded-xl p-3.5 sm:p-4 space-y-3 bg-background/50">
        <div className="flex justify-between items-start gap-3 sm:gap-4">
          <div className="min-w-0">
            <span className="text-xs font-bold text-foreground block">Bulk Guest List Import</span>
            <p className="text-[11px] text-muted">
              Uploading a guest roster of 1,000+ people? Avoid typing manually and upload a CSV
              spreadsheet instead.
            </p>
          </div>
          <button
            type="button"
            onClick={downloadTemplate}
            className="text-[10px] font-extrabold text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1.5 rounded-lg transition-all shrink-0 uppercase tracking-wider"
          >
            Template
          </button>
        </div>

        {!csvFileName ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-5 sm:p-6 text-center transition-all ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 bg-background/30'
            }`}
          >
            <input
              type="file"
              id="csv-upload"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />
            <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Upload size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-foreground block hover:text-primary transition-all">
                  Click to upload CSV or drag and drop
                </span>
                <span className="text-[10px] text-muted block mt-0.5">
                  Accepted headers: Full Name, Email, Phone, Special Notes
                </span>
              </div>
            </label>
          </div>
        ) : (
          <div className="border border-border bg-card rounded-xl p-3.5 sm:p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                  <FileSpreadsheet size={16} />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-foreground block truncate">
                    {csvFileName}
                  </span>
                  <span className="text-[10px] text-green-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={12} /> {parsedGuests.length} Guests imported
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={clearCsv}
                className="p-2 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all shrink-0"
                title="Remove Guest List"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Quick Preview Grid */}
            {parsedGuests.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                  Roster Preview (First 3 Guests)
                </span>
                <div className="border border-border/60 rounded-lg overflow-hidden divide-y divide-border/60 bg-background/30 text-[10px]">
                  {parsedGuests.slice(0, 3).map((guest, idx) => (
                    <div
                      key={idx}
                      className="p-2 flex justify-between items-center gap-2 text-foreground font-medium"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <span className="font-bold block truncate">
                          {guest['full name'] || guest['name'] || 'Unnamed Guest'}
                        </span>
                        <span className="text-muted block font-normal truncate">
                          {guest['email'] || 'No Email'} • {guest['phone'] || 'No Phone'}
                        </span>
                      </div>
                      {guest['special notes'] || guest['notes'] ? (
                        <span className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[8px] font-semibold max-w-[80px] sm:max-w-[120px] truncate shrink-0">
                          {guest['special notes'] || guest['notes']}
                        </span>
                      ) : null}
                    </div>
                  ))}
                  {parsedGuests.length > 3 && (
                    <div className="p-1.5 text-center text-muted bg-background/10 font-bold italic text-[9px]">
                      + {parsedGuests.length - 3} more guests in roster
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contact Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-1 sm:pt-2">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative">
            <User
              size={15}
              className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              required
              className="w-full bg-background border border-border rounded-xl pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="John Doe"
              value={contactName}
              onChange={(e) => onChange({ contactName: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail
              size={15}
              className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="email"
              required
              className="w-full bg-background border border-border rounded-xl pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="johndoe@example.com"
              value={contactEmail}
              onChange={(e) => onChange({ contactEmail: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
            Phone Number
          </label>
          <div className="relative">
            <Phone
              size={15}
              className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="tel"
              required
              className="w-full bg-background border border-border rounded-xl pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="+91 98765 43210"
              value={contactPhone}
              onChange={(e) => onChange({ contactPhone: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
            Special Requests / Notes
          </label>
          <div className="relative">
            <MessageSquare
              size={15}
              className="absolute left-3 sm:left-3.5 top-3.5 sm:top-4 text-muted"
            />
            <textarea
              rows={3}
              className="w-full bg-background border border-border rounded-xl pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              placeholder="Any specific catering preferences, seating layouts, or extra timing requirements..."
              value={specialRequests}
              onChange={(e) => onChange({ specialRequests: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestSection;
