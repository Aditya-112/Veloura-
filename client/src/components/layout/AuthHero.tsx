import { Sparkles, Shirt, WandSparkles } from "lucide-react";

const AuthHero = () => {
  return (
    <div className="hidden h-full flex-col justify-center lg:flex">
     <div
          className="
          inline-flex
          w-fit
          items-center
          rounded-full
          border
          border-white/60
          bg-white/40
          backdrop-blur-xl
          px-5
          py-2.5
          text-sm
          font-semibold
          tracking-wide
          text-violet-700
          shadow-lg
          "
          >
        ✨ AI Powered Fashion
      </div>

      <h1
        className="
        mt-10
        text-[65px]
        font-bold
        leading-[0.95]
        tracking-[-0.05em]
        text-slate-900
        "
        >
        Dress
        <br />
        Smarter.
      </h1>

              <p
          className="
          mt-8
          max-w-[500px]
          text-[18px]
          leading-10
          text-slate-600
          "
          >
        Organise your wardrobe, discover AI-powered outfit
        recommendations and never wonder what to wear again.
      </p>

              <div
        className="
        mt-10
        h-[2px]
        w-32
        rounded-full
        bg-gradient-to-r
        from-violet-500
        to-transparent
        "
        />

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
    <div
        className="
        flex
        items-start
        gap-5
        transition-all
        duration-300
        hover:translate-x-2
        "
        >
              <div
        className="
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-2xl
        border
        border-white/60
        bg-white/45
        backdrop-blur-xl
        text-violet-600
        shadow-lg
        "
>
        {icon}
      </div>

      <div>
       <h3
      className="
      text-lg
      font-bold
      text-slate-900
      "
      >
          {title}
        </h3>

        <p
          className="
          mt-1
          leading-7
          text-slate-500
          "
          >
          {description}
        </p>
      </div>
    </div>
  );
};

export default AuthHero;