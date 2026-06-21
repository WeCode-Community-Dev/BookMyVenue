import { auth, currentUser } from "@clerk/nextjs/server";

const TestPage = async () => {
    const { getToken } = await auth();
    const token = await getToken();
    const user = await currentUser();

    console.log({ token, user });

    const res = await fetch("http://127.0.0.1:4000/protected", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json();
    console.log({ response_data: data });

    return <div>{JSON.stringify(data, null, 2)}</div>;
};

export default TestPage;
