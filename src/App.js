import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import image1 from './media/dust2.png';
import image2 from './media/mirage.png';
import image3 from './media/inferno.png';
import image4 from './media/overpass.png';
import image5 from './media/nuke1.png';

function App() {
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [circlePositions, setCirclePositions] = useState({
    coba: { x: 50, y: 50 },
    novicz: { x: 150, y: 50 },
    nexus: { x: 250, y: 50 },
    zedolost: { x: 350, y: 50 },
    corrality: { x: 450, y: 50 },
  });
  const [draggingCircle, setDraggingCircle] = useState(null);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.strokeStyle = 'black';
    context.lineWidth = 5;
    contextRef.current = context;
  }, []);

  const startDrawing = (event) => {
    if (!color) return;
    const { offsetX, offsetY } = event.nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setDrawing(true);
  };

  const draw = (event) => {
    if (!drawing) return;
    const { offsetX, offsetY } = event.nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setDrawing(false);
  };

  const toggleColor = (selectedColor) => {
    if (color === selectedColor) {
      setColor(null);
    } else {
      setColor(selectedColor);
      if (selectedColor === 'eraser') {
        contextRef.current.globalCompositeOperation = 'destination-out'; // Modo borracha
        contextRef.current.lineWidth = 50; // Maior largura para a borracha
      } else {
        contextRef.current.globalCompositeOperation = 'source-over'; // Modo desenho normal
        contextRef.current.strokeStyle = selectedColor;
        contextRef.current.lineWidth = 5; // Redefine a largura para desenhar
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const showImage = (image) => {
    setCurrentImage(image);
  };

  const handleMouseDown = (name) => () => {
    setDraggingCircle(name);
  };

  const handleMouseMove = (event) => {
    if (!draggingCircle) return;
    
    setCirclePositions((prevPositions) => ({
      ...prevPositions,
      [draggingCircle]: { ...prevPositions[draggingCircle], x: event.clientX - 1320, y: event.clientY - 135 },
    }));
  };

  const handleMouseUp = () => {
    setDraggingCircle(null);
  };

  return (
    <div className="App" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <div className="color-picker">
        <div>
          <button 
            className={`color-button ${color === ' ' ? 'active' : ''}`}
            style={{ backgroundColor: '#FFAA17' }}
            onClick={() => toggleColor('#FFAA17')}
          >
            ⠀
          </button>
          <button 
            className={`color-button ${color === 'blue' ? 'active' : ''}`}
            style={{ backgroundColor: '#0BBBD9' }}
            onClick={() => toggleColor('#0BBBD9')}
          >
            ⠀
          </button>
          <button 
            className={`color-button ${color === 'eraser' ? 'active' : ''}`}
            style={{ backgroundColor: 'white', border: '1px solid #000' }}
            onClick={() => toggleColor('eraser')}
          >
            LIMPA
          </button>
          <button 
            className="color-button"
            style={{ backgroundColor: '#3F008A', color: 'white' }}
            onClick={clearCanvas}
          >
            NOVO
          </button>
        </div>
        <div>
        <textarea className="text-input" placeholder="Digite aqui..."></textarea>
        </div>
      </div>
      <div className="image-picker">
        <button onClick={() => showImage(image1)}>Dust II</button>
        <button onClick={() => showImage(image2)}>Mirage</button>
        <button onClick={() => showImage(image3)}>Inferno</button>
        <button onClick={() => showImage(image4)}>Overpass</button>
        <button onClick={() => showImage(image5)}>Nuke</button>
      </div>
      {currentImage && (
        <img src={currentImage} alt="Selected" className="background-image" />
      )}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="drawing-canvas"
      />
      <div className="draggable-circles">
        {Object.entries(circlePositions).map(([name, pos]) => (
          <div
            key={name}
            className="circle"
            style={{ backgroundColor: getColor(name), left: `${pos.x}px`, top: `${pos.y}px` }}
            onMouseDown={handleMouseDown(name)}
          >
            <p>{getLabel(name)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const getColor = (name) => {
  switch (name) {
    case 'coba':
      return '#4FD924';
    case 'novicz':
      return '#FF7D0A';
    case 'nexus':
      return '#AE18D6';
    case 'zedolost':
      return '#09BFDE';
    case 'corrality':
      return '#FFC106';
    default:
      return 'grey';
  }
};

const getLabel = (name) => {
  switch (name) {
    case 'coba':
      return 'Coba';
    case 'novicz':
      return 'Novicz';
    case 'nexus':
      return 'Nexus';
    case 'zedolost':
      return 'Zedolost';
    case 'corrality':
      return 'Corrality';
    default:
      return '';
  }
};

export default App;