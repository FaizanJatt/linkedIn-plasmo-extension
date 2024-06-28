import React from "react";
import { useEffect } from "react";
import ReactDOM from "react-dom";
interface ModalProps {
  isOpen: Boolean;
  onClose: () => void;
  chatHistory: { prompt: string; response: string }[];
  handleGenerate: () => void;
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  generateMode: Boolean;
  setGenerateMode: React.Dispatch<React.SetStateAction<Boolean>>;
  InsertGeneratedText: () => void;
  handleInputChange: (e: any) => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  chatHistory,
  handleGenerate,
  inputText,
  setInputText,
  generateMode,
  setGenerateMode,
  InsertGeneratedText,
  handleInputChange,
}) => {
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
      className="fixed inset-0 w-full h-max flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg gap-0 w-1/4"
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
          />
        </div>

        <div className="flex justify-end pb-4 pt-1 px-6 gap-4">
          {generateMode && (
            <button
              onClick={InsertGeneratedText}
              className="bg-white flex justify-center items-center border-[2px] border-solid rounded-lg border-[#666D80]   text-black font-bold py-2 px-4 "
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
              setGenerateMode(true);
              handleGenerate();
            }}
            className="bg-blue-500 flex justify-center items-center rounded-lg  hover:bg-blue-700 text-white font-bold py-2 px-4 "
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
              <div className="text-2xl cursor-pointer">
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
