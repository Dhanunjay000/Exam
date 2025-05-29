import React, { useEffect, useState } from 'react';
import styles from './DashboardComponent.module.css';
import { FaEye } from 'react-icons/fa';
import { useRouter } from 'next/router';
import SpinnerComponent from '../common/spinner/SpinnerComponent';
import MessageModel from '../Models/MessageModel';
import HeaderComponent from '../Header/HeaderComponent';

interface ExamResult {
  sno: number;
  subjectName: string;
  totalMarks: number;
  submittedOn: string;
  achievedMarks: number;
  examId: string;
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [showModel, setShowModel] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<string>("");
  const [results, setResults] = useState<ExamResult[]>([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      // Sample data instead of API call
      const sampleResults = [
        {
          sno: 1,
          subjectName: "Mathematics",
          totalMarks: 100,
          submittedOn: new Date("2023-05-15").toLocaleDateString(),
          achievedMarks: 85,
          examId: "math-2023-001"
        },
        {
          sno: 2,
          subjectName: "Physics",
          totalMarks: 100,
          submittedOn: new Date("2023-05-18").toLocaleDateString(),
          achievedMarks: 78,
          examId: "phy-2023-001"
        },
        {
          sno: 3,
          subjectName: "Chemistry",
          totalMarks: 100,
          submittedOn: new Date("2023-05-20").toLocaleDateString(),
          achievedMarks: 92,
          examId: "chem-2023-001"
        },
        {
          sno: 4,
          subjectName: "Biology",
          totalMarks: 100,
          submittedOn: new Date("2023-05-22").toLocaleDateString(),
          achievedMarks: 88,
          examId: "bio-2023-001"
        },
        {
          sno: 5,
          subjectName: "Computer Science",
          totalMarks: 100,
          submittedOn: new Date("2023-05-25").toLocaleDateString(),
          achievedMarks: 95,
          examId: "cs-2023-001"
        }
      ];
      
      setResults(sampleResults);
    } catch (error) {
      setMessage("Something went wrong");
      setMessageType("error");
      setShowModel(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (examId: string) => {
    router.push(`/results/${examId}`);
  };

  return (
    <>
    <HeaderComponent/>
    <div className={styles.dashboardContainer}>
    {loading && <SpinnerComponent />}

      <div className={styles.header}>
        <h1>Exam Results Dashboard</h1>
        <p>View and analyze your exam performance</p>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.resultsTable}>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Subject Name</th>
              <th>Total Marks</th>
              <th>Submitted On</th>
              <th>Achieved Marks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.examId}>
                <td>{result.sno}</td>
                <td>{result.subjectName}</td>
                <td>{result.totalMarks}</td>
                <td>{result.submittedOn}</td>
                <td>{result.achievedMarks}</td>
                <td>
                  <button
                    className={styles.previewButton}
                    onClick={() => handlePreview(result.examId)}
                    title="Preview Result"
                  >
                    <FaEye /> Preview
                  </button>
                </td>
              </tr>
            ))}
            {results.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.noData}>
                  No exam results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModel && (
        <MessageModel
          message={message}
          type={messageType}
          onClose={() => {
            setShowModel(false);
            setMessage("");
          }}
        />
      )}
    </div>
    </>
  );
};

export default Dashboard;