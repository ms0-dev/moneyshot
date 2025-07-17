import Image from "next/image";

export function Logo() {
  return (
    <>
      <Image src="/logo.png" alt="Home" width={150} height={150} priority className="hidden md:block" />
      <Image src="/logo-icon.png" alt="Home" width={40} height={40} priority className="md:hidden" />
    </>
  );
}
