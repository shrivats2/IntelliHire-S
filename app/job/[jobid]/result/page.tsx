"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactHtmlParser from "react-html-parser";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useUserContext";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import result from "../../../../assets/result.png";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface ResultProps {
  params: {
    jobid: string;
  };
}

const Result = ({ params }: ResultProps) => {
  const [finalverdict, setFinalVerdict] = useState<{
    title: string;
    description: string;
    candidate_status: string;
  }>({ title: "", description: "", candidate_status: "" });
  const [loading, setLoading] = useState(false);
  const id = params.jobid;
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const link = `${process.env.NEXT_PUBLIC_WEB_URL}/job/${id}`;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const handleBackNavigation = () => {
        router.push("/");
      };

      window.addEventListener("popstate", handleBackNavigation);

      return () => {
        window.removeEventListener("popstate", handleBackNavigation);
      };
    }
  }, [router, mounted]);

  useEffect(() => {
    setLoading(true);
    if (mounted) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/job/${id}/result`, {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            Authorization: `Bearer ${user.access_token}`,
          },
        })
        .then((res) => {
          console.log(res?.data?.data);
          setFinalVerdict(res?.data?.data[0]);
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [mounted]);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return mounted ? (
    <>
      <div className="main">
        <div className="gradient"></div>
      </div>
      <div className="flex flex-col">
        {!loading ? (
          <>
            <Card className="m-5">
              <CardHeader>
                <CardTitle>
                  <div className="flex justify-between">
                    {finalverdict.title}
                  </div>
                </CardTitle>
                <CardDescription>
                  <div className="flex gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-emerald-200 text-emerald-800 p-1 text-[10px] md:text-xs lg:text-xs"
                    >
                      Remote
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-fuchsia-300 text-fuchsia-900 p-1 text-[10px] md:text-xs lg:text-xs"
                    >
                      Full-Time
                    </Badge>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="break-words">
                <div className="flex flex-col">
                  {isExpanded ? (
                    ReactHtmlParser(finalverdict.description)
                  ) : finalverdict.description.length > 100 ? (
                    <div>
                      {ReactHtmlParser(
                        finalverdict.description.substring(0, 100)
                      )}
                    </div>
                  ) : (
                    finalverdict.description
                  )}
                  {finalverdict.description.length > 100 && (
                    <button
                      onClick={toggleDescription}
                      className="text-emerald-600 cursor-pointer"
                    >
                      {isExpanded ? "Read Less" : "Read More"}
                    </button>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Share link</DialogTitle>
                        <DialogDescription>
                          Anyone who has this link will be able to apply.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                          <Label htmlFor="link" className="sr-only">
                            Link
                          </Label>
                          <Input id="link" defaultValue={link} readOnly />
                        </div>
                        <Button
                          type="submit"
                          size="sm"
                          className="px-3"
                          onClick={() => {
                            navigator.clipboard.writeText(link);
                            toast.info("Link Copied.");
                          }}
                        >
                          <span className="sr-only">Copy</span>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                          <Button type="button" variant="secondary">
                            Close
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
            <div className="dashboard-container">
              <div className="dashboard">
                <Image width={600} height={600} alt="result" src={result} />
              </div>
              <div className="summary">
                <h1 className="summary__header">Summary</h1>
                <div id="summary__category">
                  {/* Based on the evaluation of your resume and skill assessment, we
              have determined that you have achieved a{" "}
              {finalverdict.candidate_score}% match.
              <div style={{ height: "30px" }}></div> */}
                  {finalverdict.candidate_status === "selected" && (
                    <div>
                      Therefore, we are pleased to inform you that we have
                      decided to proceed with your application. You will soon
                      receive an email from us detailing the next steps of the
                      selection process.
                    </div>
                  )}
                  {finalverdict.candidate_status === "rejected" && (
                    <div>
                      Regrettably, after careful consideration, we have decided
                      not to proceed further with your application. However, we
                      would like to extend our best wishes to you for all your
                      future endeavors.
                    </div>
                  )}
                  {finalverdict.candidate_status === "pending" && (
                    <div>
                      We are currently processing your application. You will get
                      to know your status soon.
                    </div>
                  )}
                </div>
                <Button className="continue" type="button">
                  <a className="text-card" href="/dashboard">
                    Go to Dashboard
                  </a>
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="loader">
            <div className="lds-roller">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <p
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#ff31a9",
              }}
            >
              Preparing Verdict...
            </p>
          </div>
        )}
      </div>
    </>
  ) : (
    <ResultSkeleton />
  );
};

const ResultSkeleton = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-10 m-10">
      <Skeleton className="h-48 w-[100%]">
        <div className="flex flex-col gap-3 justify-center items-center h-full">
          <Skeleton className="h-4 w-[90%] bg-slate-400" />
          <Skeleton className="h-4 w-[90%] bg-slate-400" />
          <Skeleton className="h-4 w-[90%] bg-slate-400" />
          <Skeleton className="h-4 w-[90%] bg-slate-400" />
        </div>
      </Skeleton>
      <div className="flex justify-center">
        <Skeleton className="h-52 w-[300px] lg:w-[600px] xl:w-[600px] 2xl:w-[600px]">
          <div className="flex gap-5 mt-5">
            <Skeleton className="h-40 w-52  bg-slate-400 ml-5" />
            <div className="flex flex-col gap-5 mt-5 ml-1 w-[90%]">
              <Skeleton className="h-4 w-[80%]  bg-slate-400 ml-auto" />
              <Skeleton className="h-4 w-[80%]  bg-slate-400 ml-auto" />
              <Skeleton className="h-4 w-[80%]  bg-slate-400 ml-auto" />
            </div>
          </div>
        </Skeleton>
      </div>
    </div>
  );
};
export default Result;
