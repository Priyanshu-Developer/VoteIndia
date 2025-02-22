'use client';

import Image from 'next/image';
import Link from 'next/link';

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, type, value, onChange, placeholder }) => (
  <div>
    <label className="block text-[#000080] font-medium">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full p-2 border-2 border-[#000080] rounded-md focus:outline-none focus:border-[#FF9933]"
      placeholder={placeholder}
      required
    />
  </div>
);

interface LoginPageProps {
    header: string;
    input: string;
    placeholder: string;
    inputfield: string;
    password: string;
    setPassword: (value: string) => void;
    setinputfield: (value: string) => void;
    handlesubmit: (e: any) => void;
}

export default function LoginPage(props: LoginPageProps) {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-b from-[#FF9933] via-white to-[#138808] px-4 sm:px-6">
      <div className="absolute inset-0 bg-stripes" />
      <div className="relative z-10 bg-white bg-opacity-95 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md text-center border-white border-2">
        <div>
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 mx-auto">
            <Image src="/ashoka-chakra.png" alt="Ashoka Chakra" width={60} height={60} className="w-full h-full" />
          </div>
          <h1 className="text-lg sm:text-xl font-semibold text-[#000080] mb-4">{props.header}</h1>
          <form onSubmit={props.handlesubmit} className="space-y-4 text-left">
            <InputField label={props.input} type='text' value={props.inputfield} onChange={(e) => props.setinputfield(e.target.value)} placeholder={props.placeholder} />
            <InputField label='Password' type='password' value={props.password} onChange={(e) => props.setPassword(e.target.value)} placeholder='••••••••' />
            <button type="submit" className="w-full py-2 bg-[#000080] text-white rounded-md hover:bg-[#FF9933] transition-transform transform hover:-translate-y-1">
              Login
            </button>
            <div className="flex justify-between text-sm text-[#000080] mt-2">
              <Link href="#" className="hover:text-[#138808]">Forgot Password?</Link>
            </div>
          </form>
        </div>
      </div>
      <footer className="absolute bottom-4 text-[#000080] text-xs sm:text-sm">Made with 🇮🇳 in India</footer>
    </div>
  );
}
