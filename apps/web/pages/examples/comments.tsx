import Loader from "../../components/Loader";
import dynamic from "next/dynamic";

import { useRouter } from "next/router";


const CommentsExample = dynamic(() => import("../../examples/Comments"), {
  loading: () => <Loader bgColor="bg-slate-50" color="text-slate-700" />,
  ssr: false,
});

export default function Comments() {
  const router = useRouter();
  const pdfFilePath = (router.query.pdf as string) ?? "/pdfs/Wines-of-Macedonia-Brochure.pdf";
  return (
    <div>
      <h1>Comments Example</h1>
      <CommentsExample key={pdfFilePath} {...{ pdfFilePath }} />
    </div>
  );
}