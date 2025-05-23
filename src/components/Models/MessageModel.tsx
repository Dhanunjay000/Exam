import React, { useEffect, useState } from 'react';
import styles from './MessageModel.module.css';

type MessageModelProps = {
  message?: string;
  type?:string;
  duration?:number;
  onClose ?: () =>void;
};

const MessageModel: React.FC<MessageModelProps> = ({ message , type="error",  duration=3000, onClose }) => {
  const [visible, setVisible] = useState(true);
  useEffect(()=>{
    const timer = setTimeout(()=>{
      setVisible(false);
      onClose?.();
    },duration);
    return ()=> clearTimeout(timer);
  },[duration,onClose]);
    

  if (!visible) return null;

  return (
    <div className={`${styles.modal} ${styles[type]}`}>
    <div className={styles.content}>
      <button className={styles.closeButton} onClick={() => {
        setVisible(false);
        onClose?.();
      }}>×</button>
      <div className={styles.message}>{message}</div>
    </div>
  </div>
  );
};

export default MessageModel;
