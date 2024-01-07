"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useAppContext } from "@/context/AppContext";
import { formatTimeAgo } from "@/lib/timeago";
import Link from "next/link";
import DeleteRequest from "./DeleteRequest";

const RequestsDisplay = () => {
  const { urls, auth, setUrls } = useAppContext();

  return (
    <>
      {urls.length > 0 ? (
        <div className="flex flex-col space-y-5 py-10 md:py-5">
          <div className="flex flex-row items-center justify-end">
            <Link
              href={"/request"}
              className="uppercase bg-primary-main text-white hover:scale-105 px-5 py-2 w-fit rounded"
            >
              Add New
            </Link>
          </div>

          <Table className="h-full">
            <TableCaption>A list of all your requests created</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">No.</TableHead>
                <TableHead className="text-center">Req No.</TableHead>
                <TableHead className="text-center">Title</TableHead>
                <TableHead className="text-center">Url</TableHead>
                <TableHead className="text-center">Created</TableHead>
                <TableHead className="text-center font-semibold">
                  Manage
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {urls.map((url, idx) => (
                <TableRow key={url._id}>
                  <TableCell className="text-center">{idx + 1}.</TableCell>
                  <TableCell className="text-center">
                    {url.requestId._id.slice(-10)}
                  </TableCell>
                  <TableCell className="text-center">
                    {url.requestId.title}
                  </TableCell>
                  <TableCell className="text-center">{url.url}</TableCell>
                  <TableCell className="text-center">
                    {formatTimeAgo(new Date(url.createdAt))}
                  </TableCell>
                  <TableCell className="flex flex-row items-center space-x-2">
                    <Link
                      className="bg-green-700 text-xs rounded text-white text-center px-3 py-1 w-full"
                      href={`requests/${url.requestId._id}/edit`}
                    >
                      Edit
                    </Link>

                    <DeleteRequest
                      urlId={url._id}
                      setUrls={setUrls}
                      token={auth?.token!}
                      id={url.requestId._id}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center space-y-6">
          <h2 className="dark:text-white pt-7 md:pt-10 md:text-xl">
            You haven't created any requests yet.
          </h2>
          <Link
            href={"/request"}
            className="bg-primary-main text-white hover:scale-105 px-4 py-2 w-fit rounded"
          >
            Create a request
          </Link>
        </div>
      )}
    </>
  );
};

export default RequestsDisplay;
