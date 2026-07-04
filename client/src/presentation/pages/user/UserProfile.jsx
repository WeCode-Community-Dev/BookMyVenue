import Header from "@/presentation/components/common/Header";
import UserEditProfileForm from "@/presentation/components/user/UserEditProfileForm";
import UserProfileImage from "@/presentation/components/user/UserProfileImage";
import UserProfileInformation from "@/presentation/components/user/UserProfileInformation";
import UserSidebar from "@/presentation/components/user/UserSidebar";
import { useState } from "react";

const UserProfile = () => {
    const [user, setUser] = useState({
        name: "Navya N",
        email: "navya@example.com",
        phone: "9876543210",
        gender: "Female",
        dob: "2000-05-12",
        address: "Kozhikode",
        city: "Kozhikode",
        state: "Kerala",
        pincode: "673001",
        memberSince: "May 2024",
        image: "https://i.pravatar.cc/300",
      });
    
      // Controls whether we show the profile or the edit form
      const [isEditing, setIsEditing] = useState(false);
    
      // Called when Save Changes is clicked
      const handleSave = async (updatedData) => {
        console.log(updatedData);
    
        /**
         * Later:
         *
         * await updateProfileUseCase(updatedData)
         * const latestUser = await getProfileUseCase()
         * setUser(latestUser)
         */
    
        setUser((prev) => ({
          ...prev,
          ...updatedData,
        }));
    
        setIsEditing(false);
      };
    
      // Called when Cancel is clicked
      const handleCancel = () => {
        setIsEditing(false);
      };
    

  return (
    <>
      <Header />

      <div className="flex">
        <UserSidebar />

        <main className="flex-1 bg-gray-50 p-10">
          <div className="flex gap-10 items-start">
            {/* Left */}
            <div className="w-80">
              <UserProfileImage
                image={user.image}
                name={user.name}
                email={user.email}
                memberSince={user.memberSince}
                onImageChange={() => console.log("Change Image")}
              />
            </div>

            {/* Right */}
            <div className="flex-1">
              {isEditing ? (
                <UserEditProfileForm
                  user={user}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              ) : (
                <UserProfileInformation
                  user={user}
                  onEditProfile={() => setIsEditing(true)}
                  onAccountSettings={() =>
                    console.log("Account Settings")
                  }
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default UserProfile;