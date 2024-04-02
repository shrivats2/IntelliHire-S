"use client";

import useAuthStore from "@/store/useUserContext";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import JobCard from "./_components/jobcard";
import { Skeleton } from "@/components/ui/skeleton";
import Filter from "./_components/filter";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Props = {};
interface Job {
  id: String;
  status: String;
  title: String;
}
const Dashboard = (props: Props) => {
  const isUser = useAuthStore((state) => state.user);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [initialLoad, setInitialLoad] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value || "");
  };

  useEffect(() => {
    setLoading(true);
    if (!initialLoad) {
      setInitialLoad(true);
      return;
    }
    if (isUser.access_token === "") {
      router.push("/login");
      return;
    }
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
        headers: {
          Authorization: `Bearer ${isUser.access_token}`,
        },
      })
      .then((res) => {
        console.log(res?.data);
        setJobs(res?.data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("An error occurred fetching jobs");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [initialLoad, isUser.access_token, router]);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return isUser.access_token !== "" ? (
    <>
      <Breadcrumb className="ml-5 mt-3">
        <BreadcrumbList>
          <BreadcrumbItem className="text-md">
            <BreadcrumbLink>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="text-md">
            <BreadcrumbPage>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="p-6">
        <div className="relative flex  group">
          <div className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
          {isUser.role === "employer" && (
            <Link href="/create-job" className="m-auto">
              <button className="m-auto relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">
                Add New Job
              </button>
            </Link>
          )}
        </div>
        <div className="flex flex-col lg:flex-row xl:flex-row lg:h-full pt-3 xl:h-full">
          <div className=" basis-1/5">
            <Filter />
          </div>
          <div className="p-4 basis-4/5">
            <div className="flex justify-between">
              <p className="text-lg font-bold pb-4">Results</p>
              <div className="pb-4">
                <Input
                  onChange={handleSearch}
                  placeholder="Search"
                  className="w-[150px] md:w-[300px] xl:w-[300px] lg:w-[300px] rounded-r-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 placeholder:text-[#9eff78]"
                />
              </div>
            </div>
            <div className="rounded-xl grid grid-cols-1 gap-4 lg:grid-cols-3">
              {loading ? (
                <JobsSkeleton />
              ) : (
                filteredJobs.map((job, key) => (
                  <JobCard key={key} job={job} role={isUser.role} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <div className="flex flex-col lg:flex-row xl:flex-row 2xl:flex-row gap-10 w-full h-[90vh]">
      <div className="flex flex-col lg:flex-row xl:flex-row 2xl:flex-row gap-10 m-5">
        <Skeleton className="h-full w-[30%]" />
        <div className="flex flex-wrap gap-5">
          {[...Array(4)].map((_, i) => (
            <Skeleton className="h-[225px] w-[350px] rounded-xl" key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const JobsSkeleton = () => {
  return (
    <>
      {[...Array(4)].map((_, i) => (
        <Skeleton
          className="h-[225px] w-[450px] rounded-xl col-span-2"
          key={i}
        />
      ))}
    </>
  );
};

export default Dashboard;
