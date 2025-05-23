import React, { useEffect, useState } from 'react';
import styles from './Subjects.module.css';
import { Router, useRouter } from 'next/router';
import ConfirmationModal from '../Models/ConfirmationModel';
import HeaderComponent from '../Header/HeaderComponent';
import FooterComponent from '../Header/FooterComponent';
import SpinnerComponent from '../common/spinner/SpinnerComponent';

interface Subject {
  icon: string;
  title: string;
  description: string;
  color: string;
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
      finally{
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
  }

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
            <input
              type="text"
              placeholder="Search languages..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className={styles.searchInput}
            />
            {currentSubjects.length > 0 ? (
              <div className={styles.grid}>
                {currentSubjects.map((subj, index) => (
                  <a key={index} onClick={() => handleClick(subj.title)} style={{ textDecoration: "none" }}>
                    <div className={styles.card} style={{ borderColor: colors[index % colors.length].color }}>
                      <img src={subj.icon} width={50} height={50} />
                      <h3 style={{ color: colors[index % colors.length].color, marginTop: '3px' }}>{subj.title}</h3>
                      <button className={styles.button}>Start Exam</button>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p>No subjects found.</p>
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
