
import { useRef, useState, useCallback } from 'react';
import { toast } from 'sonner';

export const useCameraStream = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const startCamera = useCallback(async () => {
    try {
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      
      console.log('Camera access granted, setting up video stream...');
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for metadata to load, then play
        videoRef.current.onloadedmetadata = async () => {
          console.log('Video metadata loaded, attempting to play...');
          try {
            if (videoRef.current) {
              await videoRef.current.play();
              console.log('Video is now playing');
              setIsStreaming(true);
              setHasPermission(true);
              toast.success('Camera ready!');
            }
          } catch (playError) {
            console.error('Video play error:', playError);
            toast.error('Failed to start camera preview');
          }
        };
        
        // Fallback: try to play immediately if metadata is already loaded
        if (videoRef.current.readyState >= 1) {
          console.log('Video metadata already available, playing immediately...');
          try {
            await videoRef.current.play();
            console.log('Video is now playing (immediate)');
            setIsStreaming(true);
            setHasPermission(true);
            toast.success('Camera ready!');
          } catch (playError) {
            console.error('Immediate video play error:', playError);
          }
        }
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setHasPermission(false);
      toast.error('Camera access denied. Please enable camera permissions.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  }, []);

  return {
    videoRef,
    isStreaming,
    hasPermission,
    startCamera,
    stopCamera
  };
};
