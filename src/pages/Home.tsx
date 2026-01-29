import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section>
      <h1 className="text-5xl">Welcome to Homepage</h1>
      <Link to={"/login"}><button>Login</button></Link>
    </section>
  );
};

export default Home;
