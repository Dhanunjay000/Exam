import React, { useState } from 'react';
import styles from './User.module.css';
import MessageModel from '../Models/MessageModel';
import { useRouter } from 'next/router';
import { FaArrowLeft } from 'react-icons/fa';
interface UserFormProps { }

const AddUserForm: React.FC<UserFormProps> = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    username: '',
    phone: '',
    dob: '',
    password: ''
  });
  const [passwordError, setPasswordError] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    let error = "";
    switch(name){
      case "first_name":
        if (!/^[A-Za-z][A-Za-z ]{2,}$/.test(value)) {
          error = "Only letters and spaces, min 3 characters";
        }
        break;
      case "last_name":
        if (!/^[A-Za-z][A-Za-z ]{2,}$/.test(value)) {
          error = "Only letters and spaces, min 3 characters";
        }
        break;
      case  "phone" :
        if (!/^[6-9]\d{9}$/.test(value)) {
          error = "Enter valid 10-digit mobile number";
        }
        break;
      case "password": 
        if(value.length < 6) {
          error = "Password must br at least 6 characters";
        }
        break;
      default :
        break
    }
    setFormErrors(prev =>({...prev, [name]:error}));
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData.password == e.target.value)
      setPasswordError("")
    else
      setPasswordError("Passwords should be match");
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (passwordError !== '') {
      setMessage("Passwords should be match")
      setMessageType("error")
      setShowModel(true)
      return;
    }
    const errorLength = Object.values(formErrors).filter((val) => val.trim() !== "").length;
    if (errorLength > 0) {
      setMessage("Please correct the highlighted errors before submitting.");
      setMessageType('error');
      setShowModel(true);
      return;
    }

    try {
      var response = await fetch(`/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          dob: formData.dob,
          phone: formData.phone,
          username: formData.username,
          gender: formData.gender,
          password: formData.password
        }),
      })
      var result = await response.json()
      if (response.status != 201) {
        setMessage(result.error);
        setMessageType('error');
        setShowModel(true);
        return;
      }
      else {
        setMessage(result.message);
        setMessageType("success");
        setShowModel(true);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
        
      }
    }
    catch (error) {
      console.log(error);
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <a href="/login" className="ms-1 text-decoration-none text-primary hover-underline text-end">
          <FaArrowLeft className="me-2" />Back to login
        </a>
        <div className={styles['card-header']}>User Registration</div>
        <div className="card-body">
          <form onSubmit={handleSubmit} id="form_data">
            <div className={styles['form-group']}>
              <label htmlFor="firstName">First Name <span className={styles['required-label']}> *</span></label>
              <input
                type="text"
                className={`form-control ${styles['form-control']}`}
                id="firstName"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter first name"
                required
              />
               <span className={styles["error-msg"]}>{formErrors.first_name} </span>
            </div>
            <div className={styles['form-group']}>
              <label htmlFor="lastName">Last Name <span className={styles['required-label']}> *</span></label>
              <input
                type="text"
                className={`form-control ${styles['form-control']}`}
                id="lastName"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter last name"
                required
              />
             <span className={styles["error-msg"]}>{formErrors.last_name} </span>
            </div>

            <div className={styles['form-group']}>
              <label htmlFor="gender">
                Gender <span className={styles['required-label']}>*</span>
              </label>
              <select
                id="gender"
                name="gender"
                className={`form-control ${styles['form-control']}`}
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
                <option value="P">Prefer not to say</option>
              </select>
            </div>
            <div className={styles['form-group']}>
              <label htmlFor="email">Email <span className={styles['required-label']}> *</span></label>
              <input
                type="email"
                className={`form-control ${styles['form-control']}`}
                id="email"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
              <span className={styles["error-msg"]}> </span>
            </div>

            <div className={styles['form-group']}>
              <label htmlFor="phone">Phone <span className={styles['required-label']}> *</span></label>
              <input
                type="number"
                className={`form-control ${styles['form-control']}`}
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
              <span className={styles["error-msg"]}>{formErrors.phone} </span>
              <span className={styles["error-msg"]}> </span>
            </div>
            <div className={styles['form-group']}>
              <label htmlFor="dob">Date of Birth <span className={styles['required-label']}> *</span></label>
              <input
                type="date"
                className={`form-control ${styles['form-control']}`}
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
              <span className={styles["error-msg"]}> </span>
            </div>
            <div className={styles['form-group']}>
              <label htmlFor="password">Password<span className={styles['required-label']}> *</span></label>
              <input
                type="password"
                className={`form-control ${styles['form-control']}`}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className={styles["error-msg"]}> {formErrors.password}</span>
            </div>
            <div className={styles['form-group']}>
              <label htmlFor="cnf_password">Confirm password <span className={styles['required-label']}> *</span></label>
              <input
                type="password"
                className={`form-control ${styles['form-control']}`}
                id="cnf_password"
                name="cnf_password"
                // value={formData.dob}
                onChange={handlePasswordChange}
                required
              />
              <span className={styles["error-msg"]} >{passwordError}</span>
            </div>

            <button type="submit" className={`btn btn-primary btn-block ${styles['btn-primary']}`}>
              Submit
            </button>
          </form>
        </div>
      </div>
      {showModel &&
        <MessageModel message={message} type={messageType} onClose={() => { setShowModel(false); setMessage("") }} />
      }
    </div>
  );
};

export default AddUserForm;
