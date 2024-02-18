import dynamic from "next/dynamic";
import Loader from "../../components/Loader";
import Head from "next/head";
import { useRouter } from "next/router";
import Fab from "../../components/Fab";
import { useEffect, useState } from "react";

const ArrayBufferViewer = dynamic(() => import("../../examples/ArrayBuffer"), {
  loading: () => <Loader bgColor="bg-slate-50" color="text-slate-700" />,
  ssr: false,
});

export default function SimplePDFViewerPage() {
  const router = useRouter();
  const pdfFilePath =
    (router.query.pdf as string) ?? "/pdfs/us_constitution.pdf";

  const [arrayBuf, setArrayBuf] = useState<ArrayBuffer>();
  useEffect(() => {
    (async () => {
      const buf = await fetch(pdfFilePath).then((r) => r.arrayBuffer());
      setArrayBuf(buf);
    })();
  }, [pdfFilePath]);
  return (
    <>
      <Head>
        <title>PDFSlick Simple PDF Viewer</title>
      </Head>
      <div className="absolute inset-0 w-full h-full flex divide-x divide-slate-200">
        <div className="w-full h-full relative">
          {arrayBuf && (
            <>
              <ArrayBufferViewer {...{ pdfFilePath: arrayBuf }} />
              <Fab />
            </>
          )}
        </div>
      </div>
    </>
  );
}
