"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import Sort from "@/components/Sort";
import { getFileTypesParams } from "@/lib/utils/utils";
import { useParams, useSearchParams } from "next/navigation";
import { createHttpClient } from "@/tools/httpClient";
import { apiUrls } from "@/tools/apiUrls";

const Page = () => {
  const [files, setFiles] = useState({
    total: 0,
    documents: [],
  });
  const { type } = useParams();
  const searchParams = useSearchParams();
  const searchText = searchParams.get("query") || "";
  const sort = searchParams.get("sort") || "";
  const types = getFileTypesParams(type as string) as FileType[];

  useEffect(() => {
    fetchFiles();
  }, [type, searchText, sort]);

  const fetchFiles = async () => {
    const httpClient = createHttpClient();
    try {
      const response = await httpClient.get(
        `${apiUrls.getFile}/${types}?searchText=${searchText}&sort=${sort}`
      );

      if (!response || response.status !== 200) {
        throw new Error("Failed to fetch files");
      }

      setFiles({
        total: response.data.total,
        documents: response.data.files,
      });
    } catch (error) {
      console.log("Error fetching files:", error);
    } finally {
    }
  };

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
            <Card key={file._id} file={file} fetchFiles={fetchFiles} />
          ))}
        </section>
      ) : (
        <p className="empty-list">No files uploaded</p>
      )}
    </div>
  );
};

export default Page;
