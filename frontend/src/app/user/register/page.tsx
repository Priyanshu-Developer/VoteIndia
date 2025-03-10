"use client";

import { useState, useEffect, ChangeEvent, use } from "react";
import Image from "next/image";
import { KeyIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled?: boolean;
  disablebutton?:boolean;
  onGenerate?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, type, value, onChange, placeholder, disabled, onGenerate,disablebutton }) => (
  <div className="relative">
    <label className="block text-[#000080] font-medium mb-1">{label}</label>
    <div className="relative group">
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full p-2 pr-12 border-2 rounded-md focus:outline-none transition-all duration-300 ${
          disablebutton
            ? "border-gray-400 bg-gray-200 cursor-not-allowed" 
            : "border-[#000080] group-hover:border-[#FF9933]"
        }`}
        placeholder={placeholder}
        maxLength={type === "number" ? 12 : 100}
        required
        disabled={disabled}
      />
      {onGenerate && (
        <button
        type="button"
        onClick={!disablebutton ? onGenerate : undefined}
        disabled={disablebutton}
        className={`absolute inset-y-0 right-0 px-3 border-2 rounded-e-md bg-white flex items-center justify-center transition-all duration-300 ${
          disablebutton 
            ? "border-gray-400 text-gray-400 cursor-not-allowed" 
            : "border-[#000080] group-hover:border-[#FF9933]"
        }`}
      >
        <KeyIcon className={`h-5 w-5 ${disablebutton ? "text-gray-400" : "text-black group-hover:text-[#FF9933]"}`} />
      </button>
      )}
    </div>
  </div>
);

export default function RegisterUser() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email,setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isdisable,setIsDisable] = useState(true);
  const router = useRouter();

  const fetchUserDetails = async (userId: string) => {
    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/check-id/?id=${userId}`);
      if (resp.ok){
        setError("User Already Exist")
      }
      else{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/adhar/?id=${userId}`);
        if (!response.ok) throw new Error("User not found");
        const data = await response.json();
        console.log(data.name)
        setName(data.name);
        setEmail(data.email);
        setIsDisable(false);
        setError("");
      }
      
    } catch (err) {
      setError("Invalid ID - User not found");
      setName("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ClipboardEvent<HTMLInputElement>) => {
    let value : string = ""
    if ("clipboardData" in e) {
      
      e.preventDefault(); 
      value = e.clipboardData.getData("text");
  } else {
      value = e.target.value
  }
    const processedValue = value.slice(0, 12);
    setId(processedValue);
    if (value.length === 12) fetchUserDetails(value);
    else{
      setIsDisable(true);
    }
  };

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    setPassword(Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join(""));
  };

  const generateWalletAddress = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate-wallet`);
      if (!response.ok) {
        setError("Unable to generate wallet address");
      } else {
        const data = await response.json();
        setWalletAddress(data.address);
        setError("");
      }
    } catch (err) {
      setError("Invalid ID - User not found");
      setWalletAddress("");
    }
  };

  const onContinue = () => {
    const data = { id:id, name:name, password:password, address:walletAddress,email:email };
    sessionStorage.setItem("user", JSON.stringify(data));
    router.push("/user/face-registration");
  };

  const saveCredentials = () => {
    const data = { password, walletAddress };
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "credentials.json";
    a.click();
    setIsSaved(true);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen  p-4">
      <div className="relative z-10 bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-2xl text-center border-white border-2">
        <div>
          <div className="relative w-16 h-16 mx-auto">
            <Image src="/ashoka-chakra.png" alt="Ashoka Chakra" width={60} height={60} />
          </div>
          <h1 className="text-xl font-semibold text-[#000080] mt-4">User Registration</h1>
          {error && <div className="text-red-500 mt-2">{error}</div>}

          <form className="mt-6 space-y-4 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="ID" type="number" value={id} onChange={handleInputChange} placeholder="Enter your unique ID" />
              <InputField label="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" disabled />
              <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Generate strong password" onGenerate={generateRandomPassword} disabled={isdisable} disablebutton={isdisable} />
              <InputField label="Wallet Address" type="text" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} placeholder="Generate wallet address" onGenerate={generateWalletAddress} disabled  disablebutton={isdisable}/>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-4 mt-6">
              <button
                type="button"
                onClick={saveCredentials}
                className="w-full md:w-1/2 py-2 bg-[#138808] text-white rounded-md hover:bg-[#0d5e07] disabled:bg-gray-400"
                disabled={!password || !walletAddress}
              >
                Save Credentials
              </button>
              <button
                type="button"
                onClick={onContinue}
                className="w-full md:w-1/2 py-2 bg-[#000080] text-white rounded-md hover:bg-[#FF9933] disabled:bg-gray-400"
                disabled={!isSaved}
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
      <footer className="absolute bottom-4 text-[#000080] text-sm">Made with 🇮🇳 in India</footer>
    </div>
  );
}
