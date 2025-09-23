import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  text: string;
}

const FeatureCard = ({ icon, text }: FeatureCardProps) => {
  return (
    <div className="feature-card">
      <div className="flex items-start space-x-4 md:space-x-4">
        <div className="flex-shrink-0 text-primary [&>img]:w-12 [&>img]:h-12 md:[&>img]:w-8 md:[&>img]:h-8">
          {icon}
        </div>
        <p className="text-lg font-semibold md:font-medium leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;