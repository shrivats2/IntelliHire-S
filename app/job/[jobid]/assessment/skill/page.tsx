"use client";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/useUserContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import Landing from "./components/components/Landing";
import { Card, CardContent } from "@/components/ui/card";

interface SkillProps {
  params: {
    jobid: string;
  };
}

const Skill = ({ params }: SkillProps) => {
  const id = params.jobid;
  const data = [
    { id: 1, answer_index: 2 },
    { id: 4, answer_index: 5 },
    { id: 5, answer_index: 5 },
  ];
  const user = useAuthStore((state) => state.user);

  const router = useRouter();

  const handleClick = async () => {
    try {
      console.log(data);
      const payload = { answers: data };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/job/${id}/assessment/skill`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      );

      console.log(response.data);
      router.push(`/job/${id}/assessment`);
    } catch (error: any) {
      console.error("Error posting data:", error.message);
    }
  };
  return (
    <div>
      <div className="flex flex-wrap m-5">
        <Card>
          <CardContent className="mt-5">
            <p>{`The cost of a stock on each day is given in an array, find the max profit that you can make by buying and selling in those days. For example, if the given array is {100, 180, 260, 310, 40, 535, 695}, the maximum profit can earned by buying on day 0, selling on day 3. Again buy on day 4 and sell on day 6. If the given array of prices is sorted in decreasing order, then profit cannot be earned at all.`}</p>
          </CardContent>
        </Card>
      </div>
      <Landing />
      <div className="flex justify-center m-10">
        <Button
          className="w-[200px] text-2xl"
          onClick={handleClick}
          color="primary"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Skill;
