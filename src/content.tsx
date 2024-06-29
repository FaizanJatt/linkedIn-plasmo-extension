import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import cssText from "data-text:~style.css";
const ICON = require("../assets/editIcon");
import type { PlasmoCSConfig } from "plasmo";
import Modal from "~features/Modal";

export const config: PlasmoCSConfig = {
  matches: ["https://*.linkedin.com/*"],
};

export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

const MESSAGE_INPUT_SELECTOR = ".msg-form__contenteditable"; // Selector for message input

const injectTailwindCSS = () => {
  const link = document.createElement("link");
  link.href =
    "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";
  link.rel = "stylesheet";
  document.head.appendChild(link);
};

const Content = () => {
  const [isFocused, setIsFocused] = useState(false);
  const messageInputRef = useRef<HTMLDivElement | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    console.warn("CLOSING");
  };

  useEffect(() => {
    const messageInput = document.querySelector(
      MESSAGE_INPUT_SELECTOR
    ) as HTMLDivElement;
    if (messageInput) {
      messageInputRef.current = messageInput;

      const handleFocus = () => {
        setIsFocused(true);
      };

      const handleBlur = () => {
        setIsFocused(false);
      };

      messageInput.addEventListener("focus", handleFocus);
      messageInput.addEventListener("blur", handleBlur);

      return () => {
        messageInput.removeEventListener("focus", handleFocus);
        messageInput.removeEventListener("blur", handleBlur);
      };
    } else {
      console.warn("Message input field not found");
    }
  }, []);

  return (
    <div className="z-50 flex  ">
      {isFocused && (
        <div
          onClick={handleModalOpen}
          className="bg-white absolute cursor-pointer right-0 bottom-0 mb-2 mr-2 flex rounded-full w-8 h-8 justify-center items-center"
        >
          <img src={ICON} width={15} height={14} alt="ICON" />
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        setOpen={handleModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
};

// Function to render the React component once the target element is available
const renderContent = () => {
  const linkedInTextBox = document.querySelector(MESSAGE_INPUT_SELECTOR);
  if (linkedInTextBox && linkedInTextBox.lastChild.nodeName === "P") {
    const rootElement = document.createElement("div");
    rootElement.className = "contentRoot";
    linkedInTextBox.appendChild(rootElement);

    ReactDOM.render(<Content />, rootElement);
  }
};

// Inject Tailwind CSS into the document
injectTailwindCSS();

// Observe for the target element
const observer = new MutationObserver((mutations, observer) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      const linkedInTextBox = document.querySelector(MESSAGE_INPUT_SELECTOR);
      if (linkedInTextBox) {
        renderContent();
        observer.disconnect(); // Stop observing once the element is found
      }
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });
