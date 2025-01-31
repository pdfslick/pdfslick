import { Component } from "solid-js";
import PDFViewerApp from "./examples/PDFViewerApp";

const pdfFilePath = "/pdfs/Wines-of-Macedonia-Brochure.pdf";

const App: Component = () => {
  return <PDFViewerApp {...{ pdfFilePath }} />;
};

export default App;
