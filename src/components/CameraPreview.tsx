import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface CameraPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  onCapture: () => void;
  onCancel: () => void;
  debugInfo?: {
    readyState: number;
    videoWidth: number;
    videoHeight: number;
    trackCount: number;
  };
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({ 
  videoRef, 
  onCapture, 
  onCancel,
  debugInfo
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (videoRef.current) {
        setDimensions({
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight
        });
      }
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadedmetadata', updateDimensions);
      video.addEventListener('resize', updateDimensions);
    }

    return () => {
      if (video) {
        video.removeEventListener('loadedmetadata', updateDimensions);
        video.removeEventListener('resize', updateDimensions);
      }
    };
  }, [videoRef]);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-80 object-cover bg-gray-900"
      />
      
      {/* Debug Overlay */}
      <div className="absolute top-0 left-0 bg-black/50 text-white text-xs p-2 font-mono">
        <div>Ready State: {debugInfo?.readyState}</div>
        <div>Video Tracks: {debugInfo?.trackCount}</div>
        <div>Width: {dimensions.width || debugInfo?.videoWidth}</div>
        <div>Height: {dimensions.height || debugInfo?.videoHeight}</div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <Button
          onClick={onCapture}
          size="lg"
          className="bg-white text-gray-800 hover:bg-gray-100 rounded-full w-16 h-16 p-0"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
        </Button>
      </div>
      
      <Button
        onClick={onCancel}
        variant="outline"
        size="sm"
        className="absolute top-4 right-4 bg-white"
      >
        Cancel
      </Button>
    </div>
  );
};