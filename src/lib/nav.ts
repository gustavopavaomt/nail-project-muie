import { BookOpen, Calendar, House, User, type LucideIcon } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

/*
  Os 4 itens da bottom nav do print. "Agendar" e "Servicos" nao sao a mesma coisa:
  - /agendar  comeca o funil (escolher o servico que vai ser agendado)
  - /servicos e catalogo informativo (preco, descricao, galeria) sem compromisso
*/
export const BOTTOM_NAV: NavItem[] = [
  { href: "/inicio", label: "Início", icon: House },
  { href: "/agendar", label: "Agendar", icon: Calendar },
  { href: "/servicos", label: "Serviços", icon: BookOpen },
  { href: "/perfil", label: "Perfil", icon: User },
];
