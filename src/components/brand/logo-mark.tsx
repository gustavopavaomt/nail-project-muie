import Image from "next/image";

/*
  Ilustracao oficial da marca: ref/src/prints/unha-home.png.

  O arquivo original e 1254x1254 sem canal alpha, com fundo rosa chapado (#FAF3F3)
  e muita margem morta. O que esta em public/brand/ foi recortado no desenho e teve
  o fundo convertido em transparencia — sem isso a ilustracao aparece como um
  quadrado rosa levemente diferente sobre o creme do app (#FFF8F7).

  Substituiu um SVG que eu tinha desenhado a mao e nao chegava perto.
*/
export function LogoMark({
  className = "",
  size = 64,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <Image
      src="/brand/logo-mao.png"
      alt=""
      width={size}
      height={size}
      // A marca e a primeira coisa acima da dobra na landing.
      priority
      className={className}
    />
  );
}
