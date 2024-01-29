
import React, { useState } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { SketchPicker } from 'react-color';

const Logo = () => {
  const [selectedPart, setSelectedPart] = useState(null);
  const [fillColor, setFillColor] = useState('#ff0000'); // Initial color

  const handlePartClick = (part) => {
    setSelectedPart(part);
  };

  const handleStageClick = () => {
    setSelectedPart(null);
  };

  const handleColorChange = (color) => {
    setFillColor(color.hex);
  };

  const handleDownload = () => {
    // Implement download functionality here
  };

  return (
    <div>
      <Stage width={500} height={500} onClick={handleStageClick}>
        <Layer>
          {/* Thick Boundary */}
          <Rect
            width={500}
            height={500}
            stroke={'#000'}
            strokeWidth={10}
            onClick={() => handlePartClick('boundary')}
          />
          {/* Middle Fill */}
          <Rect
            width={480}
            height={480}
            fill={fillColor}
            onClick={() => handlePartClick('fill')}
          />
        </Layer>
      </Stage>

      {/* Color Picker */}
      {selectedPart && (
        <div>
          <p>Choose Color:</p>
          <SketchPicker color={fillColor} onChange={handleColorChange} />
        </div>
      )}

      {/* Download Button */}
      <div>
        <button onClick={handleDownload}>Download</button>
      </div>
    </div>
  );
};

export default Logo;
