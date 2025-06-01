import { useRef, useState, useCallback } from 'react';
import { toast } from 'sonner';

export const useCameraStream = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [debugInfo, setDebugInfo] = useState({
    readyState: 0,
    videoWidth: 0,
    videoHeight: 0,
    trackCount: 0
  });

  const startCamera = useCallback(async () => {
    try {
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      
      const videoTracks = stream.getVideoTracks();
      console.log('Video tracks:', videoTracks.length, videoTracks[0]?.label);
      setDebugInfo(prev => ({ ...prev, trackCount: videoTracks.length }));
      
      if (videoRef.current) {
        console.log('Setting video srcObject with stream...');
        videoRef.current.srcObject = stream;
        
        console.log('Attaching onloadedmetadata event listener...');
        videoRef.current.onloadedmetadata = async () => {
          console.log('onloadedmetadata event fired!');
          if (!videoRef.current) return;
          
          console.log('Video metadata loaded:', {
            readyState: videoRef.current.readyState,
            videoWidth: videoRef.current.videoWidth,
            videoHeight: videoRef.current.videoHeight
          });
          
          setDebugInfo({
            readyState: videoRef.current.readyState,
            videoWidth: videoRef.current.videoWidth,
            videoHeight: videoRef.current.videoHeight,
            trackCount: videoTracks.length
          });

          console.log('Attempting to play video...');
          try {
            await videoRef.current.play();
            console.log('Video playback started successfully');
            setIsStreaming(true);
            setHasPermission(true);
            toast.success('Camera ready!');
          } catch (playError) {
            console.error('Video play error:', {
              name: playError.name,
              message: playError.message,
              stack: playError.stack
            });
            toast.error('Failed to start camera preview');
          }
        };
        
        console.log('Checking immediate readyState:', videoRef.current.readyState);
        if (videoRef.current.readyState >= 1) {
          console.log('Video already has metadata, attempting immediate playback');
          try {
            await videoRef.current.play();
            console.log('Immediate playback successful');
            setIsStreaming(true);
            setHasPermission(true);
            toast.success('Camera ready!');
          } catch (playError) {
            console.error('Immediate playback error:', {
              name: playError.name,
              message: playError.message,
              stack: playError.stack
            });
          }
        } else {
          console.log('Waiting for metadata to load...');
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
      setDebugInfo({
        readyState: 0,
        videoWidth: 0,
        videoHeight: 0,
        trackCount: 0
      });
    }
  }, []);

  return {
    videoRef,
    isStreaming,
    hasPermission,
    debugInfo,
    startCamera,
    stopCamera
  };
};