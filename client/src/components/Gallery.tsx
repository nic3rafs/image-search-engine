import Image from "next/image";
import { useEffect, useState } from "react";
import type { ImagesResponse, WeaviateImage } from "../types";
import Message, { IMessage } from "./Message";

type GalleryProps = {
  image: WeaviateImage;
  handleDeleteImage: (imageId: string) => void;
  handleEditImage: (image: WeaviateImage) => void;
  handleSimilarImage: (imageId: string) => void;
  handleToggleSelection: (imageId: string) => void;
  isSelected: boolean;
};

const Gallery = ({
  image,
  handleDeleteImage,
  handleEditImage,
  handleSimilarImage,
  handleToggleSelection,
  isSelected,
}: GalleryProps) => {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(image.text);
  const [messages, setMessages] = useState<IMessage[]>([]);

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

  const handleNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewName(e.target.value);
  };

  const handleEditButtonClick = () => {
    if (editing && newName !== image.text) {
      handleEditImage({ ...image, text: newName });
    }

    setEditing(!editing);
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(image._additional.id);
    } catch (error) {
      console.error("Failed to copy image ID:", error);
    }
    addMessage("Id copied!", "success", 2000);
  };

  return (
    <div
      // key={_additional.id}
      className={`max-w-sm flex flex-col place-content-between
     bg-white border border-gray-200 rounded-lg shadow 
     dark:bg-gray-800 dark:border-gray-700 overflow-hidden
      ${
        isSelected
          ? "dark:border-green-500 border-green-500 dark:bg-slate-700 bg-blue-50"
          : ""
      }`}
    >
      <a
        className="cursor-pointer"
        onClick={() => handleToggleSelection(image._additional.id)}
      >
        {" "}
        <Image
          className=" h-screen w-full max-h-48 object-cover "
          src={`http://localhost:3001/api/imageUrl/${image._additional.id}`}
          alt="test"
          width={1000}
          height={1000}
        />
      </a>
      <div className="p-2 h-full flex place-content-between flex-col">
        <div className="flex place-content-between flex-col h-full">
          {editing ? (
            <textarea
              name="text"
              wrap="soft"
              value={newName}
              onChange={handleNameChange}
              className="text-sm font-normal break-all break-words tracking-tight 
            text-gray-900 dark:text-white  p-1 rounded dark:bg-gray-900 w-full h-full min-h-max"
            />
          ) : (
            <h5 className="mb-2 text-base font-bold break-all tracking-tight text-gray-900 dark:text-white">
              {image.text}
            </h5>
          )}
          <p
            className="mb-3 pt-1 font-normal text-xs text-gray-700 dark:text-gray-400
           hover:underline cursor-pointer"
            onClick={handleCopyId}
          >
            ID: {image._additional.id}
          </p>
        </div>

        <div className="flex place-content-between">
          {/* Delete image */}
          <button
            onClick={() => handleDeleteImage(image._additional.id)}
            className="inline-flex items-center px-2 py-2 
        text-xs font-medium text-center text-white 
        bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 
        focus:outline-none focus:ring-blue-300 
        dark:bg-blue-600 dark:hover:bg-blue-700 
        dark:focus:ring-blue-800"
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
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>

          <button
            className="inline-flex items-center px-2 py-2 
        text-xs font-medium text-center text-white 
        bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 
        focus:outline-none focus:ring-blue-300 
        dark:bg-blue-600 dark:hover:bg-blue-700 
        dark:focus:ring-blue-800"
            onClick={() => handleSimilarImage(image._additional.id)}
          >
            Similar
          </button>

          <button
            onClick={handleEditButtonClick}
            className="inline-flex items-center px-2 py-2
        text-xs font-medium text-center text-white 
        bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 
        focus:outline-none focus:ring-blue-300 
        dark:bg-blue-600 dark:hover:bg-blue-700 
        dark:focus:ring-blue-800"
          >
            {editing ? (
              "Save"
            ) : (
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
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            )}
          </button>
        </div>
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

export default Gallery;
