import ResultsCard from '@/components/Results/ResultsCard'
import React, { useEffect } from 'react'

const index = () => {

  useEffect(()=>{
    if (document.fullscreenElement) {
      document.exitFullscreen()
    }
  },[]);
  return (
    <ResultsCard />
  )
}

export default index