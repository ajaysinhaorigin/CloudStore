import Card from "@/components/Card";
import Sort from "@/components/Sort";
import { getFileTypesParams } from "@/lib/utils/utils";
import { Models } from "node-appwrite";

const Page = async ({ searchParams, params }: SearchParamProps) => {
  const type = ((await params)?.type as string) || "";
  const searchText = ((await searchParams)?.query as string) || "";
  const sort = ((await searchParams)?.sort as string) || "";

  const types = getFileTypesParams(type) as FileType[];

  // const files = await getFiles({ types, searchText, sort });

  const files = {
    total: 0,
    documents: [],
  };

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>

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
