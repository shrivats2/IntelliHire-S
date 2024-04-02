import React from "react";

const OutputDetails = ({ outputDetails }: any) => {
  return (
    <div className="metrics-container mt-4 flex flex-col space-y-3">
      <p className="text-sm">
        Status:{" "}
        <span className="font-semibold px-2 py-1 rounded-md bg-card border-green-500 border-[1px]">
          {outputDetails?.status?.description}
        </span>
      </p>
      <p className="text-sm">
        Memory:{" "}
        <span className="font-semibold px-2 py-1 rounded-md bg-card border-green-500 border-[1px]">
          {outputDetails?.memory}
        </span>
      </p>
      <p className="text-sm">
        Time:{" "}
        <span className="font-semibold px-2 py-1 rounded-md bg-card border-green-500 border-[1px]">
          {outputDetails?.time}
        </span>
      </p>
    </div>
  );
};

export default OutputDetails;
