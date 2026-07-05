import * as React from "react";
import { cn } from "@/lib/utils";

function Table({
  className,
  ...props
}) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm"
    >
      <table
        data-slot="table"
        className={cn(
          "w-full caption-bottom text-sm border-collapse",
          className
        )}
        {...props}
      />
    </div>
  );
}

function TableHeader({
  className,
  ...props
}) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "bg-gray-50 [&_tr]:border-b [&_tr]:border-gray-200",
        className
      )}
      {...props}
    />
  );
}

function TableBody({
  className,
  ...props
}) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(
        "[&_tr:last-child]:border-0",
        className
      )}
      {...props}
    />
  );
}

function TableFooter({
  className,
  ...props
}) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t border-gray-200 bg-gray-50 font-medium",
        className
      )}
      {...props}
    />
  );
}

function TableRow({
  className,
  ...props
}) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-gray-200 transition-colors hover:bg-orange-50 data-[state=selected]:bg-orange-50",
        className
      )}
      {...props}
    />
  );
}

function TableHead({
  className,
  ...props
}) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-12 px-4 text-left align-middle font-semibold text-gray-800 whitespace-nowrap border-b border-gray-200",
        className
      )}
      {...props}
    />
  );
}

function TableCell({
  className,
  ...props
}) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-4 py-3 align-middle whitespace-nowrap text-gray-700",
        className
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(
        "mt-4 text-sm text-gray-500",
        className
      )}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};