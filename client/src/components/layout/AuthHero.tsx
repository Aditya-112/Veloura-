import { Sparkles, Shirt, WandSparkles } from "lucide-react";

const AuthHero = () => {
  return (
    <div className="hidden h-full flex-col justify-center lg:flex">
      <div className="inline-flex w-fit items-center rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700">
        ✨ AI Powered Fashion
      </div>

      <h1 className="mt-8 text-6xl font-bold leading-tight text-slate-900">
        Dress
        <br />
        Smarter.
      </h1>

      <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
        Organise your wardrobe, discover AI-powered outfit
        recommendations and never wonder what to wear again.
      </p>

      <div className="mt-12 space-y-6">
        <Feature
          icon={<Shirt size={22} />}
          title="Smart Wardrobe"
          description="Automatically categorise every clothing item."
        />

        <Feature
          icon={<Sparkles size={22} />}
          title="AI Outfit Suggestions"
          description="Personalised recommendations for every occasion."
        />

        <Feature
          icon={<WandSparkles size={22} />}
          title="Weather Aware"
          description="Looks tailored for today's weather."
        />
      </div>
    </div>
  );
};

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature = ({
  icon,
  title,
  description,
}: FeatureProps) => {
  return (
    <div className="flex gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
        {icon}
      </div>

      <div>
        <h3 className="font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
};

export default AuthHero;