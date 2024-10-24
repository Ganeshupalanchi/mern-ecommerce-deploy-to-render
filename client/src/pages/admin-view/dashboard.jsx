import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  addFeatureImage,
  deleteFeatureImage,
  getFeatureImage,
} from "@/store/common-slice";
import { LogOut } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const handleUploadFeatureImage = () => {
    if (!uploadedImageUrl) {
      toast({
        title: "Select an image first.",
        variant: "destructive",
      });
      return;
    }
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data.payload.success) {
        toast({
          title: "Feature image is added.",
        });
        dispatch(getFeatureImage());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  };
  const handleDeleteFeatureImage = (featureId) => {
    dispatch(deleteFeatureImage(featureId)).then((data) => {
      if (data.payload.success) {
        toast({
          title: "Feature image deleted.",
          variant: "destructive",
        });
        dispatch(getFeatureImage());
      }
    });
  };

  useEffect(() => {
    dispatch(getFeatureImage());
  }, [dispatch]);
  return (
    <div>
      <h1>Upload Feature Image</h1>
      <ProductImageUpload
        file={imageFile}
        setFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
        // isEditMode={currentEditedId !== null}
        // editIdImage={formData?.image || null}
      />
      <Button
        className="mt-5 w-full"
        disabled={uploadedImageUrl === ""}
        onClick={handleUploadFeatureImage}
      >
        Submit
      </Button>

      <div className="mt-5 flex flex-col gap-7">
        {featureImageList.length > 0 &&
          featureImageList.map((featureImage, i) => (
            <div className="group relative" key={i}>
              <img
                src={featureImage.image}
                className="h-[400px] w-full rounded-t-lg object-cover"
              />
              <Button
                className="absolute right-2 top-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
                onClick={() => handleDeleteFeatureImage(featureImage?._id)}
                variant="outline"
              >
                Delete
              </Button>
            </div>
          ))}
      </div>
    </div>
  );
}
