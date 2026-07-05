import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signupUser } from "../../api/authApi";
import { getSafeReturnTo } from "../../utils/authNavigation";
import UserOwner from "./UserOwner";

export const SignUpForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const returnTo = getSafeReturnTo(location.state);
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    account_type:"venue_user",
    terms_privacy: false,
    address: "",
    phone_number: "",
  });

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function handleAccountTypeChange(accountType) {
     

  setFormData((prevData) => ({
    ...prevData,
    account_type: accountType,
  }));
}

  async function handleSubmit(event) {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const signupData = {
      username: formData.username,
      fullname: formData.fullname,
      email: formData.email,
      password: formData.password,
      account_type: formData.account_type,
      terms_privacy: formData.terms_privacy,
      address: formData.address,
      phone_number: formData.phone_number,
    };

    try {
      
      await signupUser(signupData);
      navigate("/login", {
        replace: true,
        state: returnTo ? { returnTo } : undefined,
      });
    } catch (error) {
  const errorData = error.response?.data || error.message || error;

  console.log("Signup failed:", errorData);
  alert("Signup failed. Check console for details.");
}
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="fullname">Full Name</label>
        <input
          id="fullname"
          name="fullname"
          type="text"
          placeholder="Full Name"
          value={formData.fullname}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="username">User Name</label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="User Name"
          value={formData.username}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <div className="password-box">
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <span>👁</span>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input
          id="address"
          name="address"
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone_number">Phone Number</label>
        <input
          id="phone_number"
          name="phone_number"
          type="text"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Account type</label>
        <UserOwner
          accountType={formData.account_type}
          setAccountType={handleAccountTypeChange}
/>
      </div>

      <div className="terms">
        <input
          id="terms"
          name="terms_privacy"
          type="checkbox"
          checked={formData.terms_privacy}
          onChange={handleChange}
        />
        <label htmlFor="terms">
          I agree to the <a href="#">Terms & Privacy Policy</a>
        </label>
      </div>

      <button type="submit" className="create-btn">
        Create Account
      </button>

      <div className="divider">
        <span></span>
        <p>or</p>
        <span></span>
      </div>

      <button type="button" className="google-btn">
        <span>G</span>
        Continue with Google
      </button>

      <p className="bottom-login">
        Already have an account?{" "}
        <Link to="/login" state={returnTo ? { returnTo } : undefined}>
          Login
        </Link>
      </p>
    </form>
  );
};

export default SignUpForm;
