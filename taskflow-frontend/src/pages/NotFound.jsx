import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container" style={{ paddingBlock: "4rem", textAlign: "center" }}>
      <h1>Page not found</h1>
      <p style={{ margin: "0 auto 1.5rem" }}>The page you're looking for doesn't exist or was moved.</p>
      <Link to="/" className="btn btn-primary">
        Go home
      </Link>
    </div>
  );
}
