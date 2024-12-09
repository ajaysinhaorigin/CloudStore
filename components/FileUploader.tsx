"use client";

import { MouseEvent, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils/utils";
import Image from "next/image";
import { FileLoader, Remove, Upload } from "@/public/assets";
import Thumbnail from "./Thumbnail";
import { usePathname } from "next/navigation";
import { MAX_FILE_SIZE } from "@/constants";
import { uploadFile } from "@/lib/actions/file.actions";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { createHttpClient } from "@/tools/httpClient";
import { apiUrls } from "@/tools/apiUrls";

interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}

const FileUploader = ({ ownerId, accountId, className }: Props) => {
  const path = usePathname();
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);

      const uploadPromises = acceptedFiles.map(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prevFiles) =>
            prevFiles.filter((f) => f.name !== file.name)
          );

          return toast({
            description: (
              <p className="body-2 text-white">
                <span className="font-semibold">{file.name}</span> is too large.
                Max file size is 50MB.
              </p>
            ),
            className: "error-toast",
          });
        }

        const formData = new FormData();
        formData.append("file", file);

        const httpClient = createHttpClient();
        try {
          const response = await httpClient.post(apiUrls.uploadFile, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          console.log(response.data);
        } catch (error) {
          console.error("Error uploading file:", error);
        }
        return true;

        // return uploadFile({ file, ownerId, accountId, path }).then(
        //   (uploadedFile) => {
        //     if (uploadedFile) {
        //       setFiles((prevFiles) =>
        //         prevFiles.filter((f) => f.name !== file.name)
        //       );
        //     }
        //   }
        // );
      });

      await Promise.all(uploadPromises);
    },
    [ownerId, accountId, path]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const onRemoveFile = (
    e: MouseEvent<HTMLImageElement, globalThis.MouseEvent>,
    fileName: string
  ) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((f) => f.name !== fileName));
  };

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button type="button" className={cn("uploader-button", className)}>
        <Image src={Upload} alt="files" width={24} height={24} />
        <p>Upload</p>
      </Button>
      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">Uploading</h4>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);

            return (
              <li
                key={`${index}-${file.name}`}
                className="uploader-preview-item"
              >
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />

                  <div className="preview-item-name">
                    {file.name.slice(0, 20).concat("...")}
                    <Image
                      src={FileLoader}
                      width={80}
                      height={26}
                      alt="loader"
                    />
                  </div>
                </div>

                <Image
                  src={Remove}
                  width={24}
                  height={24}
                  alt="Remove"
                  onClick={(e) => onRemoveFile(e, file.name)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;
