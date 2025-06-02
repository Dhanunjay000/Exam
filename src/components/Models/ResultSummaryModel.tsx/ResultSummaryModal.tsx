import React from 'react';
import styles from './ResultSummaryModal.module.css'; // your existing styles

interface ResultSummaryModalProps {
  results: {
    ans: number;
    unans: number;
    crct: number;
    incrct: number;
    submitted_date: number;
    total:number;
    subject:string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const ResultSummaryModal: React.FC<ResultSummaryModalProps> = ({ results, isOpen, onClose }) => {
  if (!isOpen) return null;
  console.log(results);
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
      <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Quiz Summary</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>

        <div className={styles.sidebar}>

        <div className={styles.subjectHeader}>
            <div className={styles.subjectLabel}>Subject</div>
            <div className={styles.subjectName}>{results.subject}</div>
            <div className={styles.dateTime}>Attempted Date: {new Date(results.submitted_date).toLocaleString()}</div>
            <div className={styles.totalQuestions}>Total questions: {results.total}</div>
          </div>
          <div className={styles["summary-grid"]}>
            <div className={`${styles["summary-card"]} ${styles.answered}`}>
              <h5>Answered</h5>
              <p className={styles.value}>{results.ans}</p>
            </div>

            <div className={`${styles["summary-card"]} ${styles.unanswered}`}>
              <h5>Unanswered</h5>
              <p className={styles.value}>{results.unans}</p>
            </div>

            <div className={`${styles["summary-card"]} ${styles.correct}`}>
              <h5>Correct Answers</h5>
              <p className={styles.value}>{results.crct}</p>
            </div>

            <div className={`${styles["summary-card"]} ${styles.incorrect}`}>
              <h5>Incorrect Answers</h5>
              <p className={styles.value}>{results.incrct}</p>
            </div>

            <div className={`${styles["summary-card"]} ${styles.total}`}>
              <h5>Total Marks</h5>
              <p className={styles.value}>
                {results.crct} / {results.total}
              </p>
            </div>

            <div className={`${styles["summary-card"]} ${styles.percentage}`}>
              <h5>Percentage</h5>
              <p className={styles.value}>{((results.crct / results.total) * 100)}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultSummaryModal;
