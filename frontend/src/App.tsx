// src/App.tsx
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./router";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
