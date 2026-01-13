import React from "react";
import HeroSection from "../components/showcase/HeroSection";
import FeatureSection from "../components/showcase/FeatureSection";
import CallToAction from "../components/showcase/CallToAction";

const ProjectShowcase: React.FC = () => {
  return (
    <main>
      <HeroSection />

      <FeatureSection
        title="AI-Powered Predictions"
        description="Alert-AID leverages AI models to predict potential disaster scenarios early, enabling faster and smarter response planning."
        icon="🤖"
      />

      <FeatureSection
        title="Real-Time Alerts"
        description="Receive instant alerts during emergencies to stay informed and take timely action when it matters most."
        icon="🚨"
      />

      <FeatureSection
        title="Interactive Evacuation Maps"
        description="Visualize evacuation routes and affected zones through intuitive, interactive maps designed for clarity and speed."
        icon="🗺️"
      />

      <CallToAction />
    </main>
  );
};

export default ProjectShowcase;
