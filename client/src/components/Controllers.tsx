import { FormEvent, useEffect, useState } from "react";
import type { ImagesResponse, WeaviateImage } from "../types";
import Gallery from "./Gallery";
import Message, { IMessage } from "./Message";

const Controllers = () => {
  const [id, setId] = useState("");
  const [images, setImages] = useState<ImagesResponse>();
  // const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputsVisibility, setInputsVisibility] = useState({
    getImageById: false,
    uploadImages: false,
  });

  useEffect(() => {
    async function fetchImages() {
      const response = await fetch("http://localhost:3001/api/images");
      const data = await response.json();
      setImages(data);
    }
    fetchImages();

    return () => {};
  }, []);

  const handleGetImageByIdVisibility = () => {
    inputsVisibility.getImageById
      ? setInputsVisibility({ getImageById: false, uploadImages: false })
      : setInputsVisibility({ getImageById: true, uploadImages: false });
  };
  const handleUploadVisibiliuty = () => {
    inputsVisibility.uploadImages
      ? setInputsVisibility({ getImageById: false, uploadImages: false })
      : setInputsVisibility({ getImageById: false, uploadImages: true });
  };

  const addMessage = (
    message: string,
    type: "success" | "warning" | "error" | "info" = "success",
    duration: number = 3000
  ) => {
    const key = new Date().getTime(); // Generate a unique key based on the current time
    setMessages((prevState) => [
      ...prevState,
      { key, message, type, duration },
    ]);
  };

  const handleGetImageByIdSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch(`http://localhost:3001/api/images/${id}`);
    const data = await response.json();
    console.log("data - ", data);
    const images = {
      images: [
        {
          _additional: {
            id: data.id,
          },
          text: data.properties.text,
          image: data.properties.image,
        },
      ],
    };
    console.log("data - ", data);
    setImages(images);
  };

  const handleUploadImages = async (event: FormEvent) => {
    event.preventDefault();

    const inputElement = document.getElementById(
      "multiple_files"
    ) as HTMLInputElement;
    const files = inputElement.files;

    if (!files || files.length === 0) {
      alert("No files selected");
      return;
    }
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const response = await fetch("http://localhost:3001/api/images", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload images");
      }


      await handleGetAllImages();
      inputElement.value = ""; // Add this line to reset the input field
      addMessage("Images uploaded successfully", "success", 2000)
    } catch (error) {
      console.error("Error uploading images:", error);
      addMessage("Error uploading images", "error", 2000)
    }
  };

  const handleGetAllImages = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/images");
      const data = await response.json();
      setImages(data);
      // addMessage("Images fetched successfully", "success", 2000)
    } catch (error) {
      console.error("Error fetching images:", error);
    }

  };

  const handleDeleteImage = async (id: string) => {
    const response = await fetch(`http://localhost:3001/api/images/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed delete image");
    }
    // console.log(`[id: ${id}] - deleted`);
    addMessage("Delleted succesfuly!", "success", 2000);
    setImages((prevImages) => {
      const images = prevImages?.images ?? [];
      const updatedImages = images.filter(
        (image) => image._additional.id !== id
      );

      return { images: updatedImages };
    });
  };

  const handleEditImage = async (updatedImage: WeaviateImage) => {
    let previousImage: WeaviateImage | undefined;

    // Update the local state optimistically
    setImages((prevImages) => {
      const images = prevImages?.images ?? [];
      const updatedImages = images.map((image) => {
        if (image._additional.id === updatedImage._additional.id) {
          previousImage = image; // Save the previous image state
          return updatedImage;
        }
        return image;
      });

      return { ...prevImages, images: updatedImages };
    });

    try {
      const response = await fetch(
        `http://localhost:3001/api/images/${updatedImage._additional.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: updatedImage.text }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update image");
      }

      const data = await response.json();
      // console.log(data);
      addMessage("Image updated successfully", "success", 2000)
    } catch (error) {
      console.error("Error updating image:", error);

      // Revert the local state to its previous state in case of an error
      if (previousImage) {
        setImages((prevImages) => {
          const images = prevImages?.images ?? [];
          const updatedImages = images
            .map((image) => {
              if (image._additional.id === previousImage!._additional.id) {
                return previousImage;
              }
              return image;
            })
            .filter((image): image is WeaviateImage => image !== undefined);

          return { ...prevImages, images: updatedImages };
        });
      }
      addMessage("Error updating image", "error", 2000)
    }
  };

  const fetchSimilarImages = async (imageId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/images/similar/${imageId}`
      );
      const data = await response.json();
      // Assuming the data contains an array of similar images
      console.log(data);
      setImages(data);
    } catch (error) {
      console.error("Error fetching similar images:", error);
    }
  };

  const toggleImageSelection = (imageId: string) => {
    const imageIndex = selectedImageIds.findIndex((id) => id === imageId);

    if (imageIndex === -1) {
      setSelectedImageIds([...selectedImageIds, imageId]);
    } else {
      setSelectedImageIds(
        selectedImageIds.filter((_, index) => index !== imageIndex)
      );
    }
    // console.log(selectedImageIds);
  };

  const handleSeeAllSelectedImages = async () => {
    const response = await fetch("http://localhost:3001/api/images");
    const allImages = await response.json();
    const selectedImages = allImages.images.filter((image: WeaviateImage) =>
      selectedImageIds.includes(image._additional.id)
    );
    console.log(selectedImages);
    setImages({ images: selectedImages });
  };

  return (
    <div>
      <div className="mb-2">
        <button
          onClick={handleGetAllImages}
          className="text-white bg-blue-600 hover:bg-blue-700 
        focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm 
        px-5 py-2.5 mr-2  dark:bg-blue-600 dark:hover:bg-blue-700 
        focus:outline-none dark:focus:ring-blue-800"
        >
          All images
        </button>
        <button
          onClick={handleGetImageByIdVisibility}
          className="text-white bg-blue-600 hover:bg-blue-700 
        focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm 
        px-5 py-2.5 mr-2  dark:bg-blue-600 dark:hover:bg-blue-700 
        focus:outline-none dark:focus:ring-blue-800"
        >
          Get image by id ↓
        </button>

        <button
          onClick={handleUploadVisibiliuty}
          className="text-white bg-blue-600 hover:bg-blue-700 
        focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm 
        px-5 py-2.5 mr-2  dark:bg-blue-600 dark:hover:bg-blue-700 
        focus:outline-none dark:focus:ring-blue-800"
        >
          Upload images ↓
        </button>
      </div>

      <div>
        {/* Get Image by id */}
        {inputsVisibility.getImageById ? (
          <div className="mb-2">
            <form
              className="flex gap-4 relative"
              onSubmit={handleGetImageByIdSubmit}
            >
              <label htmlFor="id" className="sr-only">
                Get image by id
              </label>
              <input
                type="text"
                placeholder="id"
                id="id"
                required
                className="block w-full p-3 pl-5 text-sm 
                border border-gray-300 rounded-lg 
                bg-gray-50 focus:ring-blue-500 focus:border-blue-500 
                dark:bg-gray-700 dark:border-gray-600 
                placeholder-gray-400 dark:text-white 
                dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => setId(e.target.value)}
              />
              <button
                type="submit"
                className="text-white absolute right-1.5 bottom-[5px]
               bg-blue-600 hover:bg-blue-700 focus:ring-4 
               focus:outline-none focus:ring-blue-300 font-medium 
               rounded-lg text-sm px-3 py-2 dark:bg-blue-600 
               dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Submit
              </button>
            </form>
          </div>
        ) : null}

        {/* Upload images */}
        {inputsVisibility.uploadImages ? (
          <form
            className="flex gap-2 mb-2"
            method="post"
            action="http://localhost:3001/images"
          >
            <input
              className="block w-full border border-gray-200 shadow-sm 
              rounded-lg text-sm focus:z-10 focus:border-blue-500 
              text-gray-400 bg-gray-50
              focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-600 
              dark:text-gray-400 file:bg-transparent file:border-0
              file:bg-gray-200 file:hover:bg-gray-100 file:mr-4 file:py-3 file:px-4
              dark:file:bg-gray-700 dark:file:text-gray-400
              file:cursor-pointer cursor-pointer
              file:dark:hover:bg-gray-600 dark:hover:border-gray-500
             "
              id="multiple_files"
              type="file"
              multiple
              required
            />
            <button
              className="text-white bg-blue-600 hover:bg-blue-700 
         focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm 
         px-5 py-22 dark:bg-blue-600 dark:hover:bg-blue-700 
         focus:outline-none dark:focus:ring-blue-800"
              onClick={handleUploadImages}
            >
              Upload
            </button>
          </form>
        ) : null}

        {/* Selected images */}
        {selectedImageIds.length > 0 && (
          <div className="flex items-center">
            <div
              className="pl-4 rounded-lg dark:bg-slate-700 bg-blue-50 flex
        items-center gap-4 w-max"
            >
              <div className="text-sm">
                Total images selected:{" "}
                <span className="font-bold">{selectedImageIds.length}</span>
              </div>
              <button
                className="text-white bg-blue-600 hover:bg-blue-700 
                focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm 
                px-5 py-2.5  dark:bg-blue-600 dark:hover:bg-blue-700 
                focus:outline-none dark:focus:ring-blue-800"
                onClick={handleSeeAllSelectedImages}
              >
                See all
              </button>
            </div>
            <button
              className="text-white bg-blue-600 hover:bg-blue-700 
              focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm 
              p-1 h-min ml-2 dark:bg-slate-700 dark:hover:bg-slate-600 
              focus:outline-none dark:focus:ring-blue-800"
              onClick={() => setSelectedImageIds([])}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Get all images */}
        {images ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4 lg:gap-5 pt-4">
            {images.images.map((image) => (
              <Gallery
                key={image._additional.id}
                image={image}
                handleDeleteImage={handleDeleteImage}
                handleEditImage={handleEditImage}
                handleSimilarImage={fetchSimilarImages}
                handleToggleSelection={toggleImageSelection}
                isSelected={selectedImageIds.includes(image._additional.id)}
              />
            ))}
          </div>
        ) : null}
      </div>

      {/* Messages */}
      {messages.map((msg: IMessage) => (
        <Message
          key={msg.key}
          message={msg.message}
          type={msg.type}
          duration={msg.duration}
          isVisible={true}
          setMessages={setMessages}
        />
      ))}
    </div>
  );
};

export default Controllers;
