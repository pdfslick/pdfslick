import Head from "next/head";
import dynamic from "next/dynamic";
import Loader from "../../components/Loader";
import Fab from "../../components/Fab";
import { useRouter } from "next/router";

const PDFViewerApp = dynamic(() => import("../../examples/PDFViewerApp"), {
  loading: () => <Loader bgColor="bg-slate-50" color="text-slate-700" />,
  ssr: false,
});

export default function PDFViewerAppPage() {
  const router = useRouter();
  const pdfFilePath =
    (router.query.pdf as string) ?? "/pdfs/p4450.pdf";
  return (
    <>
      <Head>
        <title>PDFSlick Full Viewer App</title>
      </Head>
      <div className="absolute inset-0 w-full h-full flex divide-x divide-slate-200">
        <div className="w-full h-full relative">
          <PDFViewerApp {...{ pdfFilePath }} />
          <Fab />
        </div>
      </div>
    </>
  );
}
