import React from "react";

export const UserOwner = ({ accountType, setAccountType }) => {
  return (
    <div className="account-buttons">
      <button
        type="button"
        className={
          accountType === "venue_user"
            ? "account-btn active"
            : "account-btn"
        }
        onClick={() => setAccountType("venue_user")}
      >
        🏢 Venue User
      </button>

      <button
        type="button"
        className={
          accountType === "venue_owner"
            ? "account-btn active"
            : "account-btn"
        }
        onClick={() => setAccountType("venue_owner")}
      >
        🏪 Venue Owner
      </button>
    </div>
  );
};

export default UserOwner;
