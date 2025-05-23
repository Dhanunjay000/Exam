import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './ResultsCard.module.css'
import { useRouter } from 'next/router';
import HeaderComponent from '../Header/HeaderComponent';

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

const ResultsCard: React.FC<ResultsPageProps> = ({ }) => {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question_type[]>([]);
  const [submittedData, setSubmittedData] = useState<Question_type[]>([]);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [results, setResults] = useState({
    answered: 0,
    unAnswered: 0,
    correctAns: 0,
    inCorrectAns: 0,
    percentage: 0,
  });


  useEffect(() => {
    const result: string | null = sessionStorage.getItem('questionData');
    if (result) {
      var data = JSON.parse(result);
      setSubmittedData(data);
    }
    const subject = sessionStorage.getItem("subject");
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
    fetch_questions();
  }, []);

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
    router.push("/subjects");
  }
  return (
    <>
   <HeaderComponent
          />
      {questions.length > 0 && (
        <>
          <div className={styles.container}>
            <div className={styles['main-content']}>
              <div className={styles['question-text']}>
                Question {currentQuestion + 1}: {questions[currentQuestion].question}
              </div>

              <form >
                {questions[currentQuestion].options.map((option, index) => (
                  <div key={index} className={`${styles['option-group']} ${questions[currentQuestion]?.answer == option ? styles['selected'] : ''}`} style={{ cursor: "not-allowed" }}>
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
              <div className="card-body">
                <h4 className="card-title mb-4">Quiz Summary</h4>
                <div className="row text-center">
                  <div className="col-md-6 mb-4">
                    <div className="p-3 bg-primary text-white rounded">
                      <h5>Answered</h5>
                      <p className="fs-4">{results.answered}</p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="p-3 bg-warning text-dark rounded">
                      <h5>Unanswered</h5>
                      <p className="fs-4">{results.unAnswered}</p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="p-3 bg-success text-white rounded">
                      <h5>Correct Answers</h5>
                      <p className="fs-4">{results.correctAns}</p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="p-3 bg-danger text-white rounded">
                      <h5>Incorrect Answers</h5>
                      <p className="fs-4">{results.inCorrectAns}</p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="p-3 bg-info text-dark rounded">
                      <h5>Total Marks</h5>
                      <p className="fs-4">{results.correctAns} / {totalQuestions}</p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="p-3 bg-secondary text-white rounded">
                      <h5>Percentage</h5>
                      <p className="fs-4">{results.percentage}%</p>
                    </div>
                  </div>

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
