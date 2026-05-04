"use client";

import { useEffect } from "react";

export function ConsoleGreeting() {
  useEffect(() => {
    console.log(
      "👋 Hello there!\nThanks for visiting this site, this project is an open source on github.\n\n🔗 GitHub: https://github.com/adenanteng/wedding",
    );
  }, []);

  return null;
}
