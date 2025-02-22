"use client";

import LoginPage from "@/components/LoginForm";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function Login() {
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter(); // ✅ Add router for navigation

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("id", id);
    formData.append("password", password);
    
    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        body: formData,
        credentials: "include",  // ✅ Required for cookies to be stored
      });

      console.log(response.headers);  // ✅ Debug: Check if `Set-Cookie` exists

      if (!response.ok) {
        console.error(`HTTP Error: ${response.status}`);
        return;
      }

      const data = await response.json();
      console.log("Response Message:", data.message);

      if (response.status === 200) {
        router.push("/face-auth");
      }
    } catch (error) {
      console.error("Error:", error);
    }
};

  return (
    
      <LoginPage
        header="ADMIN LOGIN"
        input="Id"
        placeholder="Enter your ID"
        inputfield={id}
        setinputfield={setId}
        password={password}
        setPassword={setPassword}
        handlesubmit={handleSubmit}
      />

  );
}
