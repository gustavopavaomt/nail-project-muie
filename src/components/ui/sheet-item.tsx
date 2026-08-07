import Link from "next/link";
import type { LucideIcon } from "lucide-react";

/*
  Linha de acao dentro de um bottom sheet.

  min-h-13 (52px) fica acima do minimo de 44px de area de toque, e o
  active:bg-primary-50 substitui o hover: em touch nao existe hover, entao sem um
  estado de :active o toque nao devolve nenhum retorno visual.
*/
export function SheetItem({
  icon: Icon,
  label,
  href,
  onClick,
  tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
  tone?: "default" | "danger";
}) {
  const className = [
    "flex min-h-13 w-full items-center gap-3.5 rounded-sm px-2 text-left text-[15px] transition-colors active:bg-primary-50",
    tone === "danger" ? "text-primary-700" : "text-ink",
  ].join(" ");

  const content = (
    <>
      <Icon size={20} strokeWidth={1.7} aria-hidden="true" className="shrink-0" />
      {label}
    </>
  );

  if (href) {
    const external = href.startsWith("http");
    return external ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    ) : (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}
