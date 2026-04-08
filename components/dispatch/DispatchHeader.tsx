interface DispatchHeaderProps {
  title?: string;
  description?: string;
}

export default function DispatchHeader({
  title = "Auto-dispatch",
  description = "Configure automatic order assignment for your drivers and delivery services.",
}: DispatchHeaderProps) {
  return (
    <section
      className="flex flex-col justify-center items-start bg-white"
      style={{ padding: "32px 64px 24px", gap: 2 }}
    >
      <h1
        className="font-[800] text-neutral-950 leading-9 tracking-[-0.02em]"
        style={{ fontSize: 24 }}
      >
        {title}
      </h1>
      <p
        className="text-neutral-600"
        style={{ fontSize: 16, fontWeight: 400, lineHeight: "140%" }}
      >
        {description}
      </p>
    </section>
  );
}
