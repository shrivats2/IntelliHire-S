"use client";
import Tiptap from "@/components/Tiptap";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import useCreateJob from "@/store/useCreateJob";
import useAuthStore from "@/store/useUserContext";
import axios from "axios";
import { Loader2, Sparkles } from "lucide-react";
import { ElementRef, useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const initialLoadingMessages = [
  "Crafting the perfect job description just for you...",
  "Loading the key details for your ideal position...",
  "In the midst of job description alchemy – it takes a little time!",
  "Putting the finishing touches on your personalized job profile...",
];

const Step1 = () => {
  const openRef = useRef<ElementRef<"button">>(null);
  const user = useAuthStore((state) => state.user);
  const content = useCreateJob((state) => state.setDescription);
  const description = useCreateJob((state) => state.job_description);
  const [title, settitle] = useState(useCreateJob((state) => state.job_title));
  const [domain, setdomain] = useState(
    useCreateJob((state) => state.job_domain)
  );
  const setTitle = useCreateJob((state) => state.setTitle);
  const setDomain = useCreateJob((state) => state.setDomain);
  const [isTiptapLoaded, setTiptapLoaded] = useState(false);
  const [isDescriptionloading, setIsDescriptionLoading] = useState(false);
  const [tiptapKey, setTiptapKey] = useState(0);

  const handleClick = () => {
    if (title == "" || domain == "") {
      toast.error("Enter Title and Domain to generate description.");
      return;
    }

    if (description != "") {
      openRef?.current?.click();
      return;
    }
    fetchJobDescription();
  };

  const fetchJobDescription = async () => {
    setTiptapLoaded(false);
    setIsDescriptionLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/prompt/job-description`,
        {
          job_title: `${title}`,
          domain: `${domain}`,
          tone: "formal",
        },
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      );

      let str = res?.data?.job_description;
      str = str.replace(/(?:\r\n|\r|\n)/g, "<br>");
      content(str);
    } catch (error) {
      console.error("Error:", error);
      toast.error(`${error}`);
    } finally {
      setIsDescriptionLoading(false);
      setTiptapLoaded(true);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setTiptapLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchJobDescription]);
  return (
    <div>
      <div className="h-40 w-full rounded-lg bg-slate-100 p-4 text-slate-900 dark:bg-zinc-900 dark:text-white flex gap-4 justify-between pt-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="title" className="text-lg font-bold">
            Job Title :
          </Label>
          <Input
            required
            type="text"
            value={title}
            onChange={(e) => {
              settitle(e.target.value);
              setTitle(e.target.value);
            }}
            id="title"
            placeholder="Job Title"
            className="border-green-600"
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="domain" className="text-lg font-bold">
            Job Domain :
          </Label>
          <Input
            required
            type="text"
            value={domain}
            onChange={(e) => {
              setDomain(e.target.value);
              setdomain(e.target.value);
            }}
            id="domain"
            placeholder="Job Domain"
            className="border-green-600"
          />
        </div>
      </div>
      <div className="flex justify-center p-3">
        <button
          onClick={handleClick}
          className="btn "
          type="button"
          disabled={isDescriptionloading}
        >
          <div className="txt">
            {isDescriptionloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              <>
                <Sparkles color="white" />
                Generate Description
              </>
            )}
          </div>
          <div id="container-stars">
            <div id="stars"></div>
          </div>

          <div id="glow">
            <div className="circle"></div>
            <div className="circle"></div>
          </div>
        </button>
      </div>
      <AlertDialog>
        <AlertDialogTrigger ref={openRef} asChild>
          <Button className="hidden" variant="outline">
            Show Dialog
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace the current job description.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={fetchJobDescription}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="m-0 mt-5 lg:m-8 xl:m-8 2xl:m-8">
        {isTiptapLoaded ? (
          <Tiptap key={tiptapKey} />
        ) : !isDescriptionloading ? (
          <EditorSkeleton />
        ) : (
          <GeneratorEditorSkeleton />
        )}
      </div>
    </div>
  );
};

const EditorSkeleton = () => {
  return (
    <div className="flex flex-col">
      <Skeleton className="h-9 w-full bg-slate-300 flex items-center">
        <Skeleton className="w-7 h-7 z-10 ml-5" />
        <Skeleton className="w-7 h-7 z-10 ml-3" />
        <Skeleton className="w-7 h-7 z-10 ml-3" />
        <Skeleton className="w-7 h-7 z-10 ml-3" />
        <Skeleton className="w-7 h-7 z-10 ml-3" />
      </Skeleton>
      <Skeleton className="h-96 w-full " />
    </div>
  );
};

const GeneratorEditorSkeleton = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedMessage, setDisplayedMessage] = useState(
    initialLoadingMessages[0]
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentMessageIndex((prevIndex) =>
        prevIndex < initialLoadingMessages.length - 1 ? prevIndex + 1 : 0
      );
    }, 7000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setDisplayedMessage(initialLoadingMessages[currentMessageIndex]);
  }, [currentMessageIndex]);

  return (
    <div className="flex flex-col">
      <Skeleton className="h-9 w-full bg-slate-300 flex items-center">
        <Skeleton className="w-7 h-7 z-10 ml-5" />
        <Skeleton className="w-7 h-7 z-10 ml-3" />
        <Skeleton className="w-7 h-7 z-10 ml-3" />
        <Skeleton className="w-7 h-7 z-10 ml-3" />
        <Skeleton className="w-7 h-7 z-10 ml-3" />
      </Skeleton>
      <Skeleton className="h-96 w-full flex justify-center items-center ">
        <p className="text-lg font-bold">{displayedMessage}</p>
      </Skeleton>
    </div>
  );
};

export default Step1;
