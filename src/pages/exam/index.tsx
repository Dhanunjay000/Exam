import React, { useEffect, useState } from 'react'
import ExamLayout from '@/components/Exam/ExamForm';
import Question from '@/components/Exam/Question';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
const index = () => {
  const answeredQuestions = 4;
  const userName = 'John Doe';  
  const timeRemaining = '10:30';
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [username, setUsername] = useState("");
  useEffect(() => {
    const storedSubject = sessionStorage.getItem('subject');
    const result = Cookies.get("username");
    if(result)
    {
    setUsername(result)
    }
    if (!storedSubject) {
      router.push('/subjects');
    } else {
      setSubject(storedSubject);
    }
  }, []);

  if (!subject || ! username) return null;
  return (
    <div>
      <ExamLayout
        subject = {subject}
        answeredQuestions={answeredQuestions}
        userName={username}
        timeRemaining={timeRemaining}
      />
     
    </div>
  );
}

export default index