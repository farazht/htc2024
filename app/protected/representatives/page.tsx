"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/Dropdown";
import Map from "@/components/Map";
import { Button } from "@/components/ui/Button";

const Representatives: React.FC = () => {
  // ward is default state
  const [selection, setSelection] = useState("Ward"); 

  const handleSelectionChange = (value: string) => {
    setSelection(value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl sm:text-4xl font-bold text-foreground">
        Representatives Map
      </h1>

      {/* dropdown */}
      <div className="flex items-center space-x-4 mb-4">
        <label htmlFor="geoSelect" className="font-medium">
          Select Level:
        </label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"outline"}
              className="px-4 py-2 bg-background rounded-md text-sm text-foreground border-2 border-solid border-muted"
            >
              {selection} <span className="ml-2">▼</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuRadioGroup
              value={selection}
              onValueChange={handleSelectionChange}
            >
              <DropdownMenuRadioItem value="Ward" className="text-foreground">
                Ward (Municipal)
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="Constituency"
                className="text-foreground"
              >
                Constituency (Provincial)
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="Electoral District"
                className="text-foreground"
              >
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
