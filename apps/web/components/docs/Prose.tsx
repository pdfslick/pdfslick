import clsx from "clsx";

export function Prose({ as: Component = "div", className, ...props }: any) {
  return (
    <Component
      className={clsx(
        className,
        "prose prose-slate max-w-none",
        // headings
        "prose-headings:scroll-mt-28 prose-headings:font-display prose-headings:font-normal lg:prose-headings:scroll-mt-[8.5rem]",
        // lead
        "prose-lead:text-slate-500",
        // links
        "prose-a:font-semibold",
        // link underline
        "prose-a:no-underline prose-a:shadow-[inset_0_-2px_0_0_var(--tw-prose-background,#fff),inset_0_calc(-1*(var(--tw-prose-underline-size,4px)+2px))_0_0_var(--tw-prose-underline,theme(colors.rose.300))] hover:prose-a:[--tw-prose-underline-size:6px]",
        // pre
        "prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:shadow-lg",
        // hr
        ""
      )}
      {...props}
    />
  );
}
