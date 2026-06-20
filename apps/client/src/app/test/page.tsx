import { auth, currentUser } from "@clerk/nextjs/server";

const TestPage = async () => {
    const { getToken } = await auth();
    const token = await getToken();
    const user = await currentUser();

    const res = await fetch("http://127.0.0.1:4000/users", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: "test2email.com",
            role: "ADMIN"
        }),
    });

    const data = await res.json();
    console.log({ response_data: data });

    return <div>{JSON.stringify(data, null, 2)}</div>;
};

export default TestPage;
