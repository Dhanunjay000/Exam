import React, { useEffect, useState } from 'react';
import styles from './DashboardComponent.module.css';
import SpinnerComponent from '../common/spinner/SpinnerComponent';
import MessageModel from '../Models/MessageModel';
import HeaderComponent from '../Header/HeaderComponent';
import Cookies from 'js-cookie';
import { Pie } from 'react-chartjs-2';
import { TableColumn } from 'react-data-table-component';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import DataTableComponent from '../common/DataTable/DataTableComponent';
import ResultSummaryModal from '../Models/ResultSummaryModel.tsx/ResultSummaryModal';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ExamResult {
  sno: number;
  subject: string;
  total: number;
  submitted_date: string;
  crct: number;
  _id: string;
  index: number;
}

interface SubjectProps {
  icon: string;
  title: string;
  description: string;
  color: string;
  level: string;
  rating: number;
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [showModel, setShowModel] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<string>("");
  const [results, setResults] = useState<ExamResult[]>([]);
  const [username, setUsername] = useState<string>("");
  const [subjects, setSubjects] = useState<SubjectProps[]>();
  const [filteredData, setFilteredData] = useState<ExamResult[]>(results);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [selectedResult, setSelectedResult] = useState<any>();

  useEffect(() => {
    setFilteredData(results);
  }, [results]);

  const handleSearch = (searchText: string) => {
    const filtered = results.filter(item =>
      item.subject.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const columns: TableColumn<ExamResult>[] = [
    {
      name: 'S.No',
      cell: (_row, index) => index + 1,
      width: '70px',
      sortable: false,
    },
    {
      name: 'Subject Name',
      selector: row => row.subject,
      sortable: true,
    },
    {
      name: 'Total Marks',
      selector: row => row.total,
      sortable: true,
    },
    {
      name: 'Achieved Marks',
      selector: row => row.crct,
      sortable: true,
    },
    {
      name: 'Submitted On',
      selector: row =>
        new Date(row.submitted_date).toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <button
          className={styles.actionButton}
          onClick={() => handlePreview(row)}
          title="Preview Result"
        >
          Preview
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  useEffect(() => {
    const result = Cookies.get("username");
    if (result) {
      setUsername(username);
      fetchResults(result);
    }
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch("/api/subjects");
        if (res.ok) {
          const data = await res.json();
          setSubjects(data);
        }

      }
      catch (error) {
        console.error("Failed to fetch subjects:", error);
      }
      finally {
        setLoading(false);
      }
    }
    setLoading(true);
    fetchSubjects();
  }, [])


  const fetchResults = async (username: string) => {
    try {
      const response = await fetch(`api/results?username=${username}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      setMessage("Something went wrong");
      setMessageType("error");
      setShowModel(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (ResultRow: ExamResult) => {
    setSelectedResult(ResultRow);
    setShowResultModal(true);
  };

  const filteredResults: ExamResult[] = Object.values(
    results.reduce((acc: any, curr) => {
      const subj = curr.subject;
      if (!acc[subj] || curr.crct > acc[subj].crct) {
        acc[subj] = curr;
      }
      return acc;
    }, {})
  );

  const pieChartData = {
    labels: filteredResults.map((r) => r.subject),
    datasets: [
      {
        label: 'Max Achieved Marks',
        data: filteredResults.map((r) => r.crct),
        backgroundColor: [
          '#FF6384', // Red-pink
          '#36A2EB', // Blue
          '#FFCE56', // Yellow
          '#4BC0C0', // Teal
          '#9966FF', // Purple
          '#FF9F40', // Orange
          '#8AC249', // Green
          '#EA5F89', // Dark pink
          '#00BFFF', // Deep sky blue
          '#FFD700', // Gold
          '#32CD32', // Lime green
          '#BA55D3', // Medium orchid
          '#FF6347', // Tomato
        ],
      },
    ],
  };

  const UpcomingExams = () => {
    return (
      <div className={styles['exam-card']}>
        <div className={styles['exam-header']}>
          <a href="/subjects" className={styles['browse-link']}>
            Browse All Subjects
          </a>
        </div>
        {subjects?.slice(0, 4).map((subj) => (
          <div className={styles['exams-list']}>
            <div className={styles['exam-item']}>
              <div className={styles['exam-item-header']}>
                <div>
                  <div className={styles['exam-name']}>
                    {subj.title}
                    <span className={`${styles['difficulty-badge']} ${styles[subj.level]}`}>
                      {subj.level}
                    </span>
                  </div>
                  <div className={styles['exam-details']}>{subj.rating}  ⭐</div>
                </div>
                <img src={subj.icon}></img>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <HeaderComponent />
      <div className={styles.dashboardContainer}>
        {loading && <SpinnerComponent />}
        <div className={styles.dashboardHeader}>
          <div className={styles.sparklesDecoration}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
              <path d="M5 3v4"></path>
              <path d="M19 17v4"></path>
              <path d="M3 5h4"></path>
              <path d="M17 19h4"></path>
            </svg>
          </div>
          <div className={styles.content}>
            <h1 className={styles.welcomeHeading}>Welcome back, {username}!</h1>
            <p className={styles.subHeading}>Track your progress and excel in your learning journey</p>
          </div>
        </div>
        <div className={styles.chartsSection}>
          <div className={styles.chartBox}>
            <h3>Subject-wise Performance</h3>
            <Pie data={pieChartData} />
          </div>
          <div className={styles.chartBox}>
            <h3>Explore Exams</h3>
            {UpcomingExams()}
          </div>
        </div>

        <div className={styles.tableContainer}>
          <DataTableComponent
            title="Exam Results"
            columns={columns}
            data={filteredData}
            handleSearch={handleSearch}
          />
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
        {selectedResult && (
        <ResultSummaryModal
          results={selectedResult}
          isOpen={showResultModal}
          onClose={() => setShowResultModal(false)}
        />
      ) }
      </div>
    </>
  );
};

export default Dashboard; 
