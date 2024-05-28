import React, { useState } from "react";
import toastFunction from "../reactToast/toast";

interface ImageGeneratorProps {
  setImage: React.Dispatch<React.SetStateAction<string | undefined>>;
  setEditImg: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({
  setImage,
  setEditImg,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: any = e.target.files?.[0];
    if (!file) return;

    toastFunction("info", "Image uploading...");
    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`http://localhost:4000/cart/upload`, {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toastFunction("success", "Image Uploaded Successfully.");
        setImage(data.secure_url);
        setEditImg(true);
      } else {
        toastFunction("warning", "Image upload failed!. Try again");
        console.error("Failed To Fetch Image", data.errors);
      }
    } catch (error: any) {
      toastFunction("error", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        id="file-upload"
        onChange={handleImageUpload}
        className="w-full hidden"
      />
      <label
        htmlFor="file-upload"
        className={`bg-orange-400 cursor-pointer text-center hover:bg-orange-600 transition-all duration-500 font-bold text-lg text-white p-2 mt-4 rounded-lg ${
          isUploading ? "cursor-not-allowed" : ""
        }`}
      >
        {isUploading ? "Uploading..." : "Choose file"}
      </label>
    </>
  );
};

export default ImageGenerator;
