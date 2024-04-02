import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { MedalIcon, MapIcon, PlaneIcon } from "./Icons";
import Image from "next/legacy/image";

interface ServiceProps {
  title: string;
  description: string;
  icon: JSX.Element;
}

const serviceList: ServiceProps[] = [
  {
    title: "Efficient Candidate Sourcing",
    description:
      "Intelli-Hire revolutionizes candidate sourcing by leveraging AI technology. Say goodbye to traditional methods and effortlessly find the perfect candidates.",
    icon: <MedalIcon />,
  },
  {
    title: "AI-Powered Resume Screening",
    description:
      "Streamline your hiring process with Intelli-Hire's AI-powered resume screening. No more manual screening - save time and effort with instant results.",
    icon: <MapIcon />,
  },
  {
    title: "Customizable Evaluation Criteria",
    description:
      "Tailor the evaluation criteria to your needs with Intelli-Hire's customizable parameters. Take full control of your hiring process and ensure precise matches with job requirements.",
    icon: <PlaneIcon />,
  },
];

export const Services = () => {
  return (
    <section className="container py-16 sm:py-16">
      <div className="grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              Revolutionizing{" "}
            </span>
            the Hiring Process
          </h2>

          <p className="text-muted-foreground text-xl mt-4 mb-8 ">
            Say goodbye to manual screening and lengthy waiting periods. With
            Intelli-Hire, find the perfect candidates efficiently and receive
            instant feedback on applications.
          </p>

          <div className="flex flex-col gap-8">
            {serviceList.map(({ icon, title, description }: ServiceProps) => (
              <Card key={title}>
                <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                  <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
                    {icon}
                  </div>
                  <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className="text-md mt-2">
                      {description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <div className="relative w-[300px] md:w-[500px] lg:w-[600px] rounded-lg border-[#e5e7eb] border-[1px]">
          <Image
            src="/resume-analysis.png"
            width={100}
            height={100}
            layout="responsive"
            objectFit="contain"
            alt="Resume Analysis"
            className="rounded-lg border-[#e5e7eb] border-[1px]"
          />
        </div>
      </div>
    </section>
  );
};
