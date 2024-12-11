"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import Sort from "@/components/Sort";
import { getFiles } from "@/lib/actions/file.actions";
import { getFileTypesParams } from "@/lib/utils/utils";
import { useParams } from "next/navigation";

const Page = () => {
  const [files, setFiles] = useState({
    total: 0,
    documents: [],
  });
  const { type } = useParams();
  const types = getFileTypesParams(type as string) as FileType[];

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const searchText = "";
        const sort = "";

        const response = await fetch(
          `http://localhost:3000/api/file/${types}?searchText=${searchText}&sort=${sort}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch files");
        }

        const data = await response.json();
        console.log("API Response:", data);

        setFiles({
          total: data.total,
          documents: data.files,
        });
      } catch (error) {
        console.log("Error fetching files:", error);
      } finally {
      }
    };

    fetchFiles();
  }, []);

  console.log("Files:", files);
  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{"type"}</h1>

        <div className="total-size-section">
          <p className="body1">
            Total : <span className="h5">{254}</span>
          </p>

          <div className="sort-container">
            <p className="body-1 hidden md:block text-light-200">Sort by:</p>
            <Sort />
          </div>
        </div>
      </section>

      {/* Render the files */}
      {files.total > 0 ? (
        <section className="file-list">
          {files.documents.map((file: any) => (
            <Card key={file._id} file={file} />
          ))}
        </section>
      ) : (
        <p className="empty-list">No files uploaded</p>
      )}
    </div>
  );
};

export default Page;
