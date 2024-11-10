"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import Map from "@/components/Map";

const Representatives: React.FC = () => {
  const [selection, setSelection] = useState("Ward"); // Default to "Ward"

  const handleSelectionChange = (value: string) => {
    setSelection(value);
  };

  return (
    <div className="min-w-full">
      {/* text */}
      <h1 className="text-3xl font-bold text-center my-8">Representatives Map</h1>

      {/* dropdown */}
      <div className="flex items-center space-x-4 mb-4">
        <label htmlFor="geoSelect" className="font-medium">Select Level:</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="px-4 py-2 bg-background dark:bg-background-dark rounded-md text-sm border border-foreground dark:border-foreground-dark hover:bg-background-light dark:hover:bg-background-dark-light">
              {selection} <span className="ml-2">▼</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuRadioGroup value={selection} onValueChange={handleSelectionChange}>
              <DropdownMenuRadioItem value="Ward" className="text-foreground">
                Ward (Municipal)
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Constituency" className="text-foreground">
                Constituency (Provincial)
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Electoral District" className="text-foreground">
                Electoral District (Federal)
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* map */}
      <Map selection={selection} />
    </div>
  );
};

export default Representatives;