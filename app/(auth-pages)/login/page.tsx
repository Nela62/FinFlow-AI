import { BaseAuthForm } from "../components/BaseAuthForm";
import {
  signInWithOtp,
  signInWithPassword,
  verifyOtp,
} from "@/lib/authService/authService";

export default function Login() {
  return (
    <BaseAuthForm
      signInWithPassword={signInWithPassword}
      signInWithOtp={signInWithOtp}
      verifyOtp={verifyOtp}
    />
  );
}
