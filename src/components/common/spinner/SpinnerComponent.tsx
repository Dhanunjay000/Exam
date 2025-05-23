import React from 'react'
import styles from './SpinnerComponent.module.css'

const SpinnerComponent = () => {
  return (
    <div className={styles["spinner-overlay"]}>
      <div className={styles["spinner"]}>
      </div>
  </div>
  )
}

export default SpinnerComponent