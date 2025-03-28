import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router"; // If using Next.js 13+, replace with: import { useRouter } from "next/navigation";

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

  // Set API Base URL Correctly
  const API_BASE_URL =
      process.env.NODE_ENV === "development"
          ? "http://localhost:5000"
          : "https://mm-zlrf.onrender.com";

  // Fetch ID Card Data if the user is logged in
  useEffect(() => {
    if (session?.user?.email) {
      axios
          .get(`${API_BASE_URL}/api/idcard?email=${session.user.email}`)
          .then((res) => {
            setUserData(res.data);
            localStorage.setItem("userData", JSON.stringify(res.data));
          })
          .catch((error) => {
            console.error("Error fetching ID card:", error);
            setUserData(null);
          })
          .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [session, router]); // ✅ Removed API_BASE_URL from dependencies to prevent re-renders

  // Redirect to ID card page when data is available
  useEffect(() => {
    if (userData) {
      router.push("/idcard");
    }
  }, [userData, router]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session?.user?.email) {
      alert("Please sign in first!");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/onboard`, {
        ...formData,
        email: session.user.email,
      });

      alert("User onboarded successfully!");
      setUserData(response.data);
      localStorage.setItem("userData", JSON.stringify(response.data));
    } catch (error) {
      console.error("Onboarding error:", error);
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

              {!userData ? (
                  <>
                    <h2>Fill Your Details</h2>
                    <form onSubmit={handleSubmit}>
                      <input
                          type="text"
                          name="name"
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                      />
                      <br />
                      <input
                          type="text"
                          name="fatherName"
                          placeholder="Father's Name"
                          value={formData.fatherName}
                          onChange={handleChange}
                          required
                      />
                      <br />
                      <input
                          type="text"
                          name="address"
                          placeholder="Address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                      />
                      <br />
                      <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleChange}
                          required
                      />
                      <br />
                      <input
                          type="text"
                          name="occupation"
                          placeholder="Occupation"
                          value={formData.occupation}
                          onChange={handleChange}
                          required
                      />
                      <br />
                      <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      <br />
                      <button type="submit">Submit</button>
                    </form>
                  </>
              ) : (
                  <p>Your ID Card is ready! Redirecting...</p>
              )}
            </>
        )}
      </div>
  );
}
