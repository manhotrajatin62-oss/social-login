import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section className="mt-20 flex h-100 w-full flex-col items-center justify-center">
      <h1 className="mb-10 text-4xl">404! This page does not exist</h1>

      <button onClick={() => navigate("/")}>
        {"Back To Homepage"}
      </button>
    </section>
  );
};

export default NotFound;
