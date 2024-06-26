import React from "react";
import { cn } from "@/lib/utils";

const CustomInput = ({
  customInput,
  setCustomInput,
}: {
  customInput: string;
  setCustomInput: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <>
      {" "}
      <textarea
        rows={5}
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
        placeholder={`Custom input`}
        className={cn(
          "focus:outline-none w-full border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(62,214,118)] px-4 py-2 hover:shadow transition duration-200  mt-2"
        )}
      ></textarea>
    </>
  );
};

export default CustomInput;
