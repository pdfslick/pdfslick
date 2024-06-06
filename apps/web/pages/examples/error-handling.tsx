import dynamic from "next/dynamic";
import Loader from "../../components/Loader";
import Head from "next/head";
import { useRouter } from "next/router";
import Fab from "../../components/Fab";

const ErrorHandlingViewer = dynamic(
  () => import("../../examples/ErrorHandling"),
  {
    loading: () => <Loader bgColor="bg-slate-50" color="text-slate-700" />,
    ssr: false,
  }
);

export default function ErrorHandlingPage() {
  const router = useRouter();
  const pdfFilePath = (router.query.pdf as string) ?? "/pdfs/non_existing.pdf";
  return (
    <>
      <Head>
        <title>PDFSlick Error Handling</title>
      </Head>
      <div className="absolute inset-0 w-full h-full flex divide-x divide-slate-200">
        <div className="w-full h-full relative">
          <ErrorHandlingViewer {...{ pdfFilePath }} />
          <Fab showNonExisting={true} />
        </div>
      </div>
    </>
  );
}
