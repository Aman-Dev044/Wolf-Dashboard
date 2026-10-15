import { Reveal, SplitWords } from "./motion";

type Props = {
  eyebrow?: string;
  title: string;
  accent?: string;
  text?: string;
  dark?: boolean;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
};

/** Section title in the original 72px / weight 500 style, with an animated word reveal. */
export function SectionHeading({ eyebrow, title, accent, text, dark = false, align = "left", as: Tag = "h2", className = "" }: Props) {
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      {eyebrow && (
        <Reveal variant="fade">
          <span className={`chip ${dark ? "" : "border-ink/10 bg-ink/5 text-muted"}`}>
            <span className="size-1.5 rounded-full bg-amber" /> {eyebrow}
          </span>
        </Reveal>
      )}
      <Tag className={`mt-5 text-section font-medium tracking-[0.12px] ${dark ? "text-white" : "text-navy"}`}>
        <SplitWords text={title} />
        {accent && (
          <>
            {" "}
            <SplitWords text={accent} className="text-gradient" delay={0.15} />
          </>
        )}
      </Tag>
      {text && (
        <Reveal delay={0.2}>
          <p className={`mt-6 text-lg leading-[32.5px] sm:text-xl ${dark ? "text-slate" : "text-muted"}`}>{text}</p>
        </Reveal>
      )}
    </div>
  );
}
