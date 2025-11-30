import React, { useState } from "react";
import { UserCircle } from "lucide-react"; // or any icon library you use

function SignInButton() {
    const [signedIn, setSignedIn] = useState(false);

    const toggleSign = () => {
        setSignedIn(prev => !prev);
    };

    return (
        <button
            onClick={toggleSign}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1rem"
            }}
            aria-label={signedIn ? "Sign Out" : "Sign In"}
        >
            <UserCircle size={24} />
            {signedIn ? "Sign Out" : "Sign In"}
        </button>
    );
}

export default SignInButton;
