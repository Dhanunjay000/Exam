import React, { useEffect, useState } from 'react';

interface Question_type {
  id: number;
  question: string;
  options: string[];
}

const Question  =  () =>{
  const [questions , setQuestions] = useState<Question_type[]>([]);
  useEffect(()=>{
    const fetch_questions = async () =>{
      try {
        const response  = await fetch ('/api/questions');
        const data =  await response.json();
        setQuestions(data);
      }
      catch(error){
      console.error("Error during fetching ", error);
      }
    }
    fetch_questions();
  },[]);

  useEffect(()=>{
  if(questions.length > 0)
      console.log(questions[0]['question'])
  },[questions])

  return (
    <div>

      {questions && (
    <p>{questions[0]['question']}</p>
      ) }
    </div>
  );


}
 

export default Question;
