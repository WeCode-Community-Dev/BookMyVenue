import Header from "@/presentation/components/common/Header";
import UserSidebar from "@/presentation/components/user/UserSidebar";

const AccountSettings = () => {
    return(
        <>
        <Header />
        <UserSidebar />
            <h1>Account Settings Page</h1>
            <p>Profile Photo</p>
            <p>Change Password</p>
            <p>Logout</p>
        </>
    )
}

export default AccountSettings;