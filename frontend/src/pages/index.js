import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    email: "",
    address: "",
    dob: "",
    occupation: "",
    gender: "",
  });
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Determine API Base URL
  const API_BASE_URL = process.env.NODE_ENV === "development"
      ? "http://localhost:5000/api"
      : "https://mm-zlrf.onrender.com/api";


  useEffect(() => {
    if (session?.user?.email) {
      axios
          .get(`${API_BASE_URL}/idcard?email=${session.user.email}`)
          .then((res) => {
            setUserData(res.data);
            localStorage.setItem("userData", JSON.stringify(res.data));
            router.push("/idcard");
          })
          .catch(() => setUserData(null))
          .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [session, router, API_BASE_URL]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/onboard`, {
        ...formData,
        email: session.user.email,
      });

      alert("User onboarded successfully!");
      setUserData(formData);
      localStorage.setItem("userData", JSON.stringify(formData));
      router.push("/idcard");
    } catch (error) {
      alert(error.response?.data?.error || "Error onboarding user");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Mukti-Morcha🌟🌟</h1>

        {!session ? (
            <button onClick={() => signIn("google")}>Sign in with Google</button>
        ) : (
            <>
              <p>Welcome, {session.user.name}!</p>
              <button onClick={() => signOut()}>Sign Out</button>

              <h2>Fill Your Details</h2>
              <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    onChange={handleChange}
                    required
                />
                <br />
                <input
                    type="text"
                    name="fatherName"
                    placeholder="Father's Name"
                    onChange={handleChange}
                    required
                />
                <br />
                <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    onChange={handleChange}
                    required
                />
                <br />
                <input
                    type="date"
                    name="dob"
                    placeholder="Date of Birth"
                    onChange={handleChange}
                    required
                />
                <br />
                <input
                    type="text"
                    name="occupation"
                    placeholder="Occupation"
                    onChange={handleChange}
                    required
                />
                <br />
                <select name="gender" onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <br />
                <button type="submit">Submit</button>
              </form>
            </>
        )}
      </div>
  );
}
