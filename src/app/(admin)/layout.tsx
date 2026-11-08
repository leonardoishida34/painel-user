"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { tokenValido, logout } from "../../services/auth/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [liberado, setLiberado] = useState(false);

  useEffect(() => {
    if (tokenValido()) setLiberado(true);
    else router.replace("/login");
  }, [router]);

  if (!liberado) return null;

  function sair() {
    logout();
    router.replace("/login");
  }

  return (
    <div>
      <div style={{ textAlign: "right", padding: 8 }}>
        <button onClick={sair}>Sair</button>
      </div>
      {children}
    </div>
  );
}