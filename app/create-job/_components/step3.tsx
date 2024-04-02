"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useCreateJob from "@/store/useCreateJob";
import useAuthStore from "@/store/useUserContext";
import axios from "axios";
import {
  Code,
  FigmaIcon,
  FolderKanban,
  HardHat,
  LucideGraduationCap,
  SendIcon,
  Trophy,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const initialState = {
  education: 5,
  experience: 5,
  skills: 8,
  projects: 8,
  achievements: 3,
  coding_profiles: 3,
  test_score: 5,
};

const Step3 = () => {
  const user = useAuthStore((state) => state.user);

  const [weights, setWeights] = useState(initialState);
  const jobTitle = useCreateJob((state) => state.job_title);
  const description = useCreateJob((state) => state.job_description);
  const questions = useCreateJob((state) => state.questions_added);
  const reset = useCreateJob((state) => state.reset);

  const router = useRouter();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setWeights((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClick = () => {
    const body = {
      description: description,
      title: jobTitle,
      weights: JSON.stringify(weights),
      status: "active",
      quiz_questions: questions,
      aptitude_difficulty: "mix",
      skill_difficulty: "easy",
      is_job_fit: "true",
      is_aptitude: "true",
      is_skill: "true",
    };

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/create-job`, body, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      })
      .then((res) => {
        reset();
        toast.success("Job posted successfully. Check dashboard ✅");
        router.push("/dashboard");
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error(
          error?.response?.data?.detail ||
            "An error occured generating job description"
        );
      });
  };
  return (
    <div>
      <div className="mb-4 text-xl font-extrabold  md:text-xl lg:text-xl text-transparent bg-clip-text bg-gradient-to-r to-green-600 from-emerald-400">
        Assign weights to indicate the importance of each section based on your
        job description and role. Higher weights emphasize greater
        significance.(0 - 10)
      </div>

      <div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <Label
              htmlFor="education"
              className="flex flex-wrap text-lg gap-1 justify-start items-center"
            >
              Education <LucideGraduationCap /> :
            </Label>
            <Input
              name="education"
              onChange={handleChange}
              id="education"
              value={weights.education}
              type="number"
              min="0"
              max="10"
              defaultValue="0"
              required
              className="col-span-2 border-green-600"
            />
          </div>

          <div className="grid grid-cols-2 items-center gap-4">
            <Label
              htmlFor="experience"
              className="flex flex-wrap text-lg gap-1  items-center"
            >
              Experience <HardHat /> :
            </Label>
            <Input
              name="experience"
              onChange={handleChange}
              value={weights.experience}
              id="experience"
              type="number"
              min="0"
              max="10"
              required
              defaultValue="0"
              className="col-span-2 border-green-600"
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label
              htmlFor="skills"
              className="flex flex-wrap text-lg gap-1  items-center"
            >
              Skills <FigmaIcon /> :
            </Label>
            <Input
              name="skills"
              onChange={handleChange}
              value={weights.skills}
              id="skills"
              type="number"
              min="0"
              max="10"
              required
              defaultValue="0"
              className="col-span-2 border-green-600"
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label
              htmlFor="projects"
              className="flex flex-wrap text-lg gap-1  items-center"
            >
              Projects <FolderKanban /> :
            </Label>
            <Input
              name="projects"
              value={weights.projects}
              onChange={handleChange}
              id="projects"
              type="number"
              min="0"
              max="10"
              required
              defaultValue="0"
              className="col-span-2 border-green-600"
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label
              htmlFor="achievements"
              className="flex flex-wrap text-lg gap-1 items-center"
            >
              Achievements <Trophy /> :
            </Label>
            <Input
              name="achievements"
              value={weights.achievements}
              onChange={handleChange}
              id="achievements"
              type="number"
              min="0"
              max="10"
              required
              defaultValue="0"
              className="col-span-2 border-green-600"
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label
              htmlFor="coding"
              className="flex flex-wrap text-lg gap-1 items-center"
            >
              Coding Profiles <Code /> :
            </Label>
            <Input
              name="coding_profiles"
              value={weights.coding_profiles}
              onChange={handleChange}
              id="coding"
              type="number"
              min="0"
              max="10"
              required
              defaultValue="0"
              className="col-span-2 border-green-600"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center m-16">
        <button
          onClick={handleClick}
          className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800"
        >
          <span className="relative text-lg font-bold flex justify-center items-center gap-3 px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Post <SendIcon />
          </span>
        </button>
      </div>
    </div>
  );
};

export default Step3;
