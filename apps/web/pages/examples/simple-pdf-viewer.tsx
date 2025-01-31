import dynamic from "next/dynamic";
import Loader from "../../components/Loader";
import Head from "next/head";
import { useRouter } from "next/router";
import Fab from "../../components/Fab";

const SimplePDFViewer = dynamic(
  () => import("../../examples/SimplePDFViewer"),
  {
    loading: () => <Loader bgColor="bg-slate-50" color="text-slate-700" />,
    ssr: false,
  }
);

export default function SimplePDFViewerPage() {
  const router = useRouter();
  const pdfFilePath = (router.query.pdf as string) ?? "/pdfs/Wines-of-Macedonia-Brochure.pdf";
  return (
    <>
      <Head>
        <title>PDFSlick Simple PDF Viewer</title>
      </Head>
      <div className="absolute inset-0 w-full h-full flex divide-x divide-slate-200">
        <div className="w-full h-full relative">
          <SimplePDFViewer {...{ pdfFilePath }} />
          <Fab />
        </div>
      </div>
    </>
  );
}
