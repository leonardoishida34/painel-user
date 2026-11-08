export interface IEndereco {
    cep: string
    logradouro: string
    numero: string
    complemento: string
    bairro: string
    cidade: string
    estado: string
}

export interface IUsuario {
    id: number
    nome: string
    cpf: string
    email: string
    telefone: string
    dataNascimento: string
    senha: string
    endereco: IEndereco
}

export type UsuarioForm = Omit<IUsuario, 'id'>