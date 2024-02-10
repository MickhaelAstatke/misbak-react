import { useEffect, useRef, useState } from "react";
import { AudioVisualizer } from "react-audio-visualize";
import Draggable from "react-draggable";

export default function VisualizerImp() {
  const [blob, setBlob] = useState<Blob>();
  const [audioSrc, setAudioSrc] = useState<string>();
  const [xPos, setXPos] = useState<number>();
  const [isDragging, setIsDragging] = useState<boolean>();
  const audioRef = useRef(null);
  const timeRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);

  const onTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    console.log(audioRef.current.currentTime, isDragging);

    if (!isDragging && audioRef.current && audioRef.current.duration > 0) {
      setXPos((audioRef.current.currentTime * 500) / audioRef.current.duration);
    }
    // Update the position of the current time indicator bar here.
  };

  const onFileChanged = (blob: Blob) => {
    console.log(window.URL.createObjectURL(blob));
    setBlob(blob);
    setAudioSrc(window.URL.createObjectURL(blob));
  };

  const updateTime = (event: any) => {
    console.log(event.target.value); //, audioRef);
    audioRef.current.currentTime = event.target.value;
    // audioRef.current && audioRef.current.seek(event.target.value);
    // console.log(event.target.value);
  };

  const handleStart = (e: Event, data: DraggableData) => {
    setIsDragging(true);
    console.log("handleStart", data.x);
    const pct = data.x / 500;
    audioRef.current.currentTime = pct * audioRef.current.duration;
  };
  const handleDrag = (e: Event, data: DraggableData) => {
    console.log("handleDrag", data.x);
    const pct = data.x / 500;
    audioRef.current.currentTime = pct * audioRef.current.duration;
  };
  const handleStop = (e: Event, data: DraggableData) => {
    setIsDragging(false);
    console.log("handleStop", data.x);
    const pct = data.x / 500;
    audioRef.current.currentTime = pct * audioRef.current.duration;
  };

  const onMouseDown = (e: Event) => {
    console.log("mouse down", e);
    const currentTargetRect = event.currentTarget.getBoundingClientRect();
    const event_offsetX = event.pageX - currentTargetRect.left;

    console.log("event_offsetX", event_offsetX);
    if (event_offsetX > 0 && event_offsetX < 500) {
      const pct = event_offsetX / 500;
      audioRef.current.currentTime = pct * audioRef.current.duration;

      console.log("setting", pct * audioRef.current.duration);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={({ target: { files } }) =>
          files[0] && onFileChanged(files[0])
        }
      />

      <input type="number" ref={timeRef} onChange={updateTime} />

      <br />

      <br />
      {blob && (
        <div className="current-time-indicator-bar">
          <audio
            onTimeUpdate={onTimeUpdate}
            ref={audioRef}
            // onPlay={handleAudioPlay}
            src={audioSrc}
            controls
          />
        </div>
      )}
      <span>{currentTime}</span>
      <br />

      {blob && (
        <div onMouseUp={onMouseDown}>
          <Draggable
            axis="x"
            handle=".handle"
            grid={[25, 25]}
            onStart={handleStart}
            onDrag={handleDrag}
            onStop={handleStop}
            defaultPosition={{ x: 0, y: 0 }}
            position={{
              x: xPos,
              y: 0,
            }}
            bounds={{ left: 0, top: 0, right: 500, bottom: 20 }}
          >
            <div>
              <div className="handle">&nbsp;</div>
            </div>
          </Draggable>
          <AudioVisualizer
            blob={blob}
            width={500}
            height={75}
            barWidth={1}
            currentTime={audioRef.current && audioRef.current.currentTime}
            gap={0}
            barColor={"#f76565"}
            // barPlayedColor={"#00bbff"}
          />
        </div>
      )}
      {/*
      <br />
      {blob && (
        <AudioVisualizer
          blob={blob}
          width={500}
          height={75}
          barWidth={3}
          gap={2}
          barColor={"lightblue"}
        />
      )} */}
    </div>
  );
}
