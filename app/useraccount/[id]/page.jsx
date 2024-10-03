'use client';

import React, { useState, useEffect } from 'react'
import { FcHome } from "react-icons/fc";
import { toast } from "react-toastify";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PrivateRoute from "../../../components/auth/PrivateRoute";
//import PropertyListItem from "../../../components/PropertyListItem";
import PropertyListItem from "../../../components/properties/PropertyListItem"
import { db, app } from "../../../firebase/firebase";
import { getAuth, updateProfile } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";


export default function UserAccount() {
  const auth = getAuth();
  const router = useRouter();
  const [changeDetail, setChangeDetail] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [properties, setProperties] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const { name, email } = formData;

  // Wait for auth to be ready
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setFormData({
          name: user.displayName || '',
          email: user.email || '',
        });
        // Fetch user listings if user is authenticated
        fetchUserListings(user.uid);
      } else {
        // Handle the case when the user is not authenticated
        setUserLoading(false); // Stop loading, no user to load
        router.push("/login"); // Redirect to login page or wherever you want
      }
      setUserLoading(false); // Stop user loading
    });

    return () => unsubscribe();
  }, [auth]);

  async function fetchUserListings(userId) {
    const listingRef = collection(db, "properties");
    const q = query(
      listingRef,
      where("userRef", "==", userId),
      orderBy("timestamp", "desc")
    );
    const querySnap = await getDocs(q);
    let properties = [];
    querySnap.forEach((doc) => {
      properties.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    setProperties(properties);
    console.log("Property List",properties);
    setLoading(false);
  }

  function onLogout() {
    auth.signOut();
    router.push("/");
  }

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function onSubmit() {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update display name in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // Update name in the firestore
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }
      toast.success("Profile details updated");
    } catch (error) {
      toast.error("Could not update the profile details");
    }
  }

  async function onDelete(listingID) {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "properties", listingID));
      const updatedListings = properties.filter(
        (listing) => listing.id !== listingID
      );
      setProperties(updatedListings);
      toast.success("Successfully deleted the listing");
    }
  }
/*  const [formData, setFormData] = useState({
    //name: auth.currentUser.displayName,
    //email: auth.currentUser.email,
    name: auth.currentUser?.displayName || '',
    email: auth.currentUser?.email || '',
  });
  const { name, email } = formData;
      // Wait for auth to be ready
      useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            setFormData({
              name: user.displayName || '',
              email: user.email || '',
            });
          }
          setUserLoading(false); // Stop user loading
        });
    
        return () => unsubscribe();
      }, [auth]);

  function onLogout() {
    auth.signOut();
    router.push("/");
  }
  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }
  async function onSubmit() {
    try {
      if (auth.currentUser.displayName !== name) {
        //update display name in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // update name in the firestore

        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }
      toast.success("Profile details updated");
    } catch (error) {
      toast.error("Could not update the profile details");
    }
  }

  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(db, "properties");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let properties = [];
      querySnap.forEach((doc) => {
        return properties.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setProperties(properties);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);

  async function onDelete(listingID) {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "properties", listingID));
      const updatedListings = properties.filter(
        (listing) => listing.id !== listingID
      );
      setProperties(updatedListings);
      toast.success("Successfully deleted the listing");
    }
  }
  /*function onEdit(listingID) {
    navigate(`/useraccount/update/${listingID}`);
  }*/
  return (
    <PrivateRoute>
      <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <h1 className="text-3xl text-center mt-6 font-bold">My Profile</h1>
        <div className="w-full md:w-[50%] mt-6 px-3">
          <form>
            {/* Name Input */}

            <input
              type="text"
              id="name"
              value={name}
              disabled={!changeDetail}
              onChange={onChange}
              className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${
                changeDetail && "bg-red-200 focus:bg-red-200"
              }`}
            />

            {/* Email Input */}

            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"
            />

            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
              <p className="flex items-center ">
                Do you want to change your name?
                <span
                  onClick={() => {
                    changeDetail && onSubmit();
                    setChangeDetail((prevState) => !prevState);
                  }}
                  className="text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer"
                >
                  {changeDetail ? "Apply change" : "Edit"}
                </span>
              </p>
              <p
                onClick={onLogout}
                className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer"
              >
                Sign out
              </p>
            </div>
          </form>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800"
          >
            <Link
              href="/properties/add"
              className="flex justify-center items-center"
            >
              <FcHome className="mr-2 text-3xl bg-red-200 rounded-full p-1 border-2" />
              Sell or rent your home
            </Link>
          </button>
        </div>
      </section>
      <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!loading && properties.length > 0 && (
          <>
            <h2 className="text-2xl text-center font-semibold mb-6">
              My Listings
            </h2>
            <ul className="sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {properties.map((listing) => (
                <PropertyListItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </PrivateRoute>
  );
}
/*  
  const router = useRouter();
  const auth = getAuth(app);
  const [changeDetail, setChangeDetail] = useState(false);
  const [properties, setProperties] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true); // Added loading state for user
  const [formData, setFormData] = useState({
    //name: auth.currentUser.displayName,
    //email: auth.currentUser.email,
    name: auth.currentUser?.displayName || '',
    email: auth.currentUser?.email || '',
  
  });
  const { name, email } = formData;

    // Wait for auth to be ready
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setFormData({
            name: user.displayName || '',
            email: user.email || '',
          });
        }
        setUserLoading(false); // Stop user loading
      });
  
      return () => unsubscribe();
    }, [auth]);

  function onLogout() {
    auth.signOut();
    router.push("/");
    window.location.reload();
  }
  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  async function onSubmit() {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }
      toast.success("Profile details updated");
    } catch (error) {
      toast.error("Could not update the profile details");
    }
  };
/*  
    useEffect(() => {
    async function fetchUserProperties() {      
      const propertyRef = collection(db, "properties");
      const q = query(
        propertyRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let properties = [];
      querySnap.forEach((doc) => {
        return properties.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setProperties(properties);
      setLoading(false);
    }
    fetchUserProperties();
  }, [auth.currentUser.uid]);

  async function onDelete(propertyID) {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "properties", propertyID));
      const updatedProperties = properties.filter(
        (property) => property.id !== propertyID
      );
      setProperties(updatedProperties);
      toast.success("Successfully deleted the property");
    }
  }

  //function onEdit(propertyID) {
    //router.push(`/useraccount/properties/update/${propertiesID}`);
  //}

    // Fetch properties only when user is ready
    useEffect(() => {
      async function fetchUserProperties() {
        if (auth.currentUser) {
          const propertyRef = collection(db, "properties");
          const q = query(
            propertyRef,
            where("userRef", "==", auth.currentUser.uid),
            orderBy("timestamp", "desc")
          );
          const querySnap = await getDocs(q);
          let properties = [];
          querySnap.forEach((doc) => {
            properties.push({
              id: doc.id,
              data: doc.data(),
            });
          });
          setProperties(properties);
          console.log("Property List",properties); 
          setLoading(false);
        }
      }
  
      if (!userLoading) {
        fetchUserProperties();
      }
    }, [auth.currentUser, userLoading]);
  
    async function onDelete(propertyID) {
      if (window.confirm("Are you sure you want to delete?")) {
        await deleteDoc(doc(db, "properties", propertyID));
        const updatedProperties = properties.filter(
          (property) => property.id !== propertyID
        );
        setProperties(updatedProperties);
        toast.success("Successfully deleted the property");
      }
    }
  
    function onEdit(propertyID) {
      //router.push(`/useraccount/properties/update/${propertyID}`);
    }
  
    if (userLoading) {
      return <div>Loading...</div>; // Optional: Replace with a better loading spinner
    }

  return (
    <>
    <PrivateRoute>
    <section className='mt-60 max-w-6xl mx-auto flex justify-center items-center flex-col'>
      <h1 className='text-3xl text-center uppercase mt-6 font-bold'>{name ||'User'}</h1>
      <div className="w-full md:w-[50%] mt-6 px-3">
        <form>
          <input
            type="text"
            id="name"
            value={name}
            disabled={!changeDetail}
            onChange={onChange}
            className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${
              changeDetail && "bg-red-200 focus:bg-red-200"
            }`}
          />
          <input
            type="email"
            id="email"
            value={email}
            disabled
            className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"
          />
          <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg font-medium mb-6'>
            <p className='flex items-center'>
              Change name
              <span 
                onClick={() => {
                  changeDetail && onSubmit();
                  setChangeDetail((prevState) => !prevState);
                }}
                className='text-red-700 hover:text-red-800 transition ease-in-out duration-200 ml-1 cursor-pointer'
              >
                {changeDetail ? "Apply change" : "Edit"}
              </span>
            </p>
            <p
              onClick={onLogout} 
              className='text-red-700 hover:text-red-800 transition duration-200 ease-in-out cursor-pointer'
            >
              Log out
            </p>
          </div>  
        </form>
        <button
            type="submit"
            className="w-full bg-orange-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-orange-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-orange-800"
          >
            <Link
              href="/properties/add"
              className="flex justify-center items-center"
            >
              <FcHome className="mr-2 text-3xl bg-white rounded-full p-1 border-2" />
              Sell or rent your home
            </Link>
          </button>        
      </div>
    </section>
    <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!loading && properties.length > 0 && (
          <>
            <h2 className="text-2xl text-center font-semibold mb-6">
              My Listings
            </h2>
            <ul className="sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {properties.map((property) => (
                <PropertyListItem
                  key={property.id}
                  id={property.id}
                  property={property.data}
                  onDelete={() => onDelete(property.id)}
                  onEdit={() => onEdit(property.id)}
                />
              ))}
            </ul>
          </>
        )}
    </div>
    </PrivateRoute>
    </>            
  );
};*/