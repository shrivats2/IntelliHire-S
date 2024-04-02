import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CircleIcon } from "lucide-react";
import Link from "next/link";

interface Job {
  id: String;
  status: String;
  title: String;
}
interface JobCardProps {
  job: Job;
  role: string;
}
const JobCard = ({ job, role }: JobCardProps) => {
  return (
    <Card className=" md:max-w-md lg:max-w-md text-card-foreground shadow-sm bg-muted/50">
      <CardHeader className="grid  items-start gap-4 space-y-0 p-2">
        <div className="space-y-1">
          <CardTitle className="text-sm lg:text-2xl">{job.title}</CardTitle>
          <div className="italic text-sm">Updated April 2023</div>
          <div className="flex gap-[5px] md:gap-[10px] lg:gap-[10px]">
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
          <CardDescription>Number of Applicants: 100+</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <Link
            href={
              role === "employer"
                ? `/dashboard/jobs/${job.id}`
                : role === "applicant"
                ? `/job/${job.id}/assessment`
                : "/"
            }
          >
            <div className="flex items-center">
              <Button
                className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                size={"sm"}
              >
                Job Details
              </Button>
            </div>
          </Link>
          <div className="flex items-center gap-[5px]">
            <CircleIcon
              className={cn(
                "mr-1 h-3 w-3 ",
                job.status == "inactive"
                  ? "fill-red-400 text-red-400"
                  : "fill-sky-400 text-sky-400"
              )}
            />
            {job.status == "active" ? "Active" : "Inactive"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
