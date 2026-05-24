import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import type { OTPInputType } from "../../types/auth.types.js";
import { LabeledInput } from "../ui/Input.js";

function Otp() {
  const navigate = useNavigate();
  const { otpinput, loading, error } = useAuth();
  const [postInputs, setPostInputs] = useState<OTPInputType>({
    otp: "",
  });

  async function loginRequest() {
    try {
      await otpinput(postInputs);
      navigate("/registration");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      
    </>
  );
}

export default Otp;
