import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "How does Intelli-Hire evaluate candidate resumes?",
    answer:
      "Intelli-Hire utilizes advanced AI algorithms to analyze various aspects of candidate resumes, including projects, skills, work experience, cultural fit, and aptitude. This comprehensive evaluation ensures precise matching with job requirements.",
    value: "item-1",
  },
  {
    question: "Can I customize the evaluation criteria with Intelli-Hire?",
    answer:
      "Yes, Intelli-Hire offers a customizable evaluation system. Recruiters can modify parameters and weighting factors according to their specific needs, providing flexibility in the hiring process.",
    value: "item-2",
  },
  {
    question: "What benefits do candidates receive with Intelli-Hire?",
    answer:
      "Candidates using Intelli-Hire receive instant feedback on their applications, eliminating the need for lengthy waiting periods. They also benefit from a streamlined application process and increased transparency in the hiring process.",
    value: "item-3",
  },
  {
    question: "Does Intelli-Hire support integration with existing HR systems?",
    answer:
      "Yes, Intelli-Hire is designed to seamlessly integrate with existing HR systems, allowing for easy adoption and integration into your organization's workflow.",
    value: "item-4",
  },
  {
    question: "Is Intelli-Hire suitable for companies of all sizes?",
    answer:
      "Yes, Intelli-Hire is suitable for companies of all sizes, from startups to large enterprises. Its scalable and customizable features cater to the diverse hiring needs of different organizations.",
    value: "item-5",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="container py-16 sm:py-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Frequently Asked{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Questions
        </span>
      </h2>

      <Accordion type="single" collapsible className="w-full AccordionRoot">
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="font-medium mt-4">
        Still have questions?{" "}
        <a
          href="#contact"
          className="text-primary transition-all border-primary hover:border-b-2"
        >
          Contact us
        </a>
      </h3>
    </section>
  );
};
