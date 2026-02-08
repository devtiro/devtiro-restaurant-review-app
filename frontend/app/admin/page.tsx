"use client";

import React, { useState, useEffect } from "react";
import { Upload, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/providers/app-context-provider";
import { useAuth } from "react-oidc-context";

export default function ImageUploadTestPage() {
  const { apiService } = useAppContext();
  const {
    isAuthenticated,
    signinRedirect,
    isLoading: isAuthLoading,
  } = useAuth();

  const [selectedFile, setSelectedFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filename, setFilename] = useState("");
  const [retrievedImage, setRetrievedImage] = useState(null);
  const [retrieveError, setRetrieveError] = useState(null);

  useEffect(() => {
    const doUseEffect = async () => {
      // Add a check for loading state
      if (!isAuthenticated && !isAuthLoading) {
        await signinRedirect();
      }
    };
    doUseEffect();
  }, [isAuthenticated, isAuthLoading, signinRedirect]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setResponse(null);
    setError(null);
  };

  const handleUpload = async () => {
    console.log("Upload button clicked");

    if (!selectedFile || !apiService) {
      console.log("No file selected or no apiService:", {
        selectedFile,
        apiService,
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Attempting upload with file:", selectedFile);
      const startTime = performance.now();
      const photo = await apiService.uploadPhoto(selectedFile);
      const endTime = performance.now();

      console.log("Upload successful:", photo);

      setResponse({
        status: 200,
        timing: `${(endTime - startTime).toFixed(2)}ms`,
        data: photo,
      });
    } catch (err) {
      console.error("Upload failed:", err);
      setError({
        status: err.status || 500,
        message: err.message || "Unknown error occurred",
        details: err.details || {},
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetrievePhoto = async () => {
    if (!filename.trim()) return;

    setRetrievedImage(null);
    setRetrieveError(null);

    try {
      const response = await fetch(`/api/photos/${filename}`);

      if (!response.ok) {
        throw new Error(`Failed to retrieve photo: ${response.statusText}`);
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setRetrievedImage(imageUrl);
    } catch (err) {
      setRetrieveError(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Image Upload Test Interface</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Section */}
          <div className="border-2 border-dashed rounded-lg p-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <Upload className="w-12 h-12 text-gray-400" />
              <label className="cursor-pointer">
                <span className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                  Select Image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              {selectedFile && (
                <div className="text-sm text-gray-600">
                  Selected: {selectedFile.name} (
                  {(selectedFile.size / 1024).toFixed(2)} KB)
                </div>
              )}
            </div>
          </div>

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isLoading}
            className="w-full"
          >
            {isLoading ? "Uploading..." : "Upload Image"}
          </Button>

          {/* Response Display */}
          {(response || error) && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Response Details</h3>
              <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                <pre className="whitespace-pre-wrap overflow-x-auto">
                  {JSON.stringify(error || response, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Photo Retrieval Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Retrieve Photo</h3>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter filename (e.g., some-photo.png)"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleRetrievePhoto}
                disabled={!filename.trim()}
                className="flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Retrieve
              </Button>
            </div>

            {retrieveError && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
                {retrieveError}
              </div>
            )}

            {retrievedImage && (
              <div className="mt-4">
                <img
                  src={retrievedImage}
                  alt="Retrieved photo"
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
