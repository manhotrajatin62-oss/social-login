import { useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LoginContext } from "../context/LoginContext";
import { FacebookLogin, GithubLogin, GoogleLogin, MicrosoftLogin, TwitterLogin } from "../components/Icons.tsx";

const getPasswordBorderClass = (status: any) => {
  if (status === "error") return "border-red-500 focus:border-red-500";
  if (status === "weak") return "border-amber-700 focus:border-amber-700";
  if (status === "medium") return "border-orange-500 focus:border-orange-500";
  return "border-border focus:border-black";
};

const getPasswordTextColorClass = (status: any) => {
  if (status === "error") return "text-red-500";
  if (status === "weak") return "text-amber-700";
  if (status === "medium") return "text-orange-500";
  return "text-black";
};

const PasswordVisibilityToggle = ({ isVisible, onToggle, hasValue }: any) => {
  if (!hasValue) return null;
  return (
    <div className="absolute top-7.5 right-2 lg:top-[50%] lg:right-3">
      {isVisible ? (
        <FaEye
          color="#7B809A"
          className="cursor-pointer"
          size={20}
          onClick={onToggle}
        />
      ) : (
        <FaEyeSlash
          color="#7B809A"
          className="cursor-pointer"
          size={20}
          onClick={onToggle}
        />
      )}
    </div>
  );
};

const StatusMessage = ({ status, message }: any) => {
  if (status === "idle") return null;
  const isError = status === "error";
  const colorClass = isError ? "text-red-500" : "text-green-600";
  return <p className={`text-xs lg:text-sm ${colorClass}`}>{message}</p>;
};

const ConfirmPasswordStatusMessage = ({ status, message }: any) => {
  if (status === "idle") return null;
  const colorClass = status === "error" ? "text-red-500" : "text-black";
  return <p className={`text-xs lg:text-sm ${colorClass}`}>{message}</p>;
};

const LoginForm = () => {
  const {
    showHidePassword,
    setShowHidePassword,
    email,
    emailStatus,
    password,
    passwordStatus,
    handlePasswordChange,
    handleEmailChange,
    handleSubmit,
    handleNameChange,
    name,
    nameStatus,
    confirmPassword,
    confirmPasswordStatus,
    handleConfirmPasswordChange,
    isLogin,
    setIsLogin,
  }: any = useContext(LoginContext);

  const passwordBorderClass = getPasswordBorderClass(passwordStatus.status);
  const passwordTextColorClass = getPasswordTextColorClass(
    passwordStatus.status,
  );

  const loginWithGoogle = () => {
  window.location.href = "http://localhost:4000/auth/google";
};

  const loginWithMicrosoft = () => {
  window.location.href = "http://localhost:4000/auth/microsoft";
};

  const loginWithGithub = () => {
  window.location.href = "http://localhost:4000/auth/github";
};
  const loginWithTwitter = () => {
  window.location.href = "http://localhost:4000/auth/twitter";
};


  return (
    <section className="absolute top-[50%] left-[50%] mx-auto flex w-[90%] translate-[-50%] flex-col gap-2 rounded-xl bg-white/70 p-4 sm:w-fit lg:static lg:translate-0 xl:w-fit">
      {/* heading */}
      <div className="flex flex-col items-start gap-3">
        <h1 className="text-lg font-semibold lg:text-4xl">
          {isLogin ? (
            "Log In"
          ) : (
            "Sign Up"
          )}
        </h1>
      </div>

      {/* name input */}
      {!isLogin && (
        <div className="mx-auto mt-2 h-18 w-full sm:mt-4 sm:w-80 lg:mt-5 lg:h-20 lg:w-full xl:mt-4">
          <label htmlFor="name">
            <p className="form-label">Name</p>
            <input
              value={name}
              onChange={handleNameChange}
              name="name"
              id="name"
              type="text"
              autoComplete="on"
              placeholder="Name"
              className={`form-input ${
                nameStatus.status === "error"
                  ? "border-red-500 focus:border-red-500"
                  : "border-border focus:border-black"
              }`}
            />
          </label>

          <StatusMessage
            status={nameStatus.status}
            message={nameStatus.message}
          />
        </div>
      )}

      {/* email input */}
      <div
        className={`${isLogin ? "mt-2 lg:mt-5 xl:mt-5" : "mt-0"} mx-auto h-18 w-full sm:w-80 lg:h-20 lg:w-full`}
      >
        <label htmlFor="email">
          <p className="form-label">Email</p>
          <input
            value={email}
            onChange={handleEmailChange}
            name="email"
            id="email"
            type="email"
            autoComplete="on"
            placeholder="Enter your email address"
            className={`form-input ${
              emailStatus.status === "error"
                ? "border-red-500 focus:border-red-500"
                : "border-border focus:border-black"
            }`}
          />
        </label>

        <StatusMessage
          status={emailStatus.status}
          message={emailStatus.message}
        />
      </div>

      {/* password input */}
      <div className="relative mx-auto h-20 w-full sm:h-18 sm:w-80 lg:h-20 lg:w-fit">
        <div>
          <label htmlFor="password">
            <p className="form-label">Password</p>
            <input
              value={password}
              onChange={handlePasswordChange}
              placeholder={isLogin ? "Enter your password" : "Enter password"}
              className={`${passwordBorderClass} form-input pr-10 pl-4`}
              type={showHidePassword ? "text" : "password"}
              name="password"
              id="password"
              autoComplete="on"
            />
          </label>

          <PasswordVisibilityToggle
            isVisible={showHidePassword}
            onToggle={() => setShowHidePassword(!showHidePassword)}
            hasValue={password?.trim().length > 0}
          />
        </div>

        {passwordStatus.status !== "idle" && (
          <p className={`text-xs lg:text-sm ${passwordTextColorClass}`}>
            {passwordStatus.message}
          </p>
        )}
      </div>

      {/* forget your password */}
      {isLogin && (
        <button className="cursor-pointer self-end text-xs underline">
          Forgot your password?
        </button>
      )}

      {/* confirm password input */}
      {!isLogin && (
        <div className="relative mx-auto h-18 w-full sm:w-80 lg:h-20 lg:w-full">
          <div>
            <label htmlFor="confirmPassword">
              <p className="form-label">Confirm Password</p>
              <input
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm password"
                className={`${
                  confirmPasswordStatus.status === "error"
                    ? "border-red-500 focus:border-red-500"
                    : "border-border focus:border-black"
                } form-input pr-10 pl-4`}
                type={showHidePassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                autoComplete="on"
              />
            </label>

            <PasswordVisibilityToggle
              isVisible={showHidePassword}
              onToggle={() => setShowHidePassword(!showHidePassword)}
              hasValue={confirmPassword?.trim().length > 0}
            />
          </div>

          <ConfirmPasswordStatusMessage
            status={confirmPasswordStatus.status}
            message={confirmPasswordStatus.message}
          />
        </div>
      )}

      {/* sign in button */}

      <button
        onClick={handleSubmit}
        className="bg-dark-orange mt-2 h-10 w-full cursor-pointer p-2 text-xs font-bold text-white lg:mt-4"
      >
        {isLogin ? "LOG IN" : "SIGN UP"}
      </button>

      {/* google facebook login buttons */}
      {isLogin && (
        <>
          <div className="text-grey3 relative my-2 flex items-center justify-center gap-2 text-xs lg:my-4 lg:text-sm">
            <div className="bg-grey3 h-px w-full" />
            <p>or</p>
            <div className="bg-grey3 h-px w-full" />
          </div>

          <div className="flex w-full flex-col items-center gap-4">
          <div className="flex items-center gap-4">
              <button onClick={loginWithGithub} className="border-border w-30 flex  cursor-pointer items-center gap-4 rounded border bg-white p-3 text-xs lg:text-sm">
              <GithubLogin />
              Github
            </button>
            <button onClick={loginWithGoogle} className="border-border w-30 flex  cursor-pointer items-center gap-4 rounded border bg-white p-3 text-xs lg:text-sm">
              <GoogleLogin />
              Google
            </button>
          </div>
           
            <div className="flex items-center gap-4">
              <button onClick={loginWithMicrosoft} className="border-border w-30 flex  cursor-pointer items-center gap-4 rounded border bg-white p-3 text-xs lg:text-sm">
              <MicrosoftLogin />
              Microsoft
            </button>
            <button onClick={loginWithTwitter} className="border-border w-30 flex  cursor-pointer items-center gap-4 rounded border bg-white p-3 text-xs lg:text-sm">
              <TwitterLogin />
              Twitter
            </button>
            </div>
          </div>
        </>
      )}

      {/* sign up button */}

      <div className="text-grey mx-auto mt-2 flex w-full flex-col items-center gap-2 text-xs lg:mt-8 lg:text-sm">
        <p className="text-grey2">
          {isLogin ? "Don't" : "Already"} have an account?{" "}
        </p>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="bg-light-button mt-2 h-10 w-full cursor-pointer p-2 text-xs font-semibold text-black"
        >
          {isLogin ? "Create Account" : "Log In"}
        </button>
      </div>
    </section>
  );
};

export default LoginForm;
