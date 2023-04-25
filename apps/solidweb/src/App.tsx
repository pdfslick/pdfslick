import { Component } from "solid-js";
import PDFViewerApp from "./examples/PDFViewerApp";

const pdfFilePath = "/pdfs/p4450.pdf";

const App: Component = () => {
  return <PDFViewerApp {...{ pdfFilePath }} />;
};

export default App;
