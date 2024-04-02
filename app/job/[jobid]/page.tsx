"use client";

import React, { useEffect, useState } from "react";
import ApplyJobCard from "./_components/applyjobcard";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Upload from "./_components/upload";
import { toast } from "sonner";
import axios from "axios";
import useAuthStore from "@/store/useUserContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ApplyJobProps {
  params: {
    jobid: string;
  };
}

const ApplyJob = ({ params }: ApplyJobProps) => {
  const user = useAuthStore((state) => state.user);
  const [domLoaded, setDomLoaded] = useState(false);
  const [isResumeUploaded, setIsResumeUploaded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const router = useRouter();

  const handleMouseMove = (e: any) => {
    setPosition({ x: e.clientX, y: e.clientY });
    console.log(position);
  };

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  const handleClick = () => {
    if (!isResumeUploaded) {
      toast.error("Resume is required");
      return;
    }
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/job/${params.jobid}/apply`,
        {},
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      )
      .then((res) => {
        router.push(`/job/${params.jobid}/assessment`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const pointerStyles: React.CSSProperties = {
    pointerEvents: "none",
    position: "absolute",
    transition: "opacity 0.15s",
    opacity: 1,
    left: "0",
    top: "0",
    width: "168px",
    height: "168px",
    transform: "translate(-50%, -50%)",
    backgroundImage:
      "radial-gradient(84px, rgb(66 163 33 / 23%), rgb(0 64 26 / 0%))",
  };
  if (typeof window !== "undefined") {
    pointerStyles.left = `${position.x + window.scrollX - 14}px`;
    pointerStyles.top = `${position.y + window.scrollY - 24}px`;
  }

  return (
    domLoaded && (
      <div onMouseMove={handleMouseMove} className="apply-grid dark:dar-grid">
        <div style={pointerStyles}></div>
        <div className="p-3 lg:p-10 xl:p-10">
          <ApplyJobCard jobid={params.jobid} />

          <div className="mt-16">
            <Upload
              isResumeUploaded={isResumeUploaded}
              setIsResumeUploaded={setIsResumeUploaded}
            />
          </div>

          <div className="mt-4 flex justify-center">
            <Button onClick={handleClick}>Apply</Button>
          </div>
        </div>
      </div>
    )
  );
};

export default ApplyJob;
