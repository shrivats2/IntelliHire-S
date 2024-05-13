"use client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import useAuthStore from "@/store/useUserContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
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
import { Button } from "@/components/ui/button";
import { Copy, Share2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

interface JobDetailsProps {
  params: {
    jobId: string;
  };
}

interface Job {
  id: string;
  description: string;
  weights: string;
  title: string;
  status: string;
  aptitude_difficulty: string;
  skill_difficulty: string;
  applicants: Applicant[];
}

interface Applicant {
  id: number;
  rank: number;
  name: string;
  email: string;
}

const JobDetails = ({ params }: JobDetailsProps) => {
  const user = useAuthStore((state) => state.user);
  const [details, setDetails] = useState<Job>();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isJobActive, setIsJobActive] = useState(
    details?.status === "active" ? true : false
  );
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const link = `${process.env.NEXT_PUBLIC_WEB_URL}/job/${params.jobId}`;

  const router = useRouter();

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/job/${params.jobId}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        })
        .then((res) => {
          setDetails(res.data?.data);
          setIsJobActive(res.data?.data?.status === "active" ? true : false);
        })
        .catch((error) => {
          toast.info("Sorry job is no longer active.");
          console.log(error);

          router.push("/");
        });
    };

    if (user.access_token !== "") {
      fetchData();
    }
  }, [params.jobId, user.access_token]);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  if (!details) {
    return (
      <div className="flex flex-col gap-2">
        <div className="p-10">
          <Skeleton className="w-full h-48" />
        </div>
        <div className="p-10">
          <Skeleton className="w-full h-14" />
        </div>
      </div>
    );
  }
  const makeJobInactive = () => {
    setIsJobActive(!isJobActive);
  };

  const handleToggleChange = () => {
    if (isJobActive) {
      setShowConfirmationDialog(true);
    } else {
      makeJobInactive();
    }
  };

  const handleConfirmationDialogClose = () => {
    setShowConfirmationDialog(false);
  };

  const handleConfirmInactive = () => {
    try {
      axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/job/${details.id}`, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast.error("An error occurred while making job Inactive.");
      console.error(error.response);
    }
    makeJobInactive();
    setShowConfirmationDialog(false);
  };
  return (
    <>
      <Breadcrumb className="ml-5 mt-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="text-md">
            <BreadcrumbPage>
              <Link href={`/dashboard/jobs/${params.jobId}`}>Job</Link>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="p-10">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex justify-between">
                {details.title}
                <Dialog>
                  <DialogTrigger>
                    <Switch
                      checked={isJobActive}
                      onChange={handleToggleChange}
                      id="togglejob-mode"
                    />
                    <div className="flex items-center">
                      <Label htmlFor="togglejob-mode">
                        {" "}
                        {isJobActive ? "Active" : "Inactive"}
                      </Label>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently make
                        this job inactive.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        onClick={handleConfirmationDialogClose}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleConfirmInactive}>Confirm</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
                parse(details.description)
              ) : details.description.length > 100 ? (
                <div>{parse(details.description.substring(0, 100))}</div>
              ) : (
                details.description
              )}
              {details.description.length > 100 && (
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
        <div>
          <DataTable columns={columns} data={details.applicants} />
        </div>
      </div>
    </>
  );
};

export default JobDetails;
