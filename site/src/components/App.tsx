//@ts-nocheck
import { useEffect, useState } from "react";
import { Form } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { HighlightEnums } from "../Helpers/HighlightEnums";
import styles from "../styles/App.module.css";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Word = ({ letter, milikit, highlight, key }) => (
  <span className={styles.inlineBlock}>
    <span className={styles.singleInput} name={key} data-key={key}>
      {milikit[key] || ""}
    </span>
    <span className={[styles.singleWord, highlight].join(" ")} data-key={key}>
      {letter}
    </span>
  </span>
);

const App = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const week = queryParams.get("week");
  const day = queryParams.get("day");
  const highlight = queryParams.get("highlight");

  const [data, setData] = useState([]);
  const [milikit, setMilikit] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res, signRes] = await Promise.all([
          import(`../data/${week}/${day}.json`),
          import(`../data/${week}/${day}.sign.json`),
        ]);
        setData(res.default);
        setMilikit(signRes.default);
      } catch (error) {
        console.error(error);
      }

      if (highlight) {
        const element = document.getElementById(highlight);

        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    fetchData();
  }, [week, day, highlight]);

  const onClickHandler = (el) => {
    // Do something here to tell the player to play audio
  };

  const renderWord = (letter, milikit, highlight, key) => (
    <Word letter={letter} milikit={milikit} highlight={highlight} key={key} />
  );

  const renderContent = (item, index) => (
    <div
      key={index}
      onClick={onClickHandler}
      id={item.title}
      className={item.title === highlight ? "highlighted" : ""}
    >
      <h2 className={styles.title}>
        {item.title}{" "}
        <span className="house">{item.house || item.houseShort}</span>
      </h2>
      <p className={styles.paragraph}>
        {item.text &&
          item.text.split(" ").map((word, wordIndex) => {
            const wordKey = `arr-${index}_word-${wordIndex}`;
            const highlightClass =
              HighlightEnums.indexOf(word) > -1 ? "highlight" : "";

            return (
              <span key={wordKey} className={styles.dontBreak}>
                {word === "\n" ? <br /> : null}
                {word.split("").map((letter, letterIndex) => {
                  const letterKey = `arr-${index}_word-${wordIndex}_letter-${letterIndex}`;

                  return letter && letter !== " " ? (
                    renderWord(letter, milikit, highlightClass, letterKey)
                  ) : (
                    <span className={styles.inlineBlock} key={letterKey}>
                      <span
                        className={styles.singleWord}
                        data-key={letterKey}
                        key={letterKey}
                      >
                        &nbsp;
                      </span>
                    </span>
                  );
                })}
                <span> </span>
              </span>
            );
          })}
      </p>
    </div>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <Form method="POST" id="content">
        <div className="no-split-rows">{data.map(renderContent)}</div>
        <br />
        <br />
      </Form>
    </ThemeProvider>
  );
};

export default App;
