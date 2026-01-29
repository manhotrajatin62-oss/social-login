import LoginForm from "./LoginForm";
import home from "../assets/home.jpg";

const LoginPage = () => {
  return (
    <main className="flex h-dvh w-dvw">
      {/* Login form section */}
      <div className="flex w-full items-center justify-between">
        <LoginForm />
        <div className="h-full w-full lg:h-[90%] lg:w-[60%]">
          <img src={home} className="h-full w-full object-cover" alt="home" />
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
