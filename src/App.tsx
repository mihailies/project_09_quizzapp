import { useState } from "react"
import { Question } from "./components/Question";
import "./styles/main.scss"


export interface QuestionDataServer {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
}

export interface QuestionData {
  question: string;
  answers: string[];
  correctAnswer: number;
  playerAnswer: number;
}

function shuffleArray(ar: any[]): any[] {
  var n: number = ar.length, i, t;
  while (n) {
    i = Math.floor(Math.random() * n--);
    t = ar[n];
    ar[n] = ar[i];
    ar[i] = t;
  }
  return ar;
}

function parseQuestionsData(questionsData: QuestionDataServer[]) {
  return questionsData.map((qd) => {
    let incorrectAnswers: string[] = (qd.incorrect_answers as []).map((v) => v);
    incorrectAnswers.push(qd.correct_answer);
    let answers: string[] = shuffleArray(incorrectAnswers);
    let resq: QuestionData = {
      question: qd.question,
      answers: answers,
      correctAnswer: answers?.indexOf(qd.correct_answer),
      playerAnswer: -1
    }
    return resq;
  })
}

async function getQuestions(): Promise<any> {
  try {
    let response = await fetch("https://opentdb.com/api.php?amount=5&category=9&difficulty=easy");
    return await response.json();
  } catch (e) {
    console.log("Error fetchng questions.");
    console.log(e);
  }
}

export default function App() {
  const [inGame, setInGame] = useState(false);
  const [questions, setQuestions] = useState(() => {
    let qs: QuestionData[] = []
    return qs;
  })
  const [gameResultText, setGameResultText] = useState("");
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  function startGame() {
    setInGame(true);
    setQuestions([]);
    setLoadingQuestions(true);
    let qs: Promise<any> = getQuestions();
    qs.then((data) => {
      console.log(data.results);
      setLoadingQuestions(false);
      setQuestions(() => parseQuestionsData(data.results as QuestionDataServer[]));
    })
  }

  let questionsElements = questions.map((q, idx) =>
    <Question key={idx} id={idx} questionData={q} inGame={inGame} answerOnClick={answerClick} />
  )


  function answerClick(questionId: number, answerId: number) {
    setQuestions((old) => {
      return old.map((qs, idx) => {
        return { ...qs, playerAnswer: questionId == idx ? answerId : qs.playerAnswer };
      })
    })
  }

  function checkAnswers() {
    let correct: number = 0;
    questions.forEach((q) => {
      if (q.correctAnswer == q.playerAnswer) correct++;
    })
    setGameResultText("You scored " + correct + "/" + questions.length + " correct answers.")
    setInGame(false);
  }


  return (
    <main>
      {loadingQuestions ?
        <div className="preloader-container">
          <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        </div> : ""
      }
      {!inGame && !questions.length ? (
        <div className="welcome-screen" >
          <h1>Quizzical </h1>
          <div>Chose the right answers to test your knowoledge.</div>
          <div className="button" onClick={() => startGame()}> Start quiz </div>
        </div>
      ) : (
        <div className="questions-screen">
          {questionsElements}
          {inGame ? (
            !loadingQuestions ? <div className="button" onClick={() => checkAnswers()} >Check answers</div> : <></>
          ) : (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <div className="game-result-text">{gameResultText}</div>
              <div className="button" onClick={() => startGame()} >Play again</div>
            </div>
          )}
        </div>
      )
      }
    </main >
  );

}