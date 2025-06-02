import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './ResultsCard.module.css'
import { useRouter } from 'next/router';
import HeaderComponent from '../Header/HeaderComponent';
import Cookies from 'js-cookie';
import MessageModel from '../Models/MessageModel';
import { CheckCircleOutline } from '@mui/icons-material';

interface ResultsPageProps {
  correctAnswers?: number;
  incorrectAnswers?: number;
  totalQuestions?: number;
}
interface Question_type {
  [key: number]: string;
  id: number;
  question: string;
  options: string[];
  answer: string
}

const username = Cookies.get("username");
const ResultsCard: React.FC<ResultsPageProps> = ({ }) => {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question_type[]>([]);
  const [submittedData, setSubmittedData] = useState<Question_type[]>([]);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [subject, setSubject] = useState<string | null>("");
  const [results, setResults] = useState({
    answered: 0,
    unAnswered: 0,
    correctAns: 0,
    inCorrectAns: 0,
    percentage: 0,
  });
  const [showMsgModel, setShowMsgModel] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<string>("");



  useEffect(() => {
    const result: string | null = sessionStorage.getItem('questionData');
    const subject_name = sessionStorage.getItem("subject");
    setSubject(subject_name)
    if (result) {
      var data = JSON.parse(result);
      setSubmittedData(data);
    }
  }, []);

  const fetch_questions = async () => {
    if (!subject)
      router.push('/subjects');
    try {
      const response = await fetch(`/api/questions?subject=${subject}&valid=${false}`);
      const data = await response.json();
      setQuestions(data);
      setTotalQuestions(data.length)
    }
    catch (error) {
      console.error("Error during fetchig ", error);
    }
    sessionStorage.clear();
  }
  useEffect(() => {
    if (subject)
      fetch_questions();
  }, [subject ]);

  useEffect(() => {
    if (questions.length > 0) {
      var answered = submittedData.length;
      var unAnswered = totalQuestions - answered;
      var correctAns = 0;
      questions.map((item, index) => {
        if ((submittedData.find(obj => obj.hasOwnProperty(index))?.[index]) == item.answer)
          correctAns = correctAns + 1;
      })
      var inCorrectAns = answered - correctAns;
      const percentage = parseFloat(((correctAns / totalQuestions) * 100).toFixed(2));
      setResults({ answered, unAnswered, correctAns, inCorrectAns, percentage });
    }
  }, [questions])

  useEffect(() => {
    if (results && subject) {
      submitResults();
    }
  }, [results])

  const submitResults = async () => {
    try {
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          subject,
          total: totalQuestions,
          ans: results.answered,
          unans: results.unAnswered,
          crct: results.correctAns,
          incrct: results.inCorrectAns,
        }),
      });
      setShowMsgModel(true)
      if (response.ok) {
        setMessage('Submission successful');
        setMessageType('success');
      } else {
        setMessage('Submission failed');
        setMessageType('error');
      }
    } catch (error) {
      setShowMsgModel(true)
      setMessage('Error submitting results');
      setMessageType('error');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion >= 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  const handleClick = () => {
    sessionStorage.clear();
    router.push("/dashboard");
  }
  return (
    <>
      <HeaderComponent />
      {showMsgModel && <MessageModel message={message} type={messageType} onClose={() => { setShowMsgModel(false); setMessage("") }} />}
      {questions.length > 0 && (
        <>
          <div className={styles.container}>
            <div className={styles['main-content']}>
              <div className={styles['question-text']}>
                Question {currentQuestion + 1}: {questions[currentQuestion].question}
              </div>
              <form >
                {questions[currentQuestion].options.map((option, index) => (
                  <>
                  <div key={index} 
                       style={{ cursor: "not-allowed" }}
                       className={`
                        ${styles['option-group']}
                        ${
                          questions[currentQuestion]?.answer === option
                            ? styles['selected']
                            : submittedData.find(obj => obj.hasOwnProperty(currentQuestion))?.[currentQuestion] === option
                              ? styles['incorrectAns'] 
                              : ''
                        }
                      `}
                      > 
                    <input
                      type="radio"
                      id={`option${index}`}
                      name="exam-option"
                      value={option}
                      checked={submittedData.find(obj => obj.hasOwnProperty(currentQuestion))?.[currentQuestion] == option}
                    />
                    <label htmlFor={`option${index}`} className={styles['option-label']}>
                      {option}
                    </label>
                  </div>
                  </>
                ))}

                {/* Button group with Previous, Next, and Save */}
                <div className={styles['button-group']}>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles['btn-previous']}`}
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles['btn-next']}`}
                    onClick={handleNext}
                    disabled={currentQuestion === totalQuestions - 1}
                  >
                    Next
                  </button>
                </div>
              </form>
            </div>
            <div className={styles.sidebar}>
              <h4>Quiz Summary</h4>

              <div className={styles["summary-grid"]}>
                <div className={`${styles["summary-card"]} ${styles.answered}`}>
                  <h5>Answered</h5>
                  <p className={styles.value}>{results.answered}</p>
                </div>

                <div className={`${styles["summary-card"]} ${styles.unanswered}`}>
                  <h5>Unanswered</h5>
                  <p className={styles.value}>{results.unAnswered}</p>
                </div>

                <div className={`${styles["summary-card"]} ${styles.correct}`}>
                  <h5>Correct Answers</h5>
                  <p className={styles.value}>{results.correctAns}</p>
                </div>

                <div className={`${styles["summary-card"]} ${styles.incorrect}`}>
                  <h5>Incorrect Answers</h5>
                  <p className={styles.value}>{results.inCorrectAns}</p>
                </div>

                <div className={`${styles["summary-card"]} ${styles.total}`}>
                  <h5>Total Marks</h5>
                  <p className={styles.value}>
                    {results.correctAns} / {totalQuestions}
                  </p>
                </div>

                <div className={`${styles["summary-card"]} ${styles.percentage}`}>
                  <h5>Percentage</h5>
                  <p className={styles.value}>{results.percentage}%</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles['sbmt-container']}>
            <div className={styles['sbmt-btn-container']}>
              <button
                type="button"
                className={`${styles.btn} ${styles['btn-submit']}`}
                onClick={handleClick}
              >
                Finish Review
              </button>
            </div>
          </div>
        </>

      )}
    </>
  );
};

export default ResultsCard;
