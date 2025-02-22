import Loading from '@/components/icon/Loading';
import RightArrow from '@/components/icon/RightArrow';
import React from 'react';

interface ButtonProps {
  isModelLoaded: boolean;
  isdisabled:String;
  onclick: (e:React.MouseEvent<HTMLButtonElement>) => void;
}
const Button: React.FC<ButtonProps> = ({ isModelLoaded, isdisabled,onclick }) => {
  return (
    <button
      type="submit"
      disabled={!isModelLoaded || !isdisabled?.includes('green')}
      onClick={onclick}
      className={`w-full py-2 text-white rounded-md transition-transform transform flex items-center justify-center gap-2 ${
        isModelLoaded && isdisabled.includes('green')
          ? 'bg-[#000080] hover:bg-[#FF9933] hover:-translate-y-1'
          : 'bg-gray-400 cursor-not-allowed'
      }`}
    >
      {isModelLoaded ? (
        <>
          Continue
          <RightArrow />
        </>
      ) : (
        <>
          <Loading />
          Loading...
        </>
      )}
    </button>
  );
};
export default Button;