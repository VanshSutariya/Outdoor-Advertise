import React, { useState } from "react";
import TextField from "@mui/material/TextField";

interface ForgotPasswordPopupProps {
  onClose: () => void;
}

const ForgotPasswordPopup: React.FC<ForgotPasswordPopupProps> = ({
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [handleError, setHandleError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const resData = await fetch(
        "http://localhost:4000/auth/forget-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const resp = await resData.json();

      if (!resData.ok) throw new Error(resp.message || "User not found.");

      alert(`${resp.message}`);

      onClose();
      setHandleError(null);
    } catch (error: any) {
      console.error(error);
      setHandleError(error.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setHandleError(null);
  };

  return (
    <div className=" fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-zinc-200 p-6 rounded-lg shadow-md h-80 w-80">
          <h2 className="text-xl font-semibold mb-4">Forgot Password?</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              type="email"
              value={email}
              onChange={handleChange}
              required
              fullWidth
              id="forgot-password-email"
              label="Enter Your Email"
            />
            <div className="flex flex-col justify-end mt-4">
              <button
                type="button"
                className="mr-2 px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
                onClick={onClose}
              >
                Close
              </button>
              <button
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-400 text-white rounded mt-3"
              >
                {isLoading ? "Sending Mail..." : "Submit"}
              </button>
            </div>
            {handleError && (
              <p className="flex justify-center text-lg text-red-700">
                {handleError}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPopup;
