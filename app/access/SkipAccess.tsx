"use client";

import { Button } from "@/components/ui/button";
import { getLocalStorageItem, removeLocalStorageItem } from "@/lib/utils";
import React, { useState } from "react";

export const SkipAccess = () => {
  const skip = getLocalStorageItem("skip");
  const [isEnable, setIsEnabled] = useState(false);

  const handleClick = async () => {
    if (!skip) {
      localStorage.setItem("skip", "true");
      setIsEnabled(prev => !prev);
    } else {
        removeLocalStorageItem("skip")
        setIsEnabled(prev => !prev);
    }
  };

  return (
    <Button variant={"outline"} onClick={handleClick}>
      {!isEnable ? "Enable auto-skip" : ("Disable auto-skip")}
    </Button>
  );
};
