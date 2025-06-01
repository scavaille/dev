import React from 'react';
import { Camera, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraInterfaceProps {
  onStartCamera: () => void;
  onFileUpload: () => void;
  hasCameraPermission: boolean | null;
}

export const CameraInterface: React.FC<CameraInterfaceProps> = ({ 
  onStartCamera, 
  onFileUpload,
  hasCameraPermission
}) => {
  return (
    <div className="p-8 text-center">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
        <Camera className="w-10 h-10 text-purple-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Take or Upload Photo
      </h3>
      
      {hasCameraPermission === false ? (
        <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Camera Access Denied</span>
          </div>
          <p className="text-sm text-red-600">
            Please enable camera access in your browser settings to use this feature.
          </p>
        </div>
      ) : (
        <p className="text-gray-600 mb-6">
          We'll use your device location to apply location-based filters
        </p>
      )}

      <div className="space-y-3">
        <Button 
          onClick={onStartCamera}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          size="lg"
          disabled={hasCameraPermission === false}
        >
          <Camera className="w-5 h-5 mr-2" />
          Take Photo
        </Button>

        <Button 
          onClick={onFileUpload}
          variant="outline"
          className="w-full"
          size="lg"
        >
          <ImageIcon className="w-5 h-5 mr-2" />
          Choose from Gallery
        </Button>
      </div>

      <p className="text-xs text-gray-500 mt-4 flex items-center justify-center">
        <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
        Location permission required for filters
      </p>
      <p className="text-xs text-gray-400 mt-2">
        Or drag and drop an image here
      </p>
    </div>
  );
};