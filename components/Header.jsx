'use client';

import React, { useState, useEffect } from 'react'
import { useRouter } from "next/navigation";
import { FiSearch } from 'react-icons/fi';
import Link from 'next/link';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from '../firebase/firebase';
import { FcHome } from "react-icons/fc";
import { MdMapsHomeWork } from "react-icons/md";
import PrivateRoute from './auth/PrivateRoute';

export default function Header() {
  const router = useRouter();
  const [pageState, setPageState] = useState("Login");
  const [joinUsState, setJoinUsState] = useState("Join Us"); 
  const auth = getAuth(app);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const displayName = user.displayName || "Me"; // Fallback in case displayName is null
        setPageState(capitalizeFirstLetter(displayName)); 
        setJoinUsState("");
      } else {
        setPageState("Login");
        setJoinUsState("Join Us"); 
      }
    });
  }, [auth]);

  function pathMatchRoute(route) {
    if (route === router.pathname) {
      return true;
    }
  };

  return (
      <header className="bg-gray-50 border-b shadow-sm sticky top-0 z-40 py-3">
        <div className='flex justify-between items-center px-6 max-w-6xl mx-auto'>
          <h1
            onClick={() => router.push('/')} 
            className='cursor-pointer font-bold text-2xl sm:text-2xl'
          >
            <span className='font-normal'>dunphy </span>
            <span className='font-serif text-orange-600'>estates</span>
          </h1>
          <form
            className='bg-white p-2  shadow-sm rounded-xl flex items-center'
          >
          <input
            type='text'
            placeholder='Search'
            className='bg-transparent focus:outline-none w-24 sm:w-64'
          />
          <button>
            <FiSearch className='text-gray-800 font-bold'/>
          </button>
        </form>
        <PrivateRoute>
          <button
            type="submit"
            className="bg-white p-1 font-medium border-4 border-orange-600 hover:bg-zinc-50 shadow-md hover:shadow-lg active:shadow-lg rounded-xl flex items-center hover:scale-90 transition-transform duration-200"
          >
            <Link
              href="/properties/add"
              className="flex justify-center items-center"
            >
              <MdMapsHomeWork className="mr-2 text-3xl bg-white rounded-full p-1 border-2" />
              Add Property
            </Link>
          </button>
        </PrivateRoute>
        <div>
          <ul className='flex gap-4 font-sans font-semibold text-black'>
            <li className='cursor-pointer hidden sm:inline relative group hover:text-orange-600 hover:-translate-y-1 duration-500 transition-all'>
              Offers
              <span className="absolute left-0 bottom-0 w-full h-[3px] bg-orange-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </li>
            <li className='cursor-pointer hidden sm:inline relative group hover:text-orange-600 hover:-translate-y-1 duration-500 transition-all'>
              <Link href="/about">About</Link> 
              <span className="absolute left-0 bottom-0 w-full h-[3px] bg-orange-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </li>
            <li 
              className='cursor-pointer hidden sm:inline relative group hover:text-orange-600 hover:-translate-y-1 duration-500 transition-all'
              onClick={() => {
                if (auth.currentUser) {
                  router.push(`/useraccount/${auth.currentUser.uid}`);
                } else {
                  router.push("/auth/login");
                }
              }}
            >
              {pageState} 
              <span className="absolute left-0 bottom-0 w-full h-[3px] bg-orange-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </li>
            <li 
              className='cursor-pointer hidden sm:inline relative group hover:text-orange-600 hover:-translate-y-1 duration-500 transition-all'
            >
              <Link href="/auth/register">{joinUsState}</Link>
              <span className="absolute left-0 bottom-0 w-full h-[3px] bg-orange-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </li>
          </ul>
        </div>
        </div>
      </header>    
  );
};