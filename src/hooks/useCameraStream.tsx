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

        // Add onloadeddata event listener
        videoRef.current.onloadeddata = () => {
          console.log('onloadeddata event fired - first frame is loaded');
          if (videoRef.current) {
            console.log('Video dimensions after data load:', {
              width: videoRef.current.videoWidth,
              height: videoRef.current.videoHeight
            });
          }
        };
        
        console.log('Attaching onloadedmetadata event listener...');
        videoRef.current.onloadedmetadata = async () => {
          console.log('onloadedmetadata event fired!');
          if (!videoRef.current) return;
          
          const dimensions = {
            readyState: videoRef.current.readyState,
            videoWidth: videoRef.current.videoWidth,
            videoHeight: videoRef.current.videoHeight
          };
          
          console.log('Video metadata loaded:', dimensions);
          
          setDebugInfo({
            ...dimensions,
            trackCount: videoTracks.length
          });

          console.log('Attempting to play video after metadata...');
          try {
            await videoRef.current.play();
            console.log('Video playback started successfully after metadata');
            setIsStreaming(true);
            setHasPermission(true);
            toast.success('Camera ready!');
          } catch (playError) {
            console.error('Video play error after metadata:', {
              name: playError.name,
              message: playError.message,
              stack: playError.stack
            });
            toast.error('Failed to start camera preview');
          }
        };
        
        console.log('Current video element state:', {
          readyState: videoRef.current.readyState,
          videoWidth: videoRef.current.videoWidth,
          videoHeight: videoRef.current.videoHeight,
          style: videoRef.current.style,
          display: window.getComputedStyle(videoRef.current).display
        });

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