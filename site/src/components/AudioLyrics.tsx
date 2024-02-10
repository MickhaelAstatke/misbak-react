//@ts-nocheckss
import {
  AppBar,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  ThemeProvider,
  Toolbar,
  createTheme,
} from "@mui/material";
import React, { useRef, useEffect, useState } from "react";
// import { AudioVisualizer } from "react-audio-visualize";
import { Visualizer } from "react-sound-visualizer";
import MenuIcon from "@mui/icons-material/Menu";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function AudioLyrics() {
  const [file, setFile] = useState(null);
  const canvasRef = useRef();
  const audioRef = useRef();
  const source = useRef();
  const analyzer = useRef();

  const handleAudioPlay = () => {
    let audioContext = new AudioContext();
    if (!source.current) {
      source.current = audioContext.createMediaElementSource(audioRef.current);
      analyzer.current = audioContext.createAnalyzer();
      source.current.connect(analyzer.current);
      analyzer.current.connect(audioContext.destination);
    }
    visualizeData();
  };

  const visualizeData = () => {};

  return (
    <div className="App">
      <input
        type="file"
        onChange={({ target: { files } }) => files[0] && setFile(files[0])}
      />
      {file && (
        <audio
          ref={audioRef}
          onPlay={handleAudioPlay}
          src={window.URL.createObjectURL(file)}
          controls
        />
      )}
      <canvas ref={canvasRef} width={500} height={200} />
    </div>
  );
}

function AudioLyrics3() {
  const [audio, setAudio] = useState<MediaStream | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false,
      })
      .then(setAudio);
  }, []);

  return (
    <Visualizer audio={audio}>
      {({ canvasRef, stop, start, reset }) => (
        <>
          <canvas ref={canvasRef} width={500} height={100} />

          <div>
            <button onClick={start}>Start</button>
            <button onClick={stop}>Stop</button>
            <button onClick={reset}>Reset</button>
          </div>
        </>
      )}
    </Visualizer>
  );
}

function AudioLyrics2() {
  const [blob, setBlob] = useState<Blob>();
  const visualizerRef = useRef<HTMLCanvasElement>(null);

  // set blob somewhere in code

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar position="sticky">
        <Toolbar>
          <Grid
            container
            // spacing={2}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {!isMobile && (
              <Grid item container md={4} xs={12} direction="row">
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                >
                  <MenuIcon />
                </IconButton>

                <h1>Lyrics</h1>
              </Grid>
            )}
          </Grid>
        </Toolbar>
      </AppBar>

      <div>
        {blob && (
          <AudioVisualizer
            ref={visualizerRef}
            blob={blob}
            width={500}
            height={75}
            barWidth={1}
            gap={0}
            barColor={"#f76565"}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default AudioLyrics;
