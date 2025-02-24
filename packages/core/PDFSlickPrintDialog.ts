
type DialogOpenProps = {
  close?: () => void;
}

export interface IPDFSlickPrintDialog {
  open(options?: DialogOpenProps): Promise<void>;
  close(): void;
  progress({ index, total }: { index: number, total: number }): void;
}

export class PDFSlickPrintDialog implements IPDFSlickPrintDialog {
  dialog: HTMLDialogElement;

  static create(): IPDFSlickPrintDialog {
    let dialog = document.querySelector<HTMLDialogElement>('#printServiceDialog');

    if (!dialog) {
      /** A small helper to constuct DOM elements */
      const h = <K extends keyof HTMLElementTagNameMap>(tag: K, attr: Record<string, string>, children: (Node | string)[]) => {
        const e = document.createElement(tag);
        Object.entries(attr).forEach(([k, v]) => e.setAttribute(k, v));
        e.append(...children);
        return e;
      }

      /** Print dialog as used in https://github.com/mozilla/pdf.js */
      dialog = h('dialog', { id: 'printServiceDialog', class: 'pdfSlick-dialog', style: 'min-width: 200px;' }, [
        h('div', { class: 'row' }, [
          h('span', { 'data-l10n-id': 'pdfjs-print-progress-message' }, ["Preparing document for printing…"]),
        ]),
        h('div', { class: 'row' }, [
          h('progress', { value: '0', max: '100' }, []),
          h('span', { 'data-l10n-id': 'pdfjs-print-progress-percent', 'data-l10n-args': '{ "progress": 0 }', class: 'relative-progress' }, ['0%']),
        ]),
        h('div', { class: 'buttonRow' }, [
          h('button', { id: 'printCancel', class: 'dialogButton', type: 'button' }, [
            h('span', { 'data-l10n-id': 'pdfjs-print-progress-close-button' }, ['Cancel'])
          ]),
        ]),
      ]);

      document.body.append(dialog);
    }

    return new PDFSlickPrintDialog(dialog);
  }

  private constructor(dialog: HTMLDialogElement) {
    this.dialog = dialog;
  }

  async open(options?: DialogOpenProps) {
    const btnClose = this.dialog.querySelector<HTMLButtonElement>('#printCancel');

    const cancelHandler = () => {
      this.dialog.removeEventListener("close", cancelHandler);
      this.dialog.removeEventListener("cancel", cancelHandler);
      btnClose?.removeEventListener("click", cancelHandler);
      options?.close?.();
      this.close();
    }

    this.dialog.addEventListener("close", cancelHandler);
    this.dialog.addEventListener("cancel", cancelHandler);
    btnClose?.addEventListener("click", cancelHandler);

    this.dialog.showModal();
  }

  close() {
    this.dialog.close();
  }

  progress({ index, total }: { index: number, total: number }) {
    const progress = Math.round((100 * index) / total);
    const progressBar = this.dialog.querySelector<HTMLProgressElement>("progress")!;
    const progressPerc = this.dialog.querySelector<HTMLElement>(".relative-progress")!;
    progressBar.value = progress;
    progressPerc.setAttribute("data-l10n-args", JSON.stringify({ progress }));
  }
}
