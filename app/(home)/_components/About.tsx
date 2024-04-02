import { Statistics } from "./Statistics";
import pilot from "../../../assets/pilot.png";
import Image from "next/image";

export const About = () => {
  return (
    <section id="about" className="container py-16 sm:py-16">
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <Image
            src={pilot}
            width={300}
            height={300}
            alt="IntelliHire Image"
            className="w-[300px] object-contain rounded-lg"
          />
          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  About{" "}
                </span>
                IntelliHire
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
                IntelliHire is an innovative platform that transforms the
                traditional hiring process. With cutting-edge AI algorithms, we
                revolutionize the way employers find and evaluate candidates,
                making recruitment efficient and insightful.
              </p>
              <p className="text-xl text-muted-foreground mt-4">
                Our mission is to eliminate the delays caused by keyword-based
                ATS systems. IntelliHire provides instant eligibility verdicts,
                ensuring that employers quickly identify the ideal candidates
                for their roles.
              </p>
            </div>

            <Statistics />
          </div>
        </div>
      </div>
    </section>
  );
};
