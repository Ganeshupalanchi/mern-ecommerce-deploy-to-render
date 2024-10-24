import { filterOptions } from "@/config";
import React, { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

export default function ProductFilter({ filters, handleFilter }) {
  // console.log(filters);

  return (
    <div className="rounded-lg bg-background shadow-sm">
      <div className="border-b p-4">
        <h2 className="text-xl font-bold">Filters</h2>
      </div>
      <div className="space-y-4 p-4">
        {Object.keys(filterOptions).map((keyItem, i) => (
          <Fragment key={i}>
            <div>
              <h3 className="text-base font-bold">{keyItem}</h3>
              <div className="mt-2 grid gap-2">
                {filterOptions[keyItem].map((option) => (
                  <Label
                    className="flex items-center gap-2 font-medium"
                    key={option.id}
                  >
                    <Checkbox
                      checked={filters[keyItem]?.includes(option.id)}
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
            <Separator />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
