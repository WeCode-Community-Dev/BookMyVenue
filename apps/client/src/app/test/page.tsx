import { auth } from "@clerk/nextjs/server";

const TestPage = async () => {
    const { getToken } = await auth();
    const token = await getToken()
    console.log({token});
    const res = await fetch("http://127.0.0.1:4000/protected", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })


    const data = await res.json()
    console.log({respons_data: data});
    
    return <div>{JSON.stringify(data,null,2)}</div>;
};

export default TestPage;
