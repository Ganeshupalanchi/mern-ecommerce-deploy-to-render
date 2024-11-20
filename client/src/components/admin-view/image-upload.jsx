import { Label } from "@radix-ui/react-label";
import React, { useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { FilesIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

export default function ProductImageUpload({
  file,
  setFile,
  uploadedImageUrl,
  setUploadedImageUrl,
  imageLoadingState,
  setImageLoadingState,
  isEditMode,
  editIdImage,
  isCustomStyling = false,
}) {
  // console.log();

  const inputRef = useRef(null);

  const handleImageFileChange = (e) => {
    // console.log(e.target.files[0]);
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleDrageOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const doppedFile = e.dataTransfer.files?.[0];
    console.log(doppedFile);
    if (doppedFile) setFile(doppedFile);
  };

  const handleRemoveImage = () => {
    setFile(null);
    inputRef.current.value = "";
    setUploadedImageUrl("");
  };

  const uploadImageToCloudinary = async () => {
    setImageLoadingState(true);
    const data = new FormData();
    data.append("my_file", file);
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/admin/products/upload-image`,
      data,
    );
    if (response) {
      setImageLoadingState(false);
      setUploadedImageUrl(response.data.result.url);
    }
  };
  useEffect(() => {
    if (file) uploadImageToCloudinary();
  }, [file]);

  return (
    <div className={`mt-2 w-full ${isCustomStyling ? "" : "mx-auto max-w-md"}`}>
      <Label className="mb-2 block text-lg font-semibold">
        {isEditMode ? "Current Image" : "Upload Image"}
      </Label>
      {isEditMode ? (
        <div className="flex h-32 flex-col items-center justify-center">
          {/* <UploadCloudIcon className="mb-2 h-10 w-10 text-muted-foreground" /> */}
          <img
            src={editIdImage}
            alt="Image not Found."
            className="h-full w-full rounded-t-lg object-contain"
          />
        </div>
      ) : (
        <div
          className="rounded-lg border-2 border-dashed p-4"
          onDragOver={handleDrageOver}
          onDrop={handleDrop}
        >
          <Input
            id="image-upload"
            type="file"
            className="hidden"
            ref={inputRef}
            onChange={handleImageFileChange}
            disabled={isEditMode}
          />
          {!file ? (
            <>
              <Label
                htmlFor="image-upload"
                className="flex h-32 cursor-pointer flex-col items-center justify-center"
              >
                <UploadCloudIcon className="mb-2 h-10 w-10 text-muted-foreground" />
                <span>Drag & drop or click to upload image</span>
              </Label>
            </>
          ) : imageLoadingState ? (
            <>
              <Skeleton className="h-10 bg-gray-100" />
            </>
          ) : (
            <div className="flex items-center justify-between">
              <FilesIcon className="mr-2 h-8 w-8 text-primary" />
              <span className="text-sm font-medium">{file.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={handleRemoveImage}
              >
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Remove File</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
