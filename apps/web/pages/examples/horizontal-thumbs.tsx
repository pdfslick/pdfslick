import dynamic from "next/dynamic";
import Loader from "../../components/Loader";
import Head from "next/head";
import { useRouter } from "next/router";
import Fab from "../../components/Fab";

const HorizontalThumbs = dynamic(
  () => import("../../examples/HorizontalThumbs"),
  {
    loading: () => <Loader bgColor="bg-slate-50" color="text-slate-700" />,
    ssr: false,
  }
);

export default function HorizontalThumbsPage({}) {
  const router = useRouter();
  const pdfFilePath =
    (router.query.pdf as string) ?? "/pdfs/CH_infographics.pdf";
  return (
    <>
      <Head>
        <title>PDFSlick Horizontal Thumbnails</title>
      </Head>
      <div className="absolute inset-0 w-full h-full flex divide-x divide-slate-200">
        <div className="w-full h-full relative">
          <HorizontalThumbs {...{ pdfFilePath }} />
          <Fab />
        </div>
      </div>
    </>
  );
}
