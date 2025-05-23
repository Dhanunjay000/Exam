import React, { useEffect, useState } from 'react';
import styles from './ExamForm.module.css';
import ConfirmationModal from '../Models/ConfirmationModel';
import { useRouter } from 'next/router';
import MessageModel from '../Models/MessageModel';
import CountdownTimer from './CountdownTimer';
import SpinnerComponent from '../common/spinner/SpinnerComponent';

interface ExamLayoutProps {
  subject: any;
  answeredQuestions: number;
  userName: string;
  timeRemaining: string;
}

interface Question_type {
  id: number;
  question: string;
  options: string[];
}

const ExamLayout: React.FC<ExamLayoutProps> = ({
  subject,
  userName,
  timeRemaining
}) => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [questions, setQuestions] = useState<Question_type[]>([]);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [questionData, setQuestionData] = useState<any[]>([]);
  const [showModel, setShowModel] = useState<boolean>(false);
  const [fullScreen, setFullScreen] = useState<boolean>(true);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [showMsgModel, setShowMsgModel] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<string>(""); 
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetch_questions = async () => {
      if (!subject)
        router.push('/subjects');
      try {
        const response = await fetch(`/api/questions?subject=${subject}&valid=${true}`);
        const data = await response.json();
        setQuestions(data);
        setTotalQuestions(data.length)
      }
      catch (error:any) {
        console.error("Error during fetchig ", error.message);
      }
      finally{
        setLoading(false);
      }
    }
    if (totalQuestions == 0)
    { setLoading(true)
      fetch_questions();
    }
  }, [subject, totalQuestions]);

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value);
  };

  useEffect(() => {
    var existingQuestion = questionData.find(q => q.question_no === currentQuestion)
    if (existingQuestion) {
      setSelectedOption(existingQuestion.ans)
    }
  }, [currentQuestion])

  const handlePrevious = () => {
    if (currentQuestion >= 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption("");
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption("");
    }
  };

  const handleSave = () => {
    if (selectedOption != '') {
      const updateData = {
        question_no: currentQuestion,
        ans: selectedOption
      };
      setQuestionData((prev) => {
        const existingQuestion = prev.find(q => q.question_no == currentQuestion);
        if (existingQuestion) {
          return prev.map(q => q.question_no == currentQuestion ? updateData : q)
        }
        else
          return [...prev, updateData];
      });
      if (currentQuestion < totalQuestions - 1) {
        setSelectedOption("");
        setCurrentQuestion(currentQuestion + 1);
      }
    }
    else {
      setMessage('Please select an option to save');
      setMessageType("error");
      setShowMsgModel(true);
    }
  };
  const submitAnswers = () => {
    const formattedData = questionData.map(item => ({
      [item.question_no]: item.ans
    }));
    sessionStorage.setItem('questionData', JSON.stringify(formattedData));
    router.push('/results');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitAnswers();
  };

  const handleComplete = () => {
    setMessage('Time is up. Your answers have been auto-submitted for evaluation.');
    setMessageType("error");
    setShowMsgModel(true);
    setTimeout(() => {
      submitAnswers();
    }, 3000);
  };

  const renderProgressCards = () => {
    const cards = [];
    for (let i = 0; i < totalQuestions; i++) {
      var answered = questionData.find(q => q.question_no == i)
      const isAnswered = answered?.ans;
      cards.push(
        <button
          key={i}
          className={`${styles.card} ${isAnswered ? styles.answered : styles.unanswered}`}
          onClick={() => setCurrentQuestion(i)}
        >
          {i + 1}
        </button>
      );
    }
    return cards;
  };
  const goFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
      setFullScreen(false);
    }
  };
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Esc') {
        setErrorCount((prev) => prev + 1);
      }
    };
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setErrorCount((prev) => prev + 1);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (errorCount > 0) {
      if (errorCount >= 3) {
        setMessage('You have run out of chances. Redirecting...');
        setMessageType("error");
        setShowMsgModel(true);
        setTimeout(() => {
          router.push('/subjects');
        }, 2000);
      } else {
        setMessage(`You are exiting fullscreen. You have ${3 - errorCount} chances left. Please stay in fullscreen to continue the exam.`);
        setMessageType("error");
        setShowMsgModel(true);
        setFullScreen(true);
      }
    }
  }, [errorCount]);


  return (
    <>
       { loading && <SpinnerComponent />}
      {questions.length > 0 && (
        <>
          <div className={styles.container}>
            <div className={styles['main-content']}>
              <div className={styles['question-text']}>
                Question {currentQuestion + 1}: {questions[currentQuestion].question}
              </div>
              {showModel && (
                <ConfirmationModal
                  message="Please make sure all answers are saved before submitting. Are you sure you want to submit the exam?"
                  onConfirm={handleSubmit}
                  onCancel={() => setShowModel(false)}
                />
              )}
              {fullScreen && (
                <ConfirmationModal
                  message="The exam must be taken in full-screen mode. Please confirm to continue. Otherwise, the exam will be terminated."
                  onConfirm={goFullScreen}
                  onCancel={() => router.push("/subjects")}
                />
              )}
              {showMsgModel && <MessageModel message={message} type={messageType} onClose={() => { setShowMsgModel(false); setMessage("") }} />}

              <form onSubmit={handleSubmit}>
                {questions[currentQuestion].options.map((option, index) => (
                  <div key={index} className={styles['option-group']}>
                    <input
                      type="radio"
                      id={`option${index}`}
                      name="exam-option"
                      value={option}
                      checked={selectedOption === option || questionData[currentQuestion]?.ans === option && selectedOption == ''}
                      onChange={handleOptionChange}
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
                  <button
                    type="button"
                    className={`${styles.btn} ${styles['btn-save']}`}
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
            <div className={styles.sidebar}>
              <div className={styles['sidebar-top']}>
                <h2>{userName}</h2>
                <p>Time Remaining: <CountdownTimer duration={160} onComplete={handleComplete} /> </p>
              </div>
              <div className={styles['sidebar-bottom']}>
                <h3>Progress</h3>
                <div className={styles['progress-cards']}>
                  {renderProgressCards()}
                </div>
              </div>
            </div>
          </div>
          <div className={styles['sbmt-container']}>
            <div className={styles['sbmt-btn-container']}>
              <button
                type="button"
                className={`${styles.btn} ${styles['btn-submit']}`}
                onClick={() => setShowModel(true)}
              >
                Submit Exam
              </button>
            </div>
          </div>
        </>

      )}

    </>
  );
};

export default ExamLayout;
