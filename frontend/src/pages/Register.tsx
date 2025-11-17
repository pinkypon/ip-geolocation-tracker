import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios, { csrf } from "../lib/axios"; // Import csrf function

interface FormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface FormErrors {
  name?: string[];
  email?: string[];
  password?: string[];
  password_confirmation?: string[];
}

export default function SimpleRegister() {
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name as keyof FormErrors]: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setErrors({});

    try {
      // Call csrf() to get the CSRF cookie
      await csrf();

      // Now register
      await axios.post("/register", form);

      // Fetch user data
      await fetchUser();

      // Redirect
      navigate("/login");
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      }
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Register</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-2 font-medium">Name:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name[0]}</span>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 font-medium">Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email[0]}</span>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block mb-2 font-medium">Password:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password[0]}</span>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block mb-2 font-medium">Confirm Password:</label>
          <input
            type="password"
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded ${
              errors.password_confirmation
                ? "border-red-500"
                : "border-gray-300"
            }`}
            required
          />
          {errors.password_confirmation && (
            <span className="text-red-500 text-sm">
              {errors.password_confirmation[0]}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-3 rounded font-semibold text-white ${
            submitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {submitting ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
