
import React from 'react';
import { Button } from '@/components/ui/button';

interface CameraPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  onCapture: () => void;
  onCancel: () => void;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({ 
  videoRef, 
  onCapture, 
  onCancel 
}) => {
  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-80 object-cover"
      />
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
