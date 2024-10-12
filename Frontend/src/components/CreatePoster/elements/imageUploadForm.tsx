import toastFunction from "@/components/reactToast/toast";
import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";

interface ImageUploaderProps {
  onImageUpload: (url: string | null) => void;
}

const ImageUploaderForm: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [editImg, setEditImg] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleEditImage = () => {
    setEditImg(true);
    onImageUpload(null);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toastFunction("info", "Image uploading...");
    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`http://localhost:4000/poster/upload`, {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        toastFunction("success", "Image Uploaded Successfully.");
        onImageUpload(data.secure_url);
        setEditImg(true);
      } else {
        toastFunction("warning", "Image upload failed!. Try again");
        console.error("Failed To Fetch Image", data.errors);
      }
    } catch (error) {
      toastFunction("error", "Failed to upload image. Please try again.");
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {!editImg ? (
        <div className="flex justify-center">
          <input
            type="file"
            id="file-upload"
            onChange={handleImageChange}
            className="w-full hidden"
          />
          <label
            htmlFor="file-upload"
            className="bg-orange-400 cursor-pointer text-center hover:bg-orange-600 transition-all duration-500 font-bold text-lg text-white p-2 rounded-lg"
          >
            {isUploading ? "Uploading..." : "Choose file"}
          </label>
        </div>
      ) : (
        <>
          <div className="text-center text-xl transition-all font-semibold text-green-500">
            Image Uploaded Successfully
          </div>
          <div className="flex justify-center">
            <p className="pt-[4px] items-center text-red-500 font-medium text-lg">
              Edit Image
            </p>
            <button
              onClick={handleEditImage}
              className="ml-3 hover:text-orange-600"
            >
              <FaRegEdit size={28} />
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default ImageUploaderForm;
