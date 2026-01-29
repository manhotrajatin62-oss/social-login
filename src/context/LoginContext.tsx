import { createContext, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const LoginContext: any = createContext({});

const LoginContextProvider = ({ children }: any) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showHidePassword, setShowHidePassword] = useState(false);

  const [nameStatus, setNameStatus] = useState({
    status: "idle",
    message: "",
    success: false,
  });

  const [emailStatus, setEmailStatus] = useState({
    status: "idle",
    message: "",
    success: false,
  });

  const [passwordStatus, setPasswordStatus] = useState({
    status: "idle",
    message: "",
    success: false,
  });

  const [confirmPasswordStatus, setConfirmPasswordStatus] = useState({
    status: "idle",
    message: "",
    success: false,
  });

  const [formSuccess, setFormSuccess] = useState(false);

  const [isLogin, setIsLogin] = useState(true);

  const navigate = useNavigate();

  function handleNameChange(e: any) {
    const nameRegex = /^[A-Za-z]{2,}(?:\s[A-Za-z]+)?$/;
    const name = e.target.value;
    setName(name);

    if (!name.trim()) {
      return setNameStatus({
        status: "error",
        message: "Name is required",
        success: false,
      });
    }

    if (!nameRegex.test(name)) {
      return setNameStatus({
        status: "error",
        message: "Name is incorrect",
        success: false,
      });
    }

    return setNameStatus({
      status: "idle",
      message: "",
      success: true,
    });
  }

  function handleEmailChange(e: any) {
    const emailRegex = /^[A-Za-z0-9.]+@[A-Za-z0-9-]+\.(com|gov\.in|in)$/;
    const value = e.target.value;
    setEmail(value);

    if (!value.trim()) {
      return setEmailStatus({
        status: "error",
        message: "Email is required",
        success: false,
      });
    }

    if (!emailRegex.test(value)) {
      return setEmailStatus({
        status: "error",
        message: "Email is incorrect",
        success: false,
      });
    }

    return setEmailStatus({
      status: "idle",
      message: "",
      success: true,
    });
  }

  function handlePasswordChange(e: any) {
    const password = e.target.value;
    setPassword(password);

    if (!password.trim()) {
      return setPasswordStatus({
        status: "error",
        message: "Password is required",
        success: false,
      });
    }

    if (password.length < 6) {
      return setPasswordStatus({
        status: "error",
        message: "Password must be at least 6 characters",
        success: false,
      });
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    const strength = [hasUpper, hasLower, hasNumber, hasSymbol].filter(
      Boolean,
    ).length;

    if (strength < 4) {
      return setPasswordStatus({
        status: "weak",
        message: "Use uppercase, lowercase, numbers and symbols",
        success: false,
      });
    }

    if (strength === 4) {
      return setPasswordStatus({
        status: "idle",
        message: "",
        success: true,
      });
    }
  }

  function handleConfirmPasswordChange(e: any) {
    const confirmPassword = e.target.value;
    setConfirmPassword(confirmPassword);

    if (!confirmPassword.trim()) {
      return setConfirmPasswordStatus({
        status: "error",
        message: "Password is required",
        success: false,
      });
    }

    if (confirmPassword !== password) {
      return setConfirmPasswordStatus({
        status: "error",
        message: "Password does not match",
        success: false,
      });
    }

    return setConfirmPasswordStatus({
      status: "idle",
      message: "",
      success: true,
    });
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    setFormSuccess(false);

    if (isLogin) {
      if (!email.trim() && !password.trim()) {
        setEmailStatus({
          status: "error",
          message: "Email is required",
          success: false,
        });

        setPasswordStatus({
          status: "error",
          message: "Password is required",
          success: false,
        });
        return;
      }

      if (!emailStatus.success || !passwordStatus.success) return;

      setFormSuccess(true);
      localStorage.setItem("user", JSON.stringify({ email, password }));
      navigate("/");
      setEmail("");
      setPassword("");
      setEmailStatus({
        status: "idle",
        message: "",
        success: false,
      });

      setPasswordStatus({
        status: "idle",
        message: "",
        success: false,
      });

      toast.success("Login Successful");

      return;
    }

    if (
      !name.trim() &&
      !email.trim() &&
      !password.trim() &&
      !confirmPassword.trim()
    ) {
      setNameStatus({
        status: "error",
        message: "Name is required",
        success: false,
      });

      setEmailStatus({
        status: "error",
        message: "Email is required",
        success: false,
      });

      setPasswordStatus({
        status: "error",
        message: "Password is required",
        success: false,
      });

      setConfirmPasswordStatus({
        status: "error",
        message: "Password is required",
        success: false,
      });
      return;
    }

    if (
      !emailStatus.success ||
      !passwordStatus.success ||
      !nameStatus.success ||
      !confirmPasswordStatus.success
    ) {
      return;
    }

    setFormSuccess(true);
    localStorage.setItem("user", JSON.stringify({ name, email, password }));
    navigate("/");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");

    setEmailStatus({
      status: "idle",
      message: "",
      success: false,
    });

    setPasswordStatus({
      status: "idle",
      message: "",
      success: false,
    });

    setNameStatus({
      status: "idle",
      message: "",
      success: false,
    });

    setConfirmPasswordStatus({
      status: "idle",
      message: "",
      success: false,
    });

    toast.success("Signup Successful");
  }

  const contextValue = useMemo(
    () => ({
      showHidePassword,
      setShowHidePassword,
      email,
      setEmail,
      password,
      setPassword,
      formSuccess,
      setFormSuccess,
      emailStatus,
      setEmailStatus,
      handleEmailChange,
      passwordStatus,
      setPasswordStatus,
      handlePasswordChange,
      handleSubmit,
      nameStatus,
      setNameStatus,
      handleNameChange,
      name,
      setName,
      confirmPassword,
      confirmPasswordStatus,
      handleConfirmPasswordChange,
      isLogin,
      setIsLogin,
    }),
    [
      showHidePassword,
      email,
      password,
      formSuccess,
      emailStatus,
      passwordStatus,
      nameStatus,
      name,
      confirmPassword,
      confirmPasswordStatus,
      isLogin,
    ],
  );

  return (
    <LoginContext.Provider value={contextValue}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContextProvider;
