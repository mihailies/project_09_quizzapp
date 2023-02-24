import { QuestionData } from "../App";

interface QuestionProps {
    questionData: QuestionData;
    inGame: boolean;
    answerOnClick: (questionId: number, answerId: number) => void;
    id: number;
}

export function Question(props: QuestionProps) {
    let questionData: QuestionData = props.questionData;
    let inGame: boolean = props.inGame;
    let answers = questionData.answers.map((ans, idx) => {
        let extraClass = "";
        if (inGame) {
            if (questionData.playerAnswer == idx) extraClass += " selected";
        } else {
            extraClass = " disabled";
            if (idx == questionData.correctAnswer) {
                extraClass = " correct";
            }
            if (idx == questionData.playerAnswer && !(idx == questionData.correctAnswer)) {
                extraClass = " wrong";
            }
        }
        return <div onClick={() => {
            props.answerOnClick(props.id, idx)
        }}
            className={"button-answers" + extraClass} key={ans + " " + idx}
            dangerouslySetInnerHTML={{ __html: ans }}>
        </div>
    })
    answers.push(<div key={"last"}
        style={{ marginLeft: "10px", borderLeft: "1px solid #ccc", padding: "5px" }}
        dangerouslySetInnerHTML={{ __html: questionData.answers[questionData.correctAnswer] }}
    >
    </div>)

    return <div className="question-container">
        <h4 dangerouslySetInnerHTML={{ __html: questionData.question }}></h4>
        <div style={{ display: "flex" }}>
            {answers}
        </div>
    </div>

}