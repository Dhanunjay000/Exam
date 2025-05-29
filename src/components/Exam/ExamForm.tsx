"use client"

import type React from "react"
import { useEffect, useState } from "react"
import styles from "./ExamForm.module.css"
import ConfirmationModal from "../Models/ConfirmationModel"
import { useRouter } from "next/router"
import MessageModel from "../Models/MessageModel"
import CountdownTimer from "./CountdownTimer"
import SpinnerComponent from "../common/spinner/SpinnerComponent"

interface ExamLayoutProps {
  subject: any
  answeredQuestions: number
  userName: string
  timeRemaining: string
}

interface Question_type {
  id: number
  question: string
  options: string[]
}

const ExamLayout: React.FC<ExamLayoutProps> = ({ subject, userName, timeRemaining }) => {
  const router = useRouter()
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [questions, setQuestions] = useState<Question_type[]>([])
  const [totalQuestions, setTotalQuestions] = useState<number>(0)
  const [questionData, setQuestionData] = useState<any[]>([])
  const [showModel, setShowModel] = useState<boolean>(false)
  const [fullScreen, setFullScreen] = useState<boolean>(true)
  const [errorCount, setErrorCount] = useState<number>(0)
  const [showMsgModel, setShowMsgModel] = useState(false)
  const [message, setMessage] = useState<string>("")
  const [messageType, setMessageType] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetch_questions = async () => {
      if (!subject) router.push("/subjects")
      try {
        const response = await fetch(`/api/questions?subject=${subject}&valid=${true}`)
        const data = await response.json()
        setQuestions(data)
        setTotalQuestions(data.length)
      } catch (error: any) {
        console.error("Error during fetchig ", error.message)
      } finally {
        setLoading(false)
      }
    }
    if (totalQuestions == 0) {
      setLoading(true)
      fetch_questions()
    }
  }, [subject, totalQuestions])

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value)
  }

  useEffect(() => {
    var existingQuestion = questionData.find((q) => q.question_no === currentQuestion)
    if (existingQuestion) {
      setSelectedOption(existingQuestion.ans)
    }
  }, [currentQuestion])

  const handlePrevious = () => {
    if (currentQuestion >= 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedOption("")
    }
  }

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption("")
    }
  }

  const handleSave = () => {
    if (selectedOption != "") {
      const updateData = {
        question_no: currentQuestion,
        ans: selectedOption,
      }
      setQuestionData((prev) => {
        const existingQuestion = prev.find((q) => q.question_no == currentQuestion)
        if (existingQuestion) {
          return prev.map((q) => (q.question_no == currentQuestion ? updateData : q))
        } else return [...prev, updateData]
      })
      if (currentQuestion < totalQuestions - 1) {
        setSelectedOption("")
        setCurrentQuestion(currentQuestion + 1)
      }
    } else {
      setMessage("Please select an option to save")
      setMessageType("error")
      setShowMsgModel(true)
    }
  }
  const submitAnswers = () => {
    const formattedData = questionData.map((item) => ({
      [item.question_no]: item.ans,
    }))
    sessionStorage.setItem("questionData", JSON.stringify(formattedData))
    router.push("/results")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitAnswers()
  }

  const handleComplete = () => {
    setMessage("Time is up. Your answers have been auto-submitted for evaluation.")
    setMessageType("error")
    setShowMsgModel(true)
    setTimeout(() => {
      submitAnswers()
    }, 3000)
  }

  const renderProgressCards = () => {
    const cards = []
    for (let i = 0; i < totalQuestions; i++) {
      var answered = questionData.find((q) => q.question_no == i)
      const isAnswered = answered?.ans
      cards.push(
        <button
          key={i}
          className={`${styles.card} ${isAnswered ? styles.answered : styles.unanswered}`}
          onClick={() => setCurrentQuestion(i)}
        >
          {i + 1}
        </button>,
      )
    }
    return cards
  }
  const goFullScreen = () => {
    const elem = document.documentElement
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
      setFullScreen(false)
    }
  }
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Esc") {
        setErrorCount((prev) => prev + 1)
      }
    }
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setErrorCount((prev) => prev + 1)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  useEffect(() => {
    if (errorCount > 0) {
      if (errorCount >= 3) {
        setMessage("You have run out of chances. Redirecting...")
        setMessageType("error")
        setShowMsgModel(true)
        setTimeout(() => {
          router.push("/subjects")
        }, 2000)
      } else {
        setMessage(
          `You are exiting fullscreen. You have ${3 - errorCount} chances left. Please stay in fullscreen to continue the exam.`,
        )
        setMessageType("error")
        setShowMsgModel(true)
        setFullScreen(true)
      }
    }
  }, [errorCount])

  return (
    <>
      {loading && <SpinnerComponent />}
      {questions.length > 0 && (
        <>
          <div className={styles.examContainer}>
            {document.fullscreenElement && (
              <div className={styles.exitHint}>
                To exit full screen, press <span className={styles.escKey}>Esc</span>
              </div>
            )}

            <div className={styles.examLayout}>
              <div className={styles.questionSection}>
                <div className={styles.questionCard}>
                  <div className={styles.questionHeader}>
                    <h2 className={styles.questionTitle}>
                      Question {currentQuestion + 1}: {questions[currentQuestion].question}
                    </h2>
                  </div>

                  <div className={styles.optionsContainer}>
                    {questions[currentQuestion].options.map((option, index) => (
                      <label key={index} className={styles.optionLabel}>
                        <input
                          type="radio"
                          id={`option${index}`}
                          name="exam-option"
                          value={option}
                          checked={
                            selectedOption === option ||
                            (questionData[currentQuestion]?.ans === option && selectedOption === "")
                          }
                          onChange={handleOptionChange}
                          className={styles.optionInput}
                        />
                        <span className={styles.optionText}>{option}</span>
                      </label>
                    ))}
                  </div>

                  <div className={styles.navigationButtons}>
                    <button
                      type="button"
                      className={`${styles.navButton} ${styles.previousButton}`}
                      onClick={handlePrevious}
                      disabled={currentQuestion === 0}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      className={`${styles.navButton} ${styles.nextButton}`}
                      onClick={handleNext}
                      disabled={currentQuestion === totalQuestions - 1}
                    >
                      Next
                    </button>
                    <button type="button" className={`${styles.navButton} ${styles.saveButton}`} onClick={handleSave}>
                      Save
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.sidebar}>
                <div className={styles.userInfoCard}>
                  <div className={styles.userEmail}>{userName}</div>
                  <div className={styles.timerSection}>
                    <div className={styles.timerLabel}>Time Remaining:</div>
                    <div className={styles.timerValue}>
                      <CountdownTimer duration={160} onComplete={handleComplete} />
                    </div>
                  </div>
                </div>

                <div className={styles.progressCard}>
                  <h3 className={styles.progressTitle}>Progress</h3>
                  <div className={styles.questionGrid}>
                    {Array.from({ length: totalQuestions }).map((_, i) => {
                      const isAnswered = questionData.find((q) => q.question_no === i)
                      const isCurrent = currentQuestion === i
                      return (
                        <button
                          key={i}
                          className={`${styles.questionNumber} ${
                            isCurrent ? styles.current : isAnswered ? styles.answered : styles.unanswered
                          }`}
                          onClick={() => setCurrentQuestion(i)}
                        >
                          {i + 1}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <button type="button" className={styles.submitButton} onClick={() => setShowModel(true)}>
                  Submit Exam
                </button>
              </div>
            </div>
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

          {showMsgModel && (
            <MessageModel
              message={message}
              type={messageType}
              onClose={() => {
                setShowMsgModel(false)
                setMessage("")
              }}
            />
          )}
        </>
      )}
    </>
  )
}

export default ExamLayout
