import dynamic from "next/dynamic";
import Loader from "../../components/Loader";
import Head from "next/head";
import Fab from "../../components/Fab";

const MultipleDocuments = dynamic(
  () => import("../../examples/MultipleDocuments"),
  {
    loading: () => <Loader bgColor="bg-slate-50" color="text-slate-700" />,
    ssr: false,
  }
);

export default function Web() {
  return (
    <>
      <Head>
        <title>PDFSlick View Multiple Documents</title>
      </Head>
      <div className="absolute inset-0 w-full h-full flex divide-x divide-slate-200">
        <div className="w-full h-full relative">
          <MultipleDocuments />
          <Fab />
        </div>
      </div>
    </>
  );
}
