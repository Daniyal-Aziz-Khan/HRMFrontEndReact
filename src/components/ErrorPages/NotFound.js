import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      {/* <h2>Page not found!</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia alias
        cupiditate ad nostrum doloribus iste tempora quisquam excepturi
        repellat, fugit cumque dolore magni possimus inventore neque provident!
        Sunt, quo eos?
      </p>

      <p>
        Go to the <Link to="/">Back To Dashboard</Link>.
      </p> */}

      <div className="text-center">
        <div className="error mx-auto" data-text="404">
          404
        </div>
        <p className="lead text-gray-800 mb-5">Page Not Found</p>
        <p className="text-gray-500 mb-0">
          It looks like you found a glitch in the matrix...
        </p>
        <Link to="/">← Back to Dashboard</Link>
      </div>
    </>
  );
}
