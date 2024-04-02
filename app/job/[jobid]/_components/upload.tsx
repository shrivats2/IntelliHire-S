"use client";
import React, { useState } from "react";
import axios from "axios";
import useAuthStore from "@/store/useUserContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { UploadCloud } from "lucide-react";

function Upload({ isResumeUploaded, setIsResumeUploaded }: any) {
  const user = useAuthStore((state) => state.user);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleResumeUpload = (event: any) => {
    const uploadedFile = event.target.files[0];
    setResume(uploadedFile);
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    const uploadedFile = event.dataTransfer.files[0];
    setResume(uploadedFile);
  };

  const handleDragOver = (event: any) => {
    event.preventDefault();
  };

  const handleUpload = (event: any) => {
    event.preventDefault();
    console.log(resume);

    if (resume) {
      const formData = new FormData();
      formData.append("file", resume);

      setLoading(true);
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/upload_resume`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            Authorization: `Bearer ${user.access_token}`,
          },
        })
        .then((res) => {
          alert(res?.data?.message);
          setIsResumeUploaded(true);
          toast.success("Resume Uploaded Successfully ✅.");
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("Failed to upload try again ⚠️.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      toast.error("Select the resume before uploading...");
    }
  };

  const handleUpdate = (event: any) => {
    event.preventDefault();

    if (resume) {
      const formData = new FormData();
      formData.append("file", resume);

      setLoading(true);
      axios
        .put(`${process.env.NEXT_PUBLIC_API_URL}/upload_resume`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            Authorization: `Bearer ${user.access_token}`,
          },
        })
        .then((res) => {
          alert(res?.data?.message);
          setIsResumeUploaded(true);
          toast.success("Resume Uploaded Successfully ✅.");
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("Failed to upload try again ⚠️.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <>
      <div>
        <form onSubmit={isResumeUploaded ? handleUpload : handleUpdate}>
          <label
            htmlFor="images"
            className="relative flex flex-col justify-center items-center h-200 px-20 py-20 border-2 border-dashed border-gray-500 rounded-lg text-gray-700 cursor-pointer transition duration-200 ease-in-out  hover:bg-gray-100"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="p-4 bg-green-500 rounded-[10px]">
              <UploadCloud size="48" color="white" />
            </div>
            <span className="text-grey-500 text-lg font-bold text-center transition duration-200 ease-in-out ">
              Drop files here
            </span>
            <span className="text-xl font-bold">or</span>
            <Input
              className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 relative flex items-center justify-center w-full max-w-[350px] rounded-lg border border-gray-500 placeholder-white text-white font-bold cursor-pointer"
              type="file"
              id="images"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              required
            />
          </label>
          <div className="flex justify-center p-7">
            <Button
              type="submit"
              disabled={loading}
              //   onClick={isResumeUploaded ? handleUpload : handleUpdate}
            >
              {loading ? (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <>{isResumeUploaded ? "Update Resume" : "Upload Resume"}</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Upload;
