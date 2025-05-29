import React, { useEffect, useState } from 'react';
import styles from './Subjects.module.css';
import { useRouter } from 'next/router';
import HeaderComponent from '../Header/HeaderComponent';
import FooterComponent from '../Header/FooterComponent';
import SpinnerComponent from '../common/spinner/SpinnerComponent';

interface Subject {
  icon: string;
  title: string;
  description: string;
  color: string;
  level: string;
  rating: number;
}

const colors = [
  { color: '#3572A5' },
  { color: '#b07219' },
  { color: '#e34c26' },
  { color: '#f7df1e' },
  { color: '#264de4' },
];

const Subjects: React.FC = () => {

  const [subjectsList, setSubjectList] = useState<Subject[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const subjectsPerPage = 8;

  const filteredSubjects = subjectsList.filter((subj) =>
    subj.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastSubject = currentPage * subjectsPerPage;
  const indexOfFirstSubject = indexOfLastSubject - subjectsPerPage;
  const currentSubjects = filteredSubjects.slice(indexOfFirstSubject, indexOfLastSubject);
  const totalPages = Math.ceil(filteredSubjects.length / subjectsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch("/api/subjects");
        const data = await res.json();
        setSubjectList(data);

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

  const [showTermsModel, setShowTermsModel] = useState<boolean>(false);
  const [subject, setSubject] = useState<string>("");
  const router = useRouter();

  const startExam = () => {
    sessionStorage.setItem('subject', subject);
    router.push(`/exam`);
  };
  const handleClick = (title: string) => {
    setSubject(title);
    setShowTermsModel(true);
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "#10b981"
      case "Intermediate":
        return "#f59e0b"
      case "Advanced":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  };
  const TermsScreen = () => {
    const [agreed, setAgreed] = useState(false);
    return (
      <>
        <div className={styles["modal-overlay"]}>
          <div className={styles["modal-box"]}>
            <div style={{ textAlign: 'right' }}>
              <button className={styles["closeButton"]} onClick={() => setShowTermsModel(false)}>×</button>
            </div>
            <div>
              <h5 className={styles["card-header"]}><strong>TERMS AND CONDITIONS</strong></h5>
              <p>Please read these Terms and Conditions carefully before using our platform.</p>
              <p>By accessing or using the platform, you agree to be bound by these Terms. If you disagree, you may not access the Service.</p>
              <p>
                - No cheating or impersonation.<br />
                - Do not tamper with the system.<br />
                - Respect timing and instructions during the exam.<br />
                - Content is protected by copyright.
              </p>
              <p>
                Violation of these terms may result in suspension or disqualification.
              </p>
              <p>
                If you have questions, contact support@examplatform.com.
              </p>
            </div>
            <div className={styles["agreement"]}>
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
              />
              <label htmlFor="agree">I have read and agree to the Terms and Conditions.</label>
            </div>
            <button
              disabled={!agreed}
              onClick={startExam}
              className={`btn btn-primary ${styles["proceed-button"]}`}
            >
              Proceed
            </button>
          </div>
        </div>

      </>
    )
  };

  return (
    <>
      {loading && <SpinnerComponent />}
      <HeaderComponent />
      {subjectsList.length > 0 && (
        <div className={styles['pageWrapper']}>
          {showTermsModel && (
            <TermsScreen />
          )}
          <div className={styles.row}>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h1
                style={{
                  fontSize: "3rem",
                  fontWeight: "800",
                  background: "linear-gradient(135deg, #ffffff, #f8f9fa)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: "0.5rem",
                }}
              >
                Choose Your Programming Language
              </h1>
              <p
                style={{
                  fontSize: "1.2rem",
                  color: "rgba(255, 255, 255, 0.8)",
                  marginBottom: "2rem",
                }}
              >
                Test your skills and advance your career
              </p>

              {/* Stats Section */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "2rem",
                  marginBottom: "2rem",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ textAlign: "center", color: "rgba(255, 255, 255, 0.9)" }}>
                  <div style={{ fontSize: "2rem", fontWeight: "bold" }}>50K+</div>
                  <div style={{ fontSize: "0.9rem" }}>Students</div>
                </div>
                <div style={{ textAlign: "center", color: "rgba(255, 255, 255, 0.9)" }}>
                  <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{subjectsList.length}</div>
                  <div style={{ fontSize: "0.9rem" }}>Languages</div>
                </div>
                <div style={{ textAlign: "center", color: "rgba(255, 255, 255, 0.9)" }}>
                  <div style={{ fontSize: "2rem", fontWeight: "bold" }}>4.7★</div>
                  <div style={{ fontSize: "0.9rem" }}>Average Rating</div>
                </div>
              </div>
            </div>
            <div className={styles.searchField}>
            <input
              type="text"
              placeholder=" 🔍  Search languages..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className={styles.searchInput}
            />
            </div>
            {currentSubjects.length > 0 ? (
              <div className={styles.grid}>
                {currentSubjects.map((subj, index) => (
                  <div
                    key={index}
                    className={styles.card}
                    style={{ borderColor: subj.color }}
                    onClick={() => handleClick(subj.title)}
                  >
                    <img src={subj.icon} style={{ width: '50px', fontSize: "3rem", marginBottom: "1rem" }}></img>
                    <h3 style={{ color: colors[index % colors.length].color }}>{subj.title}</h3>
                    <p>{subj.description}</p>

                    {/* Subject Stats */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1rem",
                        fontSize: "0.85rem",
                        color: "#6b7280",
                      }}
                    >
                      <span
                        style={{
                          background: getDifficultyColor(subj.level),
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                        }}
                      >
                        {subj.level}
                      </span>
                      <span>⭐ {subj.rating}</span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.8rem",
                        color: "#9ca3af",
                        marginBottom: "1rem",
                      }}
                    >

                    </div>

                    <button className={styles.button}>Start Exam</button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "4rem", color: "rgba(255, 255, 255, 0.8)" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
                <p>No subjects found matching your search.</p>
              </div>
            )}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`${styles.pageButton} ${currentPage === index + 1 ? styles.activePage : ''}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
          <FooterComponent />
        </div>

      )}</>
  );
};

export default Subjects;
