import Image from 'next/image';
import { useState } from 'react';
import Card from './Card';

interface FaceDetectionProps {
  title: string;
  children: React.ReactNode;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  faceStatus: string;
  color: string;
}

export default function FaceDetectionLayout({ title, children, videoRef, faceStatus, color }: FaceDetectionProps) {
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  return (
    <Card>
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 mx-auto">
            <Image src="/ashoka-chakra.png" alt="Ashoka Chakra" width={60} height={60} className="w-full h-full" />
          </div>
          <h1 className="text-lg sm:text-xl font-semibold text-[#000080] mb-4">{title}</h1>

          {/* ✅ Render video if videoRef is passed */}
          {videoRef && (
            <div className="flex flex-col items-center w-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="rounded-lg shadow-md w-full max-h-60 sm:max-h-72"
              />
              <div className="mt-4">
                <span className={`font-bold ${color}`}>{faceStatus}</span>
              </div>
            </div>
          )}

          {children}
              </Card>
        
  );
}
