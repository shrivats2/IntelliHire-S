"use client";
import { useEffect, useState } from "react";
import Q from "../../../../assets/Q.png";
import Image from "next/image";
import axios from "axios";
import useAuthStore from "@/store/useUserContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AssessmentProps {
  params: {
    jobid: string;
  };
}

const Assessment = ({ params }: AssessmentProps) => {
  const user = useAuthStore((state) => state.user);
  const [data, setData] = useState({});
  const [basicfit, setbasicfit] = useState(false);
  const [aptitude, setAptitude] = useState(false);
  const [skill, setSkill] = useState(false);
  const [mounted, setmounted] = useState(false);
  const [is_job_fit, setIsjobfit] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setmounted(true);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/job/${params.jobid}/assessment`,
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "*",
              Authorization: `Bearer ${user.access_token}`,
            },
          }
        );

        console.log(response.data.data);
        setAptitude(response.data.data.aptitude);
        setSkill(response.data.data.skill);
        setData(response.data.data);
        setbasicfit(response.data.data.job_fit);
        setIsjobfit(response.data.data.is_job_fit);
        // if (response.data.data.is_completed) {
        //   router.push(`/job/${params.jobid}/result`);
        //   return;
        // }
        if (response.data.data.job_fit) {
          if (response.data.data.job_fit_passed == false) {
            router.push(`/job/${params.jobid}/result`);
          }
        }
      } catch (error: any) {
        // if (error.response.status === 307) {
        //   navigate(`/job/${id}`);
        // }
        // setHasError(true);
        toast.error("Error fetching data. Please try again.");
      }
    };

    if (mounted) {
      fetchData();
    }
  }, [mounted]);
  return (
    <div>
      <div className="flex flex-wrap justify-center mt-5 ml-5">
        <h1 className="text-5xl font-bold">
          <span className="bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
            Get{" "}
            <span className="bg-gradient-to-b from-primary/60 to-[#00ff5e] text-transparent bg-clip-text">
              Hired
            </span>{" "}
            in
            <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
              Three
            </span>{" "}
            steps
          </span>
        </h1>
      </div>
      <div className="flex flex-col lg:flex-row xl:flex-row 2xl:flex-row gap-5 justify-center m-5">
        {/* !!!!!!!!!!!!!!!!!!!!!!!!!! JOB FIT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
        <div
          className={cn(
            " flex flex-col w-[300px] ",
            basicfit && "grayscale-[60%]"
          )}
        >
          <img
            src="https://image.freepik.com/free-vector/app-development-illustration_52683-47931.jpg"
            alt=""
            className="rounded-t-2xl shadow-2xl lg:w-[300px] 2xl:w-full 2xl:h-44 object-cover"
          />
          <div className="bg-white w-[300px] shadow-2xl rounded-b-3xl">
            <h2 className="text-center text-gray-800 text-2xl font-bold pt-6">
              Job Fit Check
            </h2>
            <div className="w-5/6 m-auto">
              <p className="text-center text-gray-500 pt-5">
                Assess how well your qualifications, experience, and values
                align with the requirements and culture of the job. This step
                helps ensure a strong match between your profile and the job
                profile.
              </p>
            </div>
            <div className="grid grid-cols-4 w-72 lg:w-5/6 m-auto bg-indigo-50 mt-5 p-4 lg:p-4 rounded-2xl">
              <div className="col-span-1">
                <Image
                  className="w-15 lg:w-12"
                  width={48}
                  height={48}
                  src={Q}
                  alt="music icon"
                />
              </div>
              <div className="col-span-2 pt-1">
                <p className="text-gray-800 font-bold lg:text-sm">Format</p>
                <p className="text-gray-500 text-sm">Mcq type Questions</p>
              </div>
              <div className="pt-2">
                <a
                  href="https://google.com"
                  className="text-indigo-700 underline hover:no-underline  text-sm hover:text-indigo-500 font-bold"
                >
                  Passed
                </a>
              </div>
            </div>
            <div className="bg-blue-700 w-72 cursor-pointer lg:w-5/6 m-auto mt-6 p-2 hover:bg-indigo-500 rounded-2xl  text-white text-center shadow-xl shadow-bg-blue-700">
              <button
                onClick={() => {
                  router.push(`/job/${params.jobid}/assessment/job-fit`);
                }}
                className="lg:text-sm text-lg font-bold cursor-pointer"
              >
                Start Test
              </button>
            </div>
            <div className="text-center m-auto mt-6 w-full h-16">
              <button className="text-gray-500 font-bold lg:text-sm hover:text-gray-900">
                Withdraw Application
              </button>
            </div>
          </div>
        </div>
        {/* !!!!!!!!!!!!!!!!!!!!!!!!!! Aptitude Assessment !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
        <div
          className={cn(
            " flex flex-col w-[300px] ",
            !aptitude ? "grayscale" : is_job_fit && "grayscale-[60%]"
          )}
        >
          <img
            src="https://image.freepik.com/free-vector/app-development-illustration_52683-47931.jpg"
            alt=""
            className="rounded-t-2xl shadow-2xl lg:w-[300px] 2xl:w-full 2xl:h-44 object-cover"
          />
          <div className="bg-white w-[300px] shadow-2xl rounded-b-3xl">
            <h2 className="text-center text-gray-800 text-2xl font-bold pt-6">
              Aptitude Assessment
            </h2>
            <div className="w-5/6 m-auto">
              <p className="text-center text-gray-500 pt-5">
                Measure your cognitive abilities, problem-solving skills, and
                logical reasoning. This assessment provides insights into your
                capacity to learn, adapt, and excel in tasks relevant to the
                job.
              </p>
            </div>
            <div className="grid grid-cols-4 w-72 lg:w-5/6 m-auto bg-indigo-50 mt-5 p-4 lg:p-4 rounded-2xl">
              <div className="col-span-1">
                <Image
                  className="w-15 lg:w-12"
                  width={48}
                  height={48}
                  src={Q}
                  alt="music icon"
                />
              </div>
              <div className="col-span-3 pt-1">
                <p className="text-gray-800 font-bold lg:text-sm">Format</p>
                <p className="text-gray-500 text-sm">Mcq type Questions</p>
              </div>
              {/* <div className="pt-2">
              <a
                href="https://google.com"
                className="text-indigo-700 underline hover:no-underline  text-sm hover:text-indigo-500 font-bold"
              >
                Change
              </a>
            </div> */}
            </div>
            <div className="bg-blue-700 w-72 lg:w-5/6 m-auto mt-6 p-2 hover:bg-indigo-500 rounded-2xl  text-white text-center shadow-xl shadow-bg-blue-700 cursor-pointer">
              <button
                onClick={() => {
                  router.push(`/job/${params.jobid}/assessment/aptitude`);
                }}
                disabled={aptitude}
                className="lg:text-sm text-lg font-bold cursor-pointer"
              >
                Start Test
              </button>
            </div>
            <div className="text-center m-auto mt-6 w-full h-16">
              <button className="text-gray-500 font-bold lg:text-sm hover:text-gray-900">
                Withdraw Application
              </button>
            </div>
          </div>
        </div>

        {/* !!!!!!!!!!!!!!!!!!!!!!!!!! Skill Assessment !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}

        <div
          className={cn(
            " flex flex-col w-[300px] ",
            skill ? "grayscale-[60%]" : "grayscale"
          )}
        >
          <img
            src="https://image.freepik.com/free-vector/app-development-illustration_52683-47931.jpg"
            alt=""
            className="rounded-t-2xl shadow-2xl lg:w-[300px] 2xl:w-full 2xl:h-44 object-cover"
          />
          <div className="bg-white w-[300px] shadow-2xl rounded-b-3xl">
            <h2 className="text-center text-gray-800 text-2xl font-bold pt-6">
              Skill Assessment
            </h2>
            <div className="w-5/6 m-auto h-[188px]">
              <p className="text-center text-gray-500 pt-5">
                Demonstrate your expertise in specific skills essential for the
                job. Showcase your hands-on capabilities and proficiency in
                areas crucial to performing the tasks associated with the role.
              </p>
            </div>
            <div className="grid grid-cols-4 w-72 lg:w-5/6 m-auto bg-indigo-50 mt-5 p-4 lg:p-4 rounded-2xl">
              <div className="col-span-1">
                <Image
                  className="w-15 lg:w-12"
                  width={48}
                  height={48}
                  src={Q}
                  alt="music icon"
                />
              </div>
              <div className="col-span-3 pt-1">
                <p className="text-gray-800 font-bold lg:text-sm">Format</p>
                <p className="text-gray-500 text-sm">Mcq type Questions</p>
              </div>
              {/* <div className="pt-2">
              <a
                href="https://google.com"
                className="text-indigo-700 underline hover:no-underline  text-sm hover:text-indigo-500 font-bold"
              >
                Change
              </a>
            </div> */}
            </div>
            <div className="bg-blue-700 w-72 cursor-pointer lg:w-5/6 m-auto mt-6 p-2 hover:bg-indigo-500 rounded-2xl  text-white text-center shadow-xl shadow-bg-blue-700">
              <button
                onClick={() => {
                  router.push(`/job/${params.jobid}/assessment/skill`);
                }}
                className="lg:text-sm text-lg font-bold cursor-pointer"
              >
                Start Test
              </button>
            </div>
            <div className="text-center m-auto mt-6 w-full h-16">
              <button className="text-gray-500 font-bold lg:text-sm hover:text-gray-900">
                Withdraw Application
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center m-5">
        <Link href={`/job/${params.jobid}/result`}>
          <Button className="w-[200px] text-lg font-[500]">Go to Result</Button>
        </Link>
      </div>
    </div>
  );
};

export default Assessment;
