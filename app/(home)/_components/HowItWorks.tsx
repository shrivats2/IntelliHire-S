import { Activity, Group, NotebookPen } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { MedalIcon, MapIcon, PlaneIcon, GiftIcon } from "./Icons";

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <Group strokeWidth={0.8} size={56} color="#16a34a" />,
    title: "Efficient Sourcing",
    description:
      "Say goodbye to traditional sourcing methods. Intelli Hire supercharges candidate sourcing, ensuring you find the best talent quickly and effortlessly.",
  },
  {
    icon: <MapIcon />,
    title: "AI-Powered Screening",
    description:
      "No more manual screening. Intelli Hire utilizes cutting-edge AI technology to screen candidates efficiently, saving you time and effort.",
  },
  {
    icon: <NotebookPen strokeWidth={0.8} size={56} color="#16a34a" />,
    title: "Customized Evaluation",
    description:
      "Tailor the evaluation criteria to your needs. Intelli Hire's dashboard allows recruiters to modify parameters and weighting factors, giving you full control over the hiring process.",
  },
  {
    icon: <Activity strokeWidth={0.8} size={56} color="#16a34a" />,
    title: "Real-Time Insights",
    description:
      "Stay informed with real-time data. Intelli Hire provides recruiters with a dashboard to track the number of candidates who have applied for a job and how many have been selected for further interview rounds.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="howItWorks" className="container text-center py-16 sm:py-16">
      <h2 className="text-3xl md:text-4xl font-bold ">
        How It{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Works{" "}
        </span>
        Step-by-Step Guide
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        Revolutionize your hiring process with Intelli Hire's advanced features.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis dolor
        pariatur sit!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ icon, title, description }: FeatureProps) => (
          <Card key={title} className="bg-muted/50">
            <CardHeader>
              <CardTitle className="grid gap-4 place-items-center">
                {icon}
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
