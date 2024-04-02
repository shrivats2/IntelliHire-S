"use client";

import useAuthStore from "@/store/useUserContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import ReactHtmlParser from "react-html-parser";
import { toast } from "sonner";
import axios from "axios";
import { Copy, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const ApplyJobCard = ({ jobid }: { jobid: string }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isResumeUploaded, setIsResumeUploaded] = useState(false);
  const user = useAuthStore((state) => state.user);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const link = `${process.env.NEXT_PUBLIC_WEB_URL}/job/${jobid}`;

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/job/${jobid}/apply`, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      })
      .then((res) => {
        const response = res?.data?.data;
        if (!response.job_id) {
          setTitle(response?.job_title);
          setDescription(response?.job_description);
          setIsResumeUploaded(response?.resume);
        } else if (!response.job_fit) {
          //   navigate(`job-fit`);
        } else if (!response.aptitude) {
          //   navigate(`assessment`);
        } else {
          //  navigate(`result`);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 307) {
          const redirectUrl = error.response.data.redirect_url;
          //navigate(`${redirectUrl}`);
        } else {
          console.log(error);
        }
      });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between">{title}</div>
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
            ReactHtmlParser(description)
          ) : description.length > 100 ? (
            <div>{ReactHtmlParser(description.substring(0, 100))}</div>
          ) : (
            description
          )}
          {description.length > 100 && (
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
  );
};

export default ApplyJobCard;
