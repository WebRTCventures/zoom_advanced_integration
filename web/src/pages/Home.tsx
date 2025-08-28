import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import ZoomContainer from "./ZoomContainer";

export default function Home() {
  const {
    loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomData, setZoomData] = useState<{
    signature: string;
    meetingNumber: string;
    passWord: string;
    userName: string;
    userEmail: string;
    registrantToken: string;
    zakToken: string;
  } | null>(null);

  document.getElementById("zmmtg-root")!.style.display = "none";

  const startMeeting = async () => {
    setLoading(true);
    const token = await getAccessTokenSilently();
    const res = await fetch("http://localhost:4000/api/meetings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic: "Test Meeting", type: 1 }),
    });
    const data = await res.json();
    console.log("Created meeting:", data);
    const resSignature = await fetch(
      "http://localhost:4000/api/sdk-signature",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ meetingNumber: data.id, role: 1 }),
      }
    );
    const dataSignature = await resSignature.json();
    const signature = dataSignature.signature;

    console.log("Zoom signature:", dataSignature);

    setZoomData({
      signature: signature,
      meetingNumber: data.id,
      passWord: data.password,
      userName: user?.name || "React",
      userEmail: user?.email || "",
      registrantToken: data.registrant_token || "",
      zakToken: data.zak || "",
    });
    setLoading(false);
    setShowZoom(true);
  };

  return (
    <div style={{ padding: "20px" }}>
      {!isAuthenticated && (
        <button
          style={{
            color: "white",
            backgroundColor: "blue",
            padding: "10px",
            borderRadius: "5px",
          }}
          onClick={() => loginWithRedirect()}
        >
          Log in
        </button>
      )}
      {isAuthenticated && !showZoom && (
        <>
          <p>
            Hello <span style={{ fontWeight: "bold" }}>{user?.name}</span>
          </p>
          <div>
            <button
              onClick={startMeeting}
              disabled={loading}
              style={{
                color: "white",
                backgroundColor: "blue",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              {loading ? "Starting..." : "Start Zoom Meeting"}
            </button>
          </div>
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              style={{
                color: "white",
                backgroundColor: "red",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              Logout
            </button>
          </div>
        </>
      )}
      {isAuthenticated && showZoom && (
        <ZoomContainer
          signature={zoomData?.signature || ""}
          meetingNumber={zoomData?.meetingNumber || ""}
          passWord={zoomData?.passWord || ""}
          userName={zoomData?.userName || ""}
          userEmail={zoomData?.userEmail || ""}
          registrantToken={zoomData?.registrantToken || ""}
          zakToken={zoomData?.zakToken || ""}
        />
      )}
    </div>
  );
}
