import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import cssText from "data-text:~style.css";
const ICON = require("../assets/editIcon"); // Assuming ICON is an image object
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
    "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"; // Adjust the URL to match your Tailwind CSS version
  link.rel = "stylesheet";
  document.head.appendChild(link);
};

const Content = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const fixedResponse =
    "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.";

  const handleGenerate = () => {
    if (inputText.length > 0) {
      setChatHistory([
        ...chatHistory,
        { prompt: inputText, response: fixedResponse },
      ]);
      setInputText("");
      setGenerateMode(true); // Enable chat-like display
    }
  };

  const InsertGeneratedText = () => {
    const textBox = document.querySelector(MESSAGE_INPUT_SELECTOR);
    if (textBox) {
      textBox.firstChild.textContent = fixedResponse;
      setIsModalOpen(false);
    }
  };
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };
  const [generateMode, setGenerateMode] = useState<Boolean>(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const messageInputRef = useRef(null);

  useEffect(() => {
    const messageInput = document.querySelector(MESSAGE_INPUT_SELECTOR);
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
        onClose={handleModalClose}
        chatHistory={chatHistory}
        handleGenerate={handleGenerate}
        inputText={inputText}
        setInputText={setInputText}
        generateMode={generateMode}
        setGenerateMode={setGenerateMode}
        InsertGeneratedText={InsertGeneratedText}
        handleInputChange={handleInputChange}
      />
      {/* {isModalOpen && (
        <div
          className="fixed inset-0 w-full h-max flex items-center  justify-center bg-black bg-opacity-50"
          onClick={handleModalClose}
        >
          <div
            className="bg-white  rounded-lg shadow-lg gap-0 w-1/4  " // Adjusted width and added shadow
            onClick={(e) => e.stopPropagation()}
          >
            {generateMode && (
              <div className="p-3 max-h-42 overflow-y-auto">
                {chatHistory.map((item, index) => (
                  <div key={index} className="mb-2">
                    <div className="flex w-full justify-end">
                      <div className="bg-[#FFE1E7] opacity-100 bg-opacity-100 px-4">
                        {item.prompt}
                      </div>
                    </div>
                    <div className="flex flex-start">
                      <div className="bg-[#DBEAFE] px-4">{item.response}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="pt-6 pb-4 px-3 flex justify-start">
              <input
                className="w-full h-16 ml-4 px-4 py-1 border border-gray-300 rounded-xl"
                placeholder="Your prompt"
                value={inputText}
                onChange={handleInputChange}
              ></input>
            </div>

            <div className="flex justify-end pb-4 pt-1 px-6 gap-4">
              {generateMode && (
                <button className="bg-white flex justify-center items-center border-[2px] border-solid rounded-lg border-[#666D80]   text-black font-bold py-2 px-4 ">
                  <div className="flex justify-center items-center px-6 gap-2.5">
                    <img
                      src={require("../assets/downArrow")}
                      width={14}
                      height={15}
                      alt="downArrowIcon"
                    ></img>

                    <div
                      onClick={InsertGeneratedText}
                      className="text-2xl cursor-pointer"
                    >
                      Insert
                    </div>
                  </div>
                </button>
              )}
              <button
                onClick={() => {
                  setGenerateMode(true);
                  handleGenerate();
                }}
                className="bg-blue-500 flex justify-center items-center rounded-lg  hover:bg-blue-700 text-white font-bold py-2 px-4 "
              >
                <div className="flex justify-center items-center px-6 gap-2.5">
                  {generateMode ? (
                    <img
                      src={require("../assets/loop")}
                      width={14}
                      height={15}
                      alt="loopIcon"
                    ></img>
                  ) : (
                    <img
                      src={require("../assets/arrow")}
                      width={18}
                      height={18}
                      alt="arrowIcon"
                    ></img>
                  )}
                  <div className="text-2xl cursor-pointer">
                    {generateMode ? "Regnerate" : "Generate"}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )} */}
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
