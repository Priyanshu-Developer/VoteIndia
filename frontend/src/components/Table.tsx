"use client";

import React, { useState, useEffect } from "react";

type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
};

type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
};

const Table = <T,>({ data, columns }: TableProps<T>) => {
  const [maxHeight, setMaxHeight] = useState<string>("500px"); // Default height

  useEffect(() => {
    const updateHeight = () => {
      const screenHeight = window.innerHeight;
      const availableHeight = screenHeight * 0.6; // Adjust this factor as needed
      setMaxHeight(`${availableHeight}px`);
    };

    updateHeight(); // Initial call
    window.addEventListener("resize", updateHeight); // Update on resize

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div className="relative w-full border rounded-lg overflow-hidden">
      {/* Dynamically adjust max-height based on screen size */}
      <div className="overflow-y-auto max-h-[800px] scrollbar-hide" >
        <table className="min-w-full border-collapse bg-white shadow-md">
          {/* Fixed Header */}
          <thead className="sticky top-0 bg-gray-100   shadow-md z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key as string}
                  className="px-6 py-3 text-left text-xs  text-gray-600 font-bold uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}   
            </tr>
          </thead>

          {/* Scrollable Table Body */}
          <tbody className="divide-y">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.key as string} className="px-6 py-4 text-sm text-gray-800">
                    {col.render ? col.render(row[col.key as keyof T], row) : (row[col.key as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
