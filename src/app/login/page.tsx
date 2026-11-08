"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../services/auth/auth";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    const ok = await login(email, senha);
    if (ok) router.push("/usuarios");
    else setErro("E-mail ou senha inválidos");
  }

  return (
    <form onSubmit={entrar} style={{ maxWidth: 320, margin: "80px auto", display: "grid", gap: 12 }}>
      <h1>Login</h1>
      <input placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      <button type="submit">Entrar</button>
    </form>
  );
}