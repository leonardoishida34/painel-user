const CHAVE = "painel1pitchau.token";
const API = "http://localhost:3001"; 

// Confere e-mail e senha e, se estiverem certos, gera e guarda o token
export async function login(email: string, senha: string): Promise<boolean> {
  const res = await fetch(`${API}/usuarios?email=${encodeURIComponent(email)}`);
  const usuarios = await res.json();
  const usuario = usuarios[0];

  if (!usuario || usuario.senha !== senha) return false;

  // token com o id do usuário e validade de 2 horas
  const token = btoa(JSON.stringify({ id: usuario.id, exp: Date.now() + 2 * 60 * 60 * 1000 }));
  localStorage.setItem(CHAVE, token);
  return true;
}

// O token é válido se existe, está bem formado e ainda não expirou
export function tokenValido(): boolean {
  const token = localStorage.getItem(CHAVE);
  if (!token) return false;
  try {
    const dados = JSON.parse(atob(token));
    return dados.exp > Date.now();
  } catch {
    return false;
  }
}

export function logout() {
  localStorage.removeItem(CHAVE);
}