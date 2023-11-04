import clsx from "clsx";
import { ReactNode } from "react";
import { Icon } from "./Icon";

const styles: Record<
  string,
  { container: string; title: string; body: string }
> = {
  note: {
    container:
      "bg-rose-50",
    title: "text-rose-900",
    body: "text-rose-800 [--tw-prose-background:theme(colors.sky.50)] prose-a:text-rose-900 prose-code:text-rose-900",
  },
  warning: {
    container:
      "bg-amber-50",
    title: "text-amber-900",
    body: "text-amber-800 [--tw-prose-underline:theme(colors.amber.400)] [--tw-prose-background:theme(colors.amber.50)] prose-a:text-amber-900 prose-code:text-amber-900",
  },
};

const icons: Record<string, typeof Icon> = {
  note: (props) => <Icon icon="lightbulb" {...props} />,
  warning: (props) => <Icon icon="warning" color="amber" {...props} />,
};

type CalloutProps = {
  type: string;
  title: string;
  children: ReactNode;
};

export function Callout({ type = "note", title, children }: CalloutProps) {
  let IconComponent = icons[type];

  return (
    <div className={clsx("my-8 flex rounded-3xl p-6", styles[type].container)}>
      <IconComponent className="h-8 w-8 flex-none" />
      <div className="ml-4 flex-auto">
        <p className={clsx("m-0 font-display text-xl", styles[type].title)}>
          {title}
        </p>
        <div className={clsx("prose mt-2.5", styles[type].body)}>
          {children}
        </div>
      </div>
    </div>
  );
}
