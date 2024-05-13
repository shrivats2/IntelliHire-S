"use client";
import React, { useEffect, useState } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import axios from "axios";
import { languageOptions } from "../constants/languageOptions";

import { defineTheme } from "../lib/defineTheme";
import useKeyPress from "../hooks/useKeyPress";
import OutputWindow from "./OutputWindow";
import CustomInput from "./CustomInput";
import OutputDetails from "./OutputDetails";
import ThemeDropdown from "./ThemeDropdown";
import LanguagesDropdown from "./LanguagesDropdown";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const javascriptDefault = `/**
* Problem: Program For Stock Buy Sell To Maximize Profit.
*/

// Time: O(n)
// JavaScript program to implement 
// the above approach
 
// This function finds the buy sell
// schedule for maximum profit
function stockBuySell(price, n) 
{
    // Prices must be given for at 
    // least two days
    if (n == 1)
        return;
 
    // Traverse through given price array
    let i = 0;
    while (i < n - 1) 
    {
        // Find Local Minima
        // Note that the limit is (n-2) as we 
        // are comparing present element to 
        // the next element
        while ((i < n - 1) && 
               (price[i + 1] <= price[i]))
            i++;
 
        // If we reached the end, break
        // as no further solution possible
        if (i == n - 1)
            break;
 
        // Store the index of minima
        let buy = i++;
 
        // Find Local Maxima
        // Note that the limit is (n-1) as we 
        // are comparing to previous element
        while ((i < n) && 
              (price[i] >= price[i - 1]))
            i++;
 
        // Store the index of maxima
        let sell = i - 1;
 
        console.log("Buy on day:"+ buy + " Sell on day: "+ sell);
    }
}
let price = [100, 180, 260,310, 40, 535, 695];
let n = price.length;
stockBuySell(price, n);
`;

const Landing = () => {
  const [code, setCode] = useState(javascriptDefault);
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [theme, setTheme] = useState<{ value: string; label: string }>({
    value: "oceanic-next",
    label: "Oceanic Next",
  });
  const [language, setLanguage] = useState(languageOptions[0]);

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  const onSelectChange = (sl: {
    id: number;
    name: string;
    label: string;
    value: string;
  }) => {
    console.log("selected Option...", sl);
    setLanguage(sl);
  };

  useEffect(() => {
    if (enterPress && ctrlPress) {
      console.log("enterPress", enterPress);
      console.log("ctrlPress", ctrlPress);
      handleCompile();
    }
  }, [ctrlPress, enterPress]);
  const onChange = (action: any, data: any) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };
  const handleCompile = () => {
    setProcessing(true);
    const formData = {
      language_id: language.id,
      source_code: btoa(code),
      stdin: btoa(customInput),
    };
    const options = {
      method: "POST",
      url: process.env.NEXT_PUBLIC_RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": process.env.NEXT_PUBLIC_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("res.data", response.data);
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        // get error status
        let status = err.response?.status;
        console.log("status", status);
        if (status === 429) {
          console.log("too many requests", status);

          toast.error(
            `Quota of requests exceeded for the Day! Please wait we will be back 🔙`
          );
        }
        setProcessing(false);
        console.log("catch block...", error);
      });
  };

  const checkStatus = async (token: string) => {
    const options = {
      method: "GET",
      url: process.env.NEXT_PUBLIC_RAPID_API_URL + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": process.env.NEXT_PUBLIC_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;
      if (statusId === 1 || statusId === 2) {
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        console.log(response);
        setProcessing(false);
        setOutputDetails(response.data);
        toast.success(`Compiled Successfully!`);
        console.log("response.data", response.data);
        return;
      }
    } catch (err: any) {
      console.log("err", err);
      setProcessing(false);
      toast.error(err);
    }
  };

  function handleThemeChange(th: any) {
    const theme = th;
    console.log("theme...", theme);

    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme));
    }
  }
  useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);

  return (
    <>
      <div className="flex flex-row justify-center gap-2">
        <div className=" w-48">
          <LanguagesDropdown onSelectChange={onSelectChange} />
        </div>
        <div className="w-48">
          <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
        </div>
      </div>
      <div className="flex flex-col xl:flex-row 2xl:flex-row items-start px-4 py-4">
        <div className="flex flex-col w-full h-full justify-start items-end">
          <CodeEditorWindow
            code={code}
            onChange={onChange}
            language={language?.value}
            theme={theme.value}
          />
        </div>

        <div className="right-container flex flex-shrink-0 w-full 2xl:ml-2 xl:ml-2 xl:w-[30%] 2xl:w-[30%] flex-col">
          <OutputWindow outputDetails={outputDetails} />
          <div className="flex flex-col items-end">
            <CustomInput
              customInput={customInput}
              setCustomInput={setCustomInput}
            />
            <Button
              onClick={handleCompile}
              disabled={!code}
              className={cn(
                "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200  flex-shrink-0",
                !code ? "opacity-50" : ""
              )}
            >
              {processing ? "Processing..." : "Compile and Execute"}
            </Button>
          </div>
          {outputDetails && <OutputDetails outputDetails={outputDetails} />}
        </div>
      </div>
    </>
  );
};
export default Landing;
