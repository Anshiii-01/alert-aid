import React from "react";
import "./showcase.css";

const CallToAction: React.FC = () => {
  return (
    <section className="showcase-cta">
      <h2>Explore Alert-AID</h2>
      <p>View the live application or explore the source code.</p>

      <div className="cta-buttons">
        <a
          href="https://alert-aid.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Live Demo
        </a>

        <a
          href="https://github.com/Anshiii-01/alert-aid"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Repo
        </a>
      </div>
    </section>
  );
};

export default CallToAction;
