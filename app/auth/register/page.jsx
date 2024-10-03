'use client';

import React, { useState } from 'react';
import { toast } from "react-toastify";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import OAuth from "../../../components/auth/OAuth";
import { db } from "../../../firebase/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, updateProfile, } from "firebase/auth";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", });
  const { name, email, password } = formData;
  const router = useRouter();

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  //console.log('register creditials =>', formData)

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      updateProfile(auth.currentUser, {
        displayName: name,
      });
      const user = userCredential.user;
      console.log(user);
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);        
        toast.success("Registration completed successfully. You will be redirected shortly.");
        router.push("/");        
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className='w-full max-w-lg mt-6'>
        <h1 className='text-4xl text-center font-bold text-gray-800 mb-8'>Register</h1>
        <form
          onSubmit={onSubmit}
          className='space-y-6'
        >
          <input
            type="text"
            id="name"
            value={name}
            onChange={onChange}
            placeholder="Full name"
            className="w-full px-4 py-3 text-lg text-gray-900 bg-zinc-50 border border-gray-300 rounded-md transition duration-200 focus:ring-2 focus:ring-orange-700 focus:outline-none"
          />
          <input
            type="email"
            id="email"
            value={email}
            onChange={onChange}
            placeholder="Email address"
            className="w-full px-4 py-3 text-lg text-gray-900 bg-zinc-50 border border-gray-300 rounded-md transition duration-200 focus:ring-2 focus:ring-orange-700 focus:outline-none"
          />
          <div className='relative'>
            <input 
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={onChange}
              placeholder="Password"
              className="w-full px-4 py-3 text-lg text-gray-900 bg-zinc-50 border border-gray-300 rounded-md transition duration-200 focus:ring-2 focus:ring-orange-700 focus:outline-none"
            />
            {showPassword ? (
              <AiFillEyeInvisible
                className="absolute right-4 top-4 text-xl cursor-pointer text-gray-600"
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            ) : (
              <AiFillEye
                className="absolute right-4 top-4 text-xl cursor-pointer text-gray-600"
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            )}
          </div>
          <div className="flex justify-between items-center text-lg">
            <p>
              Already have an account?
              <Link
                href="/auth/login"
                className="font-medium text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out ml-1"
              >
                Log in
              </Link>
            </p>
            <p>
              <Link
                href="/auth/forgot-password"
                className="font-medium text-red-600 hover:text-red-900 transition duration-200 ease-in-out"
              >
                Forgot password?
              </Link>
            </p>
          </div>
          <button
            className="w-full bg-sky-900 text-white px-7 py-3 text-lg font-medium uppercase rounded-lg shadow-md hover:bg-sky-950 transition duration-150 ease-in-out hover:shadow-lg active:bg-sky-800"
            type="submit"
          >
            Register
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