import React, { useState, useMemo } from 'react';
// import { CSVLink } from 'react-csv';
import styles from './DashboardComponent.module.css';

const data = [
  { sno: 1, subject: 'Mathematics', marks: 95, examDate: '2025-05-10' },
  { sno: 2, subject: 'Science', marks: 89, examDate: '2025-05-12' },
  { sno: 3, subject: 'English', marks: 76, examDate: '2025-05-15' },
  { sno: 4, subject: 'History', marks: 85, examDate: '2025-05-18' },
  { sno: 5, subject: 'Geography', marks: 92, examDate: '2025-05-20' },
];

const DashboardComponent = () => {
  // For simplicity, not using react-table here
  const [search, setSearch] = useState('');

  // Filter data for search term
  const filteredData = data.filter(
    (d) =>
      d.subject.toLowerCase().includes(search.toLowerCase()) ||
      d.examDate.includes(search) ||
      d.marks.toString().includes(search) ||
      d.sno.toString().includes(search)
  );

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.heading}>Student Exam Results</h2>
      <input
        type="text"
        placeholder="Search..."
        className={styles.searchBox}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table className={styles.resultTable}>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Subject</th>
            <th>Marks</th>
            <th>Exam Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center' }}>
                No records found.
              </td>
            </tr>
          )}
          {filteredData.map(({ sno, subject, marks, examDate }) => (
            <tr key={sno}>
              <td>{sno}</td>
              <td>{subject}</td>
              <td>{marks}</td>
              <td>{examDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
{/* 
      <CSVLink data={filteredData} filename="exam-results.csv" className={styles.exportBtn}>
        Export to CSV
      </CSVLink> */}
    </div>
  );
};

export default DashboardComponent;
