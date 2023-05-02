import React, { useEffect, useState } from "react";

interface MessageProps {
  message: string;
  duration?: number;
  isVisible: boolean;
  type?: "success" | "warning" | "error" | "info";
  key: number;
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
}

export interface IMessage {
  key: number;
  message: string;
  type: "success" | "warning" | "error" | "info";
  duration: number;
}

const Message: React.FC<MessageProps> = ({
  message,
  duration = 3000,
  isVisible,
  type = "info",
  key,
  setMessages,
}) => {
  const [visible, setVisible] = useState(isVisible);

  useEffect(() => {
    setVisible(isVisible);
    if (isVisible) {
      const timer = setTimeout(() => {
        setVisible(false);
        // Remove the message from the parent's state
        setMessages((prevState) => prevState.filter((msg) => msg.key !== key));
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, key , setMessages]);

  const handleCloseButtonClick = () => {
    setVisible(false);
  };

  const messageType = {
    success: {
      className:
        "text-green-800  border-green-300  bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800 ",
      message: "Success",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    info: {
      className:
        "text-blue-800  border-blue-300  bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800 ",
      message: "Info",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    warning: {
      className:
        "text-yellow-800  border-yellow-300  bg-yellow-50 dark:bg-gray-800 dark:text-yellow-400 dark:border-yellow-800 ",
      message: "Warning",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    error: {
      className:
        "text-red-800  border-red-300  bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800 ",
      message: "Error",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed left-4 bottom-2 flex p-4 mb-4 text-sm border rounded-lg 
      ${messageType[type].className}`}
      role="alert"
    >
      <span className="mr-2">{messageType[type].icon}</span>
      <span className="sr-only">{messageType[type].message}</span>
      <div>
        <span className="font-bold">{messageType[type].message}:</span>{" "}
        {message}
      </div>
    </div>
  );
};

export default Message;
{
  /* <div
      className={`fixed bottom-4 left-4 p-3 rounded-md 
      text-white text-sm ${getMessageTypeClass()}`}
      role="alert"
    >
      {message}
      <button
        onClick={handleCloseButtonClick}
        className="absolute top-0 right-0 p-1 mr-1 mt-1 text-white focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M10 9.293l4.146-4.147a.5.5 0 01.708.708L10.707 10l4.147 4.146a.5.5 0 01-.708.708L10 10.707l-4.146 4.147a.5.5 0 01-.708-.708L9.293 10 5.146 5.854a.5.5 0 11.708-.708L10 9.293z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div> */
}
