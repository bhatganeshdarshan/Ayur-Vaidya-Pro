'use client'

import HomePage from "./home/page";
import MainPage from "./main-page/page";
import Store from "./store/page";
import Prescription from "./prescription-report/page";
import NearBy from "./locate-nearby/page";
import Onboarding from "./onboarding/page";
import { CartProvider } from "./cart-context";
import { useState } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }
  return (
      <Onboarding />
  );
}