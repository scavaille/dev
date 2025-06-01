import React, { useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { useCameraStream } from '@/hooks/useCameraStream';
import { useGeolocation } from '@/hooks/useGeolocation';
import { CameraInterface } from '@/components/CameraInterface';
import { CameraPreview } from '@/components/CameraPreview';

interface CameraCaptureProps {
  onPhotoCapture: (imageData: string, location?: { lat: number; lng: number }) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onPhotoCapture }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { videoRef, isStreaming, hasPermission, startCamera, stopCamera } = useCameraStream();
  const { getCurrentLocation } = useGeolocation();

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.9);

    try {
      const location = await getCurrentLocation();
      onPhotoCapture(imageData, location);
      toast.success('Photo captured with location!');
    } catch (error) {
      onPhotoCapture(imageData);
      toast.warning('Photo captured but location unavailable');
    }

    stopCamera();
  }, [onPhotoCapture, stopCamera, getCurrentLocation]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      
      try {
        const location = await getCurrentLocation();
        onPhotoCapture(imageData, location);
        toast.success('Photo uploaded with location!');
      } catch (error) {
        onPhotoCapture(imageData);
        toast.warning('Photo uploaded but location unavailable');
      }
    };
    reader.readAsDataURL(file);
  }, [onPhotoCapture, getCurrentLocation]);

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {!isStreaming ? (
          <CameraInterface 
            onStartCamera={startCamera}
            onFileUpload={handleFileUploadClick}
            hasCameraPermission={hasPermission}
          />
        ) : (
          <CameraPreview
            videoRef={videoRef}
            onCapture={capturePhoto}
            onCancel={stopCamera}
          />
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};