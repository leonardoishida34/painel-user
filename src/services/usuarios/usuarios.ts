import { IUsuario, UsuarioForm } from './tipos'

const API_URL = 'http://localhost:3001/usuarios'

export async function listar(): Promise<IUsuario[]> {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error('Erro ao listar')
    return res.json()
}

export async function criar(dados: UsuarioForm): Promise<IUsuario> {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
    })
    if (!res.ok) throw new Error('Erro ao cadastrar')
    return res.json()
}

export async function atualizar(id: number, dados: UsuarioForm): Promise<IUsuario> {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
    })
    if (!res.ok) throw new Error('Erro ao atualizar')
    return res.json()
}

export async function remover(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Erro ao excluir')
}