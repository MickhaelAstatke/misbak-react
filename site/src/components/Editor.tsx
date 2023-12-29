//@ts-nocheck
import styles from "../styles/Editor.module.css";
import { MouseEventHandler, useEffect, useState } from "react";
import { sanitize, ObjectInterface } from "./Mapping";
import {
  Form,
  useLoaderData,
  useOutletContext,
  useParams,
  useSubmit,
} from "react-router-dom";
import { Button, Snackbar } from "@mui/material";
import AddOutlined from "@mui/icons-material/AddOutlined";
import { HighlightEnums } from "../Helpers/HighlightEnums";

interface DataInterface {
  data: [];
  sign: object;
}

function Editor() {
  const [layout] = useOutletContext();
  const params = useParams();
  const submit = useSubmit();
  const routeData = useLoaderData() as DataInterface;

  const [snackOpen, setSnackOpen] = useState(false);
  const [data, setData] = useState(routeData.data);
  const [milikit, setMilikit] = useState(routeData.sign);

  const handleClose = () => {
    setSnackOpen(false);
  };

  const openSnack = () => {
    setSnackOpen(true);
  };

  useEffect(() => {
    console.log("in use effect", routeData);
    setMilikit((_) => routeData.sign);
    setData((_) => routeData.data);

    if (params.highlight) {
      const element = document.getElementById(params.highlight);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [params.week, params.day]);

  function onClickHandler(el: MouseEventHandler) {
    const clickedElement = el.target.getAttribute("data-key");
    const elements = document.getElementsByName(clickedElement);
    if (elements && elements[0]) {
      elements[0].focus();
    }
  }

  function onMilikitChangeHandler(el: InputEvent) {
    if (!el.target) return;
    const key = el.target.getAttribute("data-key");
    const value: string = sanitize(el.target.value);
    // milikit[key] = value;
    setMilikit((prevState) => {
      const temp: ObjectInterface = Object.assign({}, prevState);
      temp[key] = value;
      return temp;
    });
    console.log("milikit changed", milikit);
  }

  const element = data.map((item, arrIndex) => {
    return (
      item.text &&
      item.text.split(" ").map((word, wordIndex) => {
        const wordKey = `arr-${arrIndex}_word-${wordIndex}`;
        const highlight = HighlightEnums.indexOf(word) > -1 ? "highlight" : "";
        if (word == "\n") {
          return <br key={wordKey + "newline"} />;
        }
        const wordContent = word.split("").map((letter, letterIndex) => {
          //console.log("letter", letter);
          const key = `arr-${arrIndex}_word-${wordIndex}_letter-${letterIndex}`;

          if (!letter || letter == " ") {
            return (
              <span key={key + "parent"} className={styles.inlineBlock}>
                <span className={styles.singleWord} data-key={key} key={key}>
                  &nbsp;
                </span>
              </span>
            );
          }

          return (
            <span
              className={[styles.inlineBlock, highlight].join(" ")}
              onClick={onClickHandler}
              key={key}
            >
              <input
                type="text"
                className={styles.singleInput}
                name={key}
                data-key={key}
                value={milikit[key] || ""}
                onChange={onMilikitChangeHandler}
              />
              <span className={styles.singleWord} data-key={key}>
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

  useEffect(() => {
    const intervalId = setInterval(() => {
      //console.log("running");
      const formId = document.getElementById("content");
      submit(formId);
      setSnackOpen(true);
    }, 120000);

    return () => clearInterval(intervalId); //This is important
  }, []);

  return (
    <Form method="POST" id="content">
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackOpen}
        onClose={handleClose}
        message="ረቂቁ ተቀምጧል!"
        autoHideDuration={5000}
      />

      <div className={layout}>
        {data.map((item, index) => {
          return (
            <div
              key={index + "div"}
              id={item.title}
              className={item.title == params.highlight ? "highlighted" : ""}
            >
              <h2 key={index + "h2"} className={styles.title}>
                {item.title} <span className="house">{item.house}</span>
              </h2>
              <p key={index + "p"} className={styles.paragraph}>
                {element[index]}
              </p>

              <p key={index + "dn"} className={styles.readings}>
                ዲ.ን.: {item.paul}
              </p>
              <p key={index + "2nddn"} className={styles.readings}>
                ንፍቅ ዲ.ን.: {item.meliekt}
              </p>
              <p key={index + "2ndpr"} className={styles.readings}>
                ንፍቅ ካህን: {item.gh}
              </p>
              <p key={index + "wengel"} className={styles.readings}>
                ወንጌል: {item.wengel}
              </p>
              <p key={index + "kidase"} className={styles.readings}>
                ቅዳሴ: {item.kidase}
              </p>
            </div>
          );
        })}
        <br />
        <Button
          className="padding margin center"
          type="submit"
          onClick={openSnack}
        >
          <AddOutlined /> <h2>Save</h2>
        </Button>
        <br />
      </div>
    </Form>
  );
}

export default Editor;

export async function loader({ params }) {
  const data = await import(`../data/${params.week}/${params.day}.json`);

  const res = await fetch(
    `http://localhost:8080/data/${params.week}/${params.day}.sign.json`,
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
  const signData = await res.json();

  //TODO: toggle the return statements for production
  return { sign: signData, data: data.default }; //dev

  // const sign = await import(`../data/${params.week}/${params.day}.sign.json`);
  // return { sign: sign.default, data: data.default }; //prod
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const postData = Object.fromEntries(formData);

  console.log("in update Action", postData);
  return fetch("http://localhost:8080/save", {
    method: "POST",
    body: JSON.stringify({
      name: `${params.week}/${params.day}.sign.json`,
      json: postData,
    }),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
