
import React, { useRef, useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { LocationZone } from './LocationZones';

interface PhotoFilterProps {
  imageData: string;
  zone: LocationZone | null;
  onReset: () => void;
}

export const PhotoFilter: React.FC<PhotoFilterProps> = ({ imageData, zone, onReset }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [filteredImageData, setFilteredImageData] = useState<string>('');

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      if (zone) {
        // Apply filter overlay
        applyLocationFilter(ctx, canvas.width, canvas.height, zone);
      }

      // Save filtered image data
      setFilteredImageData(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.src = imageData;
  }, [imageData, zone]);

  const applyLocationFilter = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    zone: LocationZone
  ) => {
    // Apply a colored overlay based on the zone
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    
    switch (zone.id) {
      case 'central-park':
        gradient.addColorStop(0, 'rgba(34, 197, 94, 0.15)'); // Green overlay
        gradient.addColorStop(1, 'rgba(22, 163, 74, 0.1)');
        break;
      case 'golden-gate':
        gradient.addColorStop(0, 'rgba(249, 115, 22, 0.15)'); // Orange overlay
        gradient.addColorStop(1, 'rgba(234, 88, 12, 0.1)');
        break;
      case 'times-square':
        gradient.addColorStop(0, 'rgba(147, 51, 234, 0.15)'); // Purple overlay
        gradient.addColorStop(1, 'rgba(126, 34, 206, 0.1)');
        break;
      default:
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.15)'); // Default blue overlay
        gradient.addColorStop(1, 'rgba(79, 70, 229, 0.1)');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add location text overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(zone.name, width / 2, height - 40);

    // Add description text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '16px Arial';
    ctx.fillText(zone.description, width / 2, height - 15);
  };

  const downloadImage = () => {
    if (!filteredImageData) return;

    const link = document.createElement('a');
    link.download = `geofilter-${zone?.name.replace(/\s+/g, '-').toLowerCase() || 'photo'}-${Date.now()}.jpg`;
    link.href = filteredImageData;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Photo downloaded to your device!');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-auto max-h-96 object-contain"
          />
          
          {zone && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              ✨ Filter Applied
            </div>
          )}
        </div>

        <div className="p-6">
          {zone ? (
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Photo Filtered!
              </h3>
              <p className="text-gray-600 text-sm">
                Commemorating your visit to {zone.name}
              </p>
            </div>
          ) : (
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Photo Captured
              </h3>
              <p className="text-gray-600 text-sm">
                No special location detected, but still a great shot!
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={downloadImage}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              size="lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Photo
            </Button>

            <Button
              onClick={onReset}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Take Another Photo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
