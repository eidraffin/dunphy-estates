import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { db } from "../../firebase/firebase";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

export default function OAuth() {
  const router = useRouter();
  async function onGoogleClick() {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      router.push("/");
    } catch (error) {
      toast.error("Something went wrong! Google authorization failed.");
    }
  };

  return (
    <button
      type="button"
      onClick={onGoogleClick}      
      className="flex items-center justify-center w-full bg-white text-black px-7 py-4 uppercase text-md font-medium hover:bg-zinc-50 shadow-md hover:shadow-lg active:shadow-lg border-2 border-orange-600 transition duration-150 ease-in-out rounded-lg"
    >
      <FcGoogle className="text-3xl rounded-full mr-2" />
      Continue with Google
    </button>
  );
};