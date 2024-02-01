import React, { useState, useRef, useEffect } from "react";
import { SketchPicker } from "react-color";
import { saveSvgAsPng } from "save-svg-as-png";
import { extractColors } from 'extract-colors'

function App() {
  const [selectedElement, setSelectedElement] = useState(null);
  const [upperStroke, setUpperStroke] = useState("black");
  const [lowerStroke, setLowerStroke] = useState("green");
  const [upperFill, setUpperFill] = useState("yellow");
  const [lowerFill, setLowerFill] = useState("blue");
  const [svgBackground, setSvgBackground] = useState("white");
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const colorPickerRef = useRef();
  const svgRef = useRef();


  const handleElementClick = (element) => {
    setSelectedElement(element);
    setColorPickerVisible(true);
  };

  const handleColorChange = (color) => {
    // Apply color to the selected element
    switch (selectedElement) {
      case "rect":
        setSvgBackground(color.hex);
        break;
      case "upperStroke":
        setUpperStroke(color.hex);
        break;
      case "lowerStroke":
        setLowerStroke(color.hex);
        break;
      case "upperFill":
        setUpperFill(color.hex);
        break;
      case "lowerFill":
        setLowerFill(color.hex);
        break;
      default:
        break;
    }
  };

  const randomize = () => {
    // Generate random colors and set them
    setUpperStroke(getRandomColor());
    setLowerStroke(getRandomColor());
    setUpperFill(getRandomColor());
    setLowerFill(getRandomColor());
    setSvgBackground(getRandomColor());
  };

  const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        setSvgBackground(imageDataUrl); // You can set the background directly, or use it in the SVG as an image
        generatePaletteFromImage(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePaletteFromImage = (imageDataUrl) => {
    // Create an image element to load the image
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Enable cross-origin access if needed
    img.src = imageDataUrl;

 
  

    // Set an onload event to ensure the image is fully loaded before extracting colors
    img.onload = () => {
      const palette = extractColors(img.src).then((res)=>{
        console.log(res)
       if(res[0]) setSvgBackground(res[0].hex)
       if(res[1]) setUpperStroke(res[1].hex)
       if(res[2]) setLowerStroke(res[2].hex)
       if(res[3]) setUpperFill(res[3].hex)
       if(res[4])  setLowerFill(res[4].hex)}
      )
      
      // Apply colors to stroke, fill, and background
      
    };
  };

  const downloadSvg = () => {
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "eth-mumbai.svg";
    link.click();
  };

  const downloadPng = () => {
    saveSvgAsPng(svgRef.current, "eth-mumbai.png");
  };

  // Close color picker when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target)
      ) {
        setColorPickerVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [colorPickerRef]);

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gray-100">
      <div className="flex flex-col items-center">
        <div className="flex space-x-2 mb-4">
          <button
            type="button"
            onClick={randomize}
            className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2"
          >
            Random Color
          </button>
          <label
            type="button"
            className="flex items-center text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2"
          >
            <svg
              className="mr-2 w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 5v9m-5 0H5a1 1 0 0 0-1 1v4c0 .6.4 1 1 1h14c.6 0 1-.4 1-1v-4c0-.6-.4-1-1-1h-2M8 9l4-5 4 5m1 8h0"
              />
            </svg>
            Generate Palette from Image
            <input
              type="file"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
        <div className="w-96 h-96 bg-white shadow-sm border border-gray-200 relative">
          <svg
            width="400"
            height="400"
            viewBox="0 0 2400 2400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            ref={svgRef}
          >
            <rect
              width="2300"
              height="2300"
              fill={svgBackground}
              onClick={() => handleElementClick("rect")}
              className={`cursor-pointer focus:border-pink-700 ${
                selectedElement === "rect" && "border-2 border-blue-500"
              }`}
            />
            <path
              d="M1185.6 294.398L1758 1216L1196.4 1548.4L642 1210L1185.6 294.398Z"
              fill={upperStroke}
              onClick={() => handleElementClick("upperStroke")}
              className={`cursor-pointer focus:border focus:border-pink-700 ${
                selectedElement === "upperStroke" && "border-2 border-blue-500"
              }`}
            />
            <path
              d="M1196.41 2105.2L1755.61 1319.2L1198.81 1649.2L645.609 1327.6L1196.41 2105.2Z"
              fill={lowerStroke}
              onClick={() => handleElementClick("lowerStroke")}
              className={`cursor-pointer ${
                selectedElement === "lowerStroke" && "border-2 border-blue-500"
              }`}
            />
            <path
              d="M1186.79 456.398L1607.99 1166.8L1191.59 1428.4L788.391 1166.8L1186.79 456.398Z"
              fill={upperFill}
              onClick={() => handleElementClick("upperFill")}
              className={`cursor-pointer ${
                selectedElement === "upperFill" && "border-2 border-blue-500"
              }`}
            />
            <path
              d="M1198.8 1992.4L1486.8 1572.4L1205.75 1750L928.805 1603.6L1198.8 1992.4Z"
              fill={lowerFill}
              onClick={() => handleElementClick("lowerFill")}
              className={`cursor-pointer ${
                selectedElement === "lowerFill" && "border-2 border-blue-500"
              }`}
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="my-4 text-center text-sm text-gray-700">
            Download Image as:
          </span>
          <div className="flex space-x-4">
            <button
              className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-pink-500 relative inline-block px-8 py-2 border-4 border-black"
              onClick={downloadSvg}
            >
              <span className="relative text-white text-sm">SVG</span>
            </button>
            <button
              className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-pink-500 relative inline-block px-8 py-2 border-4 border-black"
              onClick={downloadPng}
            >
              <span className="relative text-white text-sm">PNG</span>
            </button>
          </div>
        </div>
      </div>
      {colorPickerVisible && (
        <div ref={colorPickerRef}>
          <SketchPicker
            color="#000"
            onChange={handleColorChange}
            className="absolute ml-10 -mt-44"
          />
        </div>
      )}
    </div>
  );
}

export default App;
