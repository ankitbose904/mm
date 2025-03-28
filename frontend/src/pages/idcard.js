import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import html2canvas from "html2canvas";

export default function IDCard() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const cardRef = useRef(null);

    useEffect(() => {
        const storedData = localStorage.getItem("userData");
        if (storedData) {
            setUserData(JSON.parse(storedData));
        } else {
            alert("No user data found, redirecting...");
            router.push("/");
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("userData");
        signOut();
    };

    const handleDownload = async () => {
        if (!cardRef.current) return;

        const canvas = await html2canvas(cardRef.current);
        const imgData = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = imgData;
        link.download = "ID_Card.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!userData) return <p>Loading...</p>;

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>ID Card</h2>

            <div
                ref={cardRef}
                style={{
                    border: "2px solid black",
                    padding: "20px",
                    width: "300px",
                    margin: "auto",
                    backgroundColor: "#fff",
                }}
            >
                <p>
                    <strong>Name:</strong> {userData.name}
                </p>
                <p>
                    <strong>Father’s Name:</strong> {userData.fatherName}
                </p>
                <p>
                    <strong>Email:</strong> {userData.email}
                </p>
                <p>
                    <strong>Address:</strong> {userData.address}
                </p>
                <p>
                    <strong>DOB:</strong> {userData.dob}
                </p>
                <p>
                    <strong>Occupation:</strong> {userData.occupation}
                </p>
                <p>
                    <strong>Gender:</strong> {userData.gender}
                </p>
            </div>

            <button onClick={() => router.push("/")}>Go Back</button>
            <button onClick={handleDownload} style={{ marginLeft: "10px", backgroundColor: "green", color: "white" }}>
                Download ID Card
            </button>
            <button onClick={handleLogout} style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}>
                Logout
            </button>
        </div>
    );
}
