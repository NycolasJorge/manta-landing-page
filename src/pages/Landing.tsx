import Header from '@/components/Header';
import WhyChooseManta from '@/components/WhyChooseManta';
import InteractiveForm from '@/components/InteractiveForm';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <WhyChooseManta />
      <InteractiveForm />
    </div>
  );
};

export default Landing;