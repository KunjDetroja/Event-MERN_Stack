import React, { useState, useEffect } from 'react'
import api from "../../api";
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

function UserLogin({ setUBoolean }) {
  const navigate = useNavigate();
  const [details, setDetails] = useState([]);
  const [lFormData, setLFormData] = useState({
    clubname: "",
    username: "",
    password: "",
  });

  
  const fetchAllClubDetails = async () => {
    try {
      const response = await api.get("/clubnames/");
      setDetails(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  useEffect(() => {
    fetchAllClubDetails();
  }, []);

  const handleInputChange = (event) => {
    setLFormData({
      ...lFormData,
      [event.target.name]: event.target.value,

    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(lFormData)
    try {
      const checking = await api.post("/user/userlogin/", lFormData);
      console.log(checking);
      if (checking.data.success) {
        localStorage.setItem("users", JSON.stringify(checking.data.data));
        toast.success("Login Successfully")
        setLFormData({
          clubname: "",
          username: "",
          password: "",
        });
        navigate("/");
      } else {
        toast.error(checking.data.error);
      }
      
    } catch (error) {
      toast.error(error.response.data.error)
      console.error("Error submitting form:", error);
    }
  };
  return (
    <>
      <div className="col-12 col-md-6 col-xl-5">
        <div className="card border-0 rounded-4">
          <div className="card-body p-3 p-md-4 p-xl-5">
            <div className="row">
              <div className="col-12">
                <div className="mb-4">
                  <h3>User Login </h3>
                  <p>Don't have an account?
                    <button
                      style={{color: 'white',backgroundColor: '#0e2643',border: 'none',marginLeft: '1rem',padding: '0.3rem 0.5rem 0.3rem 0.5rem',borderRadius: '0.375rem'}}
                      onClick={() => { setUBoolean(false) }} >
                      Register
                    </button>
                  </p>
                </div>
              </div>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="row gy-3 overflow-hidden">
                <div className="col-12">
                  <div className="form-floating mb-3">
                    <select
                      onChange={handleInputChange}
                      className="form-select"
                      id="clubname"
                      name="clubname"
                      value={lFormData.clubname}
                    >
                      <option value="">None</option>
                      {details.map((club) => (
                        <option key={club} value={club}>
                          {club}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="clubname" className="form-label">
                    Select Clubname: 
                    </label>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-floating mb-3">
                    <input
                      onChange={handleInputChange}
                      type="text"
                      className="form-control"
                      id="username"
                      placeholder=""
                      name="username"
                      value={lFormData.username}
                    />
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-floating mb-3">
                    <input
                      onChange={handleInputChange}
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder=""
                      name="password"
                      value={lFormData.password}
                    />
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-grid">
                    <button style={{color: 'white',backgroundColor: '#0e2643',border: 'none',marginLeft: '1rem',padding: '0.3rem 0.5rem 0.3rem 0.5rem',borderRadius: '0.375rem'}} type="submit">Login now</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserLogin
