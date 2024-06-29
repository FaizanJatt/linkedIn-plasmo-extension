import React, { useState } from "react";
import { useEffect } from "react";
import ReactDOM from "react-dom";
interface ModalProps {
  isOpen: Boolean;
  setOpen: () => void;
  onClose: () => void;
}
interface ChatMessage {
  prompt: string;
  response: string;
}
const MESSAGE_INPUT_SELECTOR = ".msg-form__contenteditable"; // Selector for message input

const Modal: React.FC<ModalProps> = ({ isOpen, setOpen, onClose }) => {
  const [inputText, setInputText] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [generateMode, setGenerateMode] = useState<Boolean>(false);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const fixedResponse =
    "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.";

  const handleGenerate = () => {
    if (inputText.length > 0) {
      setChatHistory([
        ...chatHistory,
        { prompt: inputText, response: fixedResponse },
      ]);
      setInputText("");
      setGenerateMode(true);
    }
  };
  const InsertGeneratedText = () => {
    const textBox = document.querySelector(MESSAGE_INPUT_SELECTOR);
    if (textBox) {
      textBox.firstChild.textContent = fixedResponse;
      onClose();
    }
  };
  useEffect(() => {
    const modalRoot = document.getElementById("plasmo-modal-container");
    if (modalRoot) {
      modalRoot.setAttribute("contenteditable", "false"); // Explicitly disable editing on the modal root
      const allChildren = modalRoot.querySelectorAll("*"); // Get all child elements
      allChildren.forEach((child) => {
        child.setAttribute("contenteditable", "false"); // Disable editing on all children
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      const modalContainer = document.getElementById("plasmo-modal-container");
      if (modalContainer) {
        ReactDOM.unmountComponentAtNode(modalContainer);
        modalContainer.remove();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      id="plasmo-modal-container"
      data-contenteditable="false"
      className={`fixed inset-0 w-full z-50 h-max flex items-center justify-center bg-black bg-opacity-50  ${!isOpen && "hidden"}`}
      onClick={onClose}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div
        className="bg-white rounded-lg shadow-lg gap-0 w-1/4"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {generateMode && (
          <div className="p-3 max-h-42 overflow-y-auto font-normal">
            {chatHistory.map((item, index) => (
              <div key={index} className="mb-2 flex flex-col gap-y-6">
                <div className="flex max-w-4/5 w-4/5 justify-end self-end mr-6">
                  <div className="bg-gray-100 ml-6 px-4 py-4 rounded-xl ">
                    <p>{item.prompt}</p>
                  </div>
                </div>
                <div className="flex w-4/5 flex-start ml-6 mr-6 ">
                  <div className="bg-blue-200 px-4 rounded-xl">
                    <p>{item.response}</p>
                  </div>
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
          />
        </div>

        <div className="flex justify-end pb-4 pt-1 px-6 gap-4">
          {generateMode && (
            <button
              onClick={InsertGeneratedText}
              className="bg-white flex justify-center items-center border-[2px] border-solid rounded-lg border-[#666D80]   text-[#666D80] font-semibold py-2 px-4 "
            >
              <div className="flex justify-center items-center px-6 gap-2.5">
                <img
                  src={require("../../assets/downArrow")}
                  width={14}
                  height={15}
                  alt="downArrowIcon"
                />

                <div className="text-2xl cursor-pointer">Insert</div>
              </div>
            </button>
          )}
          <button
            onClick={() => {
              if (inputText.length > 0) {
                setGenerateMode(true);
                handleGenerate();
              }
            }}
            className="bg-blue-500 flex justify-center items-center rounded-lg font-semibold  hover:bg-blue-700 text-white  py-2 px-4 "
          >
            <div className="flex justify-center items-center px-6 gap-2.5">
              {generateMode ? (
                <img
                  src={require("../../assets/loop")}
                  width={14}
                  height={15}
                  alt="loopIcon"
                />
              ) : (
                <img
                  src={require("../../assets/arrow")}
                  width={18}
                  height={18}
                  alt="arrowIcon"
                />
              )}
              <div className="text-2xl cursor-pointer ">
                {generateMode ? "Regenerate" : "Generate"}
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
