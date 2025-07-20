// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CloudUpload, Play, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function VideoUpload() {
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('title', 'ReConcrete FAQ Video');
      formData.append('description', '10-minute FAQ video about ReConcrete');

      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setUploadedVideo(data.s3Url);
      queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
      toast({
        title: "Upload successful",
        description: "Your video has been uploaded successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload video",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid video file (MP4, MOV, or AVI)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size must be less than 100MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    uploadMutation.mutate(file);
  };

  const handleReplaceVideo = () => {
    setUploadedVideo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-neutral-dark mb-4">
          Learn About ReConcrete
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Watch our comprehensive FAQ video to understand how we're revolutionizing 
          sustainable construction practices through innovative recycling solutions.
        </p>
      </div>
      
      <Card className="bg-white shadow-lg">
        <CardContent className="p-8">
          {!uploadedVideo ? (
            <div className="video-upload-area">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-accent transition-colors duration-300">
                <div className="mb-6">
                  <CloudUpload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-neutral-dark mb-2">Upload FAQ Video</h3>
                  <p className="text-gray-600 mb-4">Drag and drop your video file here, or click to browse</p>
                  <p className="text-sm text-gray-500">Supported formats: MP4, MOV, AVI (Max 100MB)</p>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".mp4,.mov,.avi"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isUploading ? (
                    <>
                      <div className="spinner h-4 w-4 mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <CloudUpload className="h-4 w-4 mr-2" />
                      Choose Video File
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="bg-black rounded-xl overflow-hidden mb-4">
                <video 
                  controls 
                  className="w-full h-auto max-h-96"
                  src={uploadedVideo}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-neutral-dark">ReConcrete FAQ Video</h4>
                  <p className="text-sm text-gray-600">Duration: 10 minutes</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReplaceVideo}
                  className="text-accent hover:text-primary"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Replace Video
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
