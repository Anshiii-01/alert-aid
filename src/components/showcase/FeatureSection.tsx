import React from "react";
import "./showcase.css";

interface FeatureSectionProps {
  title: string;
  description: string;
  icon: string;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <section className="showcase-feature">
      <span className="feature-icon">{icon}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  );
};

export default FeatureSection;
