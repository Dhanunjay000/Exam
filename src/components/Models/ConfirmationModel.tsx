// ConfirmationModal.jsx
import React from 'react';
import styles from './ConfirmationModel.module.css'
interface ConfirmationModalProps  {
message: string;
onConfirm :  any;
onCancel : () => void;
 }

const ConfirmationModal :React.FC<ConfirmationModalProps> = ({ message , onConfirm, onCancel }) => {
  return (
    <div className={styles["modal-overlay"]}>
      <div className={styles["modal-box"]}>
      <div dangerouslySetInnerHTML={{ __html: message }} />
        <div className={styles["modal-actions"]}>
          <button className="btn btn-danger" onClick={onCancel}>No</button>
          <button className="btn btn-success" onClick={onConfirm}>Yes</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
