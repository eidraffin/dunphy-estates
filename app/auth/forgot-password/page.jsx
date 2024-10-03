'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import OAuth from "../../../components/auth/OAuth";
import { toast } from "react-toastify";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  function onChange(e) {
    setEmail(e.target.value);
  };

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Email was sent");
    } catch (error) {
      toast.error("Could not send reset password");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className='w-full max-w-lg mt-6'>
        <h1 className='text-4xl text-center font-bold text-gray-800 mb-8'>Find your account</h1>
        <form
          onSubmit={onSubmit}
          className='space-y-6'
        >
          <input
            type="email"
            id="email"
            value={email}
            onChange={onChange}
            placeholder="Email address"
            className="w-full px-4 py-3 text-lg text-gray-900 bg-zinc-50 border border-gray-300 rounded-md transition duration-200 focus:ring-2 focus:ring-orange-700 focus:outline-none"
          />
          <div className="flex justify-between items-center text-lg">
            <p>
              Don&#39;t have an account?
              <Link
                href="/auth/register"
                className="font-medium text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out ml-1"
              >
                Register
              </Link>
            </p>
          </div>
          <button
            className="w-full bg-sky-900 text-white px-7 py-3 text-lg font-medium rounded-lg shadow-md hover:bg-sky-950 transition duration-150 ease-in-out hover:shadow-lg active:bg-sky-800"
            type="submit"
          >
            Send Reset Link
          </button>
          <div className="flex items-center my-4 before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300">
            <p className="text-center font-semibold mx-4 text-gray-600">OR</p>
          </div>
          <OAuth />
        </form>
      </div>
    </section>
  );
};