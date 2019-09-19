import React from "react";
import { BrowserRouter } from "react-router-dom";

import Routes from "./routes";

import Header from './components/Header'

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes />
    </BrowserRouter>
  );
}
