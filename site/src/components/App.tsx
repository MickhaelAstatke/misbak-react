//@ts-nocheck
import styles from "../styles/App.module.css";
import { useEffect, useState } from "react";
import { Form } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { HighlightEnums } from "../Helpers/HighlightEnums";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const queryParams = new URLSearchParams(window.location.search);
  const week = queryParams.get("week");
  const day = queryParams.get("day");
  const highlight = queryParams.get("highlight");

  const [data, setData] = useState([]);
  const [milikit, setMilikit] = useState([]);

  useEffect(() => {
    import(`../data/${week}/${day}.json`)
      .then((res) => setData((_) => res.default))
      .catch((_) => null);

    import(`../data/${week}/${day}.sign.json`)
      .then((res) => setMilikit((_) => res.default))
      .catch((_) => null);

    if (highlight) {
      const element = document.getElementById(highlight);

      console.log(highlight, element);

      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [week, day, highlight]);

  function onClickHandler(el: MouseEventHandler) {
    //Do something here to tell player to play audio
  }

  const element = data.map((item, arrIndex) => {
    return (
      item.text &&
      item.text.split(" ").map((word, wordIndex) => {
        const wordKey = `arr-${arrIndex}_word-${wordIndex}`;
        const highlight = HighlightEnums.indexOf(word) > -1 ? "highlight" : "";
        if (word == "\n") {
          return <br />;
        }
        const wordContent = word.split("").map((letter, letterIndex) => {
          const key = `arr-${arrIndex}_word-${wordIndex}_letter-${letterIndex}`;

          if (!letter || letter == " ") {
            return (
              <span className={styles.inlineBlock}>
                <span className={styles.singleWord} data-key={key} key={key}>
                  &nbsp;
                </span>
              </span>
            );
          }

          return (
            <span key={key} className={styles.inlineBlock}>
              <span className={styles.singleInput} name={key} data-key={key}>
                {milikit[key] || ""}{" "}
              </span>
              <span
                className={[styles.singleWord, highlight].join(" ")}
                data-key={key}
              >
                {letter}
              </span>
            </span>
          );
        });

        return (
          <span key={wordKey} className={styles.dontBreak}>
            {wordContent} <span> </span>
          </span>
        );
      })
    );
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Form method="POST" id="content">
        <div className="no-split-rows">
          {data.map((item, index) => {
            return (
              <div
                key={index}
                onClick={onClickHandler}
                id={item.title}
                className={item.title == highlight ? "highlighted" : ""}
              >
                <h2 className={styles.title}>
                  {item.title}{" "}
                  <span className="house">{item.house || item.houseShort}</span>
                </h2>
                <p className={styles.paragraph}>{element[index]}</p>
              </div>
            );
          })}
        </div>
        <br />
        <br />
      </Form>
    </ThemeProvider>
  );
}

export default App;
