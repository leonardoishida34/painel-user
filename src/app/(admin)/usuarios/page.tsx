"use client"

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { IUsuario, UsuarioForm } from '@/src/services/usuarios/tipos'
import { atualizar, criar, listar, remover } from '@/src/services/usuarios/usuarios'
import { mascaraCEP, mascaraCPF, mascaraData, mascaraTelefone } from '@/src/utils/mascaras'
import { validarUsuario } from '@/src/utils/validacoes'

const formVazio: UsuarioForm = {
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    senha: '',
    endereco: {
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
    },
}

const css = `
    .pagina { max-width: 1000px; margin: 0 auto; padding: 24px; font-family: Arial, sans-serif; color: #222; }
    .pagina h1 { margin-bottom: 16px; }
    .form { display: grid; gap: 16px; max-width: 600px; margin-bottom: 32px; }
    .form fieldset { display: grid; gap: 12px; border: 1px solid #ccc; border-radius: 8px; padding: 16px; }
    .form legend { font-weight: bold; padding: 0 8px; }
    .campo { display: flex; flex-direction: column; gap: 4px; font-size: 14px; }
    .campo input { border: 1px solid #888; border-radius: 4px; padding: 8px; font-size: 14px; }
    .campo input:focus { outline: 2px solid #2563eb; border-color: #2563eb; }
    .erro-campo { color: #dc2626; font-size: 12px; }
    .erro-api { color: #dc2626; margin-bottom: 12px; }
    .acoes { display: flex; gap: 8px; }
    .btn { border: 1px solid #888; border-radius: 4px; padding: 8px 14px; background: #f3f4f6; cursor: pointer; font-size: 14px; }
    .btn:hover { background: #e5e7eb; }
    .btn-principal { background: #2563eb; border-color: #2563eb; color: #fff; }
    .btn-principal:hover { background: #1d4ed8; }
    .btn-perigo { background: #dc2626; border-color: #dc2626; color: #fff; }
    .btn-perigo:hover { background: #b91c1c; }
    .tabela { width: 100%; border-collapse: collapse; font-size: 14px; }
    .tabela th, .tabela td { border: 1px solid #ccc; padding: 8px 10px; text-align: left; }
    .tabela th { background: #f3f4f6; }
    .tabela td.acoes-tabela { display: flex; gap: 6px; border: none; border-top: 1px solid #ccc; }
`

interface CampoProps {
    label: string
    name: string
    value: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    erro?: string
    type?: string
    placeholder?: string
}

function Campo({ label, name, value, onChange, erro, type = 'text', placeholder }: CampoProps) {
    return (
        <label className="campo">
            {label}
            <input
                name={name}
                value={value}
                onChange={onChange}
                type={type}
                placeholder={placeholder}
            />
            {erro && <small className="erro-campo">{erro}</small>}
        </label>
    )
}

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState<IUsuario[]>([])
    const [form, setForm] = useState<UsuarioForm>(formVazio)
    const [erros, setErros] = useState<Record<string, string>>({})
    const [editandoId, setEditandoId] = useState<number | null>(null)
    const [erroApi, setErroApi] = useState('')

    async function carregar() {
        try {
            setUsuarios(await listar())
            setErroApi('')
        } catch {
            setErroApi('Não foi possível carregar. O JSON Server está rodando?')
        }
    }

    useEffect(() => {
        carregar()
    }, [])

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target

        let novo = value
        if (name === 'cpf') novo = mascaraCPF(value)
        if (name === 'telefone') novo = mascaraTelefone(value)
        if (name === 'dataNascimento') novo = mascaraData(value)

        setForm({ ...form, [name]: novo })
    }

    function handleChangeEndereco(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target

        let novo = value
        if (name === 'cep') novo = mascaraCEP(value)
        if (name === 'estado') novo = value.toUpperCase().slice(0, 2)

        setForm({ ...form, endereco: { ...form.endereco, [name]: novo } })
    }

    function limparFormulario() {
        setForm(formVazio)
        setErros({})
        setEditandoId(null)
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()

        const errosEncontrados = validarUsuario(form)
        setErros(errosEncontrados)
        if (Object.keys(errosEncontrados).length > 0) return

        try {
            if (editandoId === null) {
                await criar(form)
            } else {
                await atualizar(editandoId, form)
            }
            limparFormulario()
            await carregar()
        } catch {
            setErroApi('Erro ao salvar o usuário. O JSON Server está rodando?')
        }
    }

    function handleEditar(usuario: IUsuario) {
        const { id, ...dados } = usuario
        setEditandoId(id)
        setForm(dados)
        setErros({})
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    async function handleExcluir(id: number) {
        if (!confirm('Deseja realmente excluir este usuário?')) return

        try {
            await remover(id)
            if (editandoId === id) limparFormulario()
            await carregar()
        } catch {
            setErroApi('Erro ao excluir o usuário.')
        }
    }

    return (
        <main className="pagina">
            <style>{css}</style>

            <h1>Usuários</h1>

            <form className="form" onSubmit={handleSubmit}>
                <h2>{editandoId === null ? 'Novo usuário' : 'Editar usuário'}</h2>

                <fieldset>
                    <legend>Dados pessoais</legend>
                    <Campo label="Nome" name="nome" value={form.nome} onChange={handleChange} erro={erros.nome} />
                    <Campo label="CPF" name="cpf" value={form.cpf} onChange={handleChange} erro={erros.cpf} placeholder="000.000.000-00" />
                    <Campo label="E-mail" name="email" value={form.email} onChange={handleChange} erro={erros.email} type="email" />
                    <Campo label="Telefone" name="telefone" value={form.telefone} onChange={handleChange} erro={erros.telefone} placeholder="(00) 00000-0000" />
                    <Campo label="Data de nascimento" name="dataNascimento" value={form.dataNascimento} onChange={handleChange} erro={erros.dataNascimento} placeholder="DD/MM/AAAA" />
                    <Campo label="Senha" name="senha" value={form.senha} onChange={handleChange} erro={erros.senha} type="password" />
                </fieldset>

                <fieldset>
                    <legend>Endereço</legend>
                    <Campo label="CEP" name="cep" value={form.endereco.cep} onChange={handleChangeEndereco} erro={erros.cep} placeholder="00000-000" />
                    <Campo label="Logradouro" name="logradouro" value={form.endereco.logradouro} onChange={handleChangeEndereco} erro={erros.logradouro} />
                    <Campo label="Número" name="numero" value={form.endereco.numero} onChange={handleChangeEndereco} erro={erros.numero} />
                    <Campo label="Complemento (opcional)" name="complemento" value={form.endereco.complemento} onChange={handleChangeEndereco} />
                    <Campo label="Bairro" name="bairro" value={form.endereco.bairro} onChange={handleChangeEndereco} erro={erros.bairro} />
                    <Campo label="Cidade" name="cidade" value={form.endereco.cidade} onChange={handleChangeEndereco} erro={erros.cidade} />
                    <Campo label="Estado (UF)" name="estado" value={form.endereco.estado} onChange={handleChangeEndereco} erro={erros.estado} placeholder="PR" />
                </fieldset>

                <div className="acoes">
                    <button type="submit" className="btn btn-principal">
                        {editandoId === null ? 'Cadastrar' : 'Salvar alterações'}
                    </button>
                    {editandoId !== null && (
                        <button type="button" className="btn" onClick={limparFormulario}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            {erroApi && <p className="erro-api">{erroApi}</p>}

            <table className="tabela">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>CPF</th>
                        <th>E-mail</th>
                        <th>Telefone</th>
                        <th>Nascimento</th>
                        <th>Cidade/UF</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(u => (
                        <tr key={u.id}>
                            <td>{u.nome}</td>
                            <td>{u.cpf}</td>
                            <td>{u.email}</td>
                            <td>{u.telefone}</td>
                            <td>{u.dataNascimento}</td>
                            <td>{u.endereco.cidade}/{u.endereco.estado}</td>
                            <td>
                                <button className="btn" onClick={() => handleEditar(u)}>Editar</button>{' '}
                                <button className="btn btn-perigo" onClick={() => handleExcluir(u.id)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                    {usuarios.length === 0 && (
                        <tr>
                            <td colSpan={7}>Nenhum usuário cadastrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </main>
    )
}