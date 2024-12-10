"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import Sort from "@/components/Sort";
import { getFiles } from "@/lib/actions/file.actions";
import { getFileTypesParams } from "@/lib/utils/utils";
import { Models } from "node-appwrite";
import { useParams } from "next/navigation";

const Page = () => {
  const [files, setFiles] = useState({
    total: 0,
    documents: [],
  });
  const [loading, setLoading] = useState(true);
  const { type } = useParams();
  console.log("type", type);
  //   const type = ((await params)?.type as string) || "";
  //   const searchText = ((await searchParams)?.query as string) || "";
  //   const sort = ((await searchParams)?.sort as string) || "";

  //   const types = getFileTypesParams(type) as FileType[];

  //   console.log({ types, searchText, sort });
  //   const files = await getFiles({ types, searchText, sort });

  //   const files = {
  //     total: 0,
  //     documents: [],
  //   };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const searchText = "example"; // Replace with dynamic value
        const sort = "asc"; // Replace with dynamic value

        const response = await fetch(
          `http://localhost:3000/api/file/${type}?searchText=${searchText}&sort=${sort}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch files");
        }

        const data = await response.json();
        console.log("API Response:", data);

        setFiles({
          total: 0,
          documents: [],
        }); // Assuming `data` contains files in `data`
      } catch (error) {
        console.log("Error fetching files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  console.log("Files:", files);

  if (loading) return <p>Loading...</p>;

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
          {files.documents.map((file: Models.Document) => (
            <Card key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        <p className="empty-list">No files uploaded</p>
      )}
    </div>
  );
};

export default Page;
