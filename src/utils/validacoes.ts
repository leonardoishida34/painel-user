import { UsuarioForm } from '@/src/services/usuarios/tipos'

const somenteNumeros = (v: string) => v.replace(/\D/g, '')

// Confere os 2 dígitos verificadores do CPF
export function cpfValido(cpf: string): boolean {
    const n = somenteNumeros(cpf)

    // 11 dígitos e não pode ser sequência repetida (111.111.111-11)
    if (n.length !== 11 || /^(\d)\1+$/.test(n)) return false

    const calcular = (qtd: number) => {
        let soma = 0
        for (let i = 0; i < qtd; i++) {
            soma += Number(n[i]) * (qtd + 1 - i)
        }
        const resto = (soma * 10) % 11
        return resto === 10 ? 0 : resto
    }

    return calcular(9) === Number(n[9]) && calcular(10) === Number(n[10])
}

// Confere se é uma data real (DD/MM/AAAA) e não futura
export function dataValida(data: string): boolean {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data)) return false

    const [dia, mes, ano] = data.split('/').map(Number)
    const d = new Date(ano, mes - 1, dia)

    const existe =
        d.getFullYear() === ano && d.getMonth() === mes - 1 && d.getDate() === dia

    return existe && d <= new Date() && ano >= 1900
}

// Valida o formulário inteiro e devolve um objeto { campo: mensagem }
export function validarUsuario(u: UsuarioForm): Record<string, string> {
    const erros: Record<string, string> = {}

    if (u.nome.trim().length < 3) erros.nome = 'Informe o nome completo'
    if (!cpfValido(u.cpf)) erros.cpf = 'CPF inválido'
    if (!/^\S+@\S+\.\S+$/.test(u.email)) erros.email = 'E-mail inválido'

    const tel = somenteNumeros(u.telefone).length
    if (tel !== 10 && tel !== 11) erros.telefone = 'Telefone inválido'

    if (!dataValida(u.dataNascimento)) erros.dataNascimento = 'Data inválida (DD/MM/AAAA)'
    if (u.senha.length < 6) erros.senha = 'A senha deve ter no mínimo 6 caracteres'

    if (somenteNumeros(u.endereco.cep).length !== 8) erros.cep = 'CEP inválido'
    if (!u.endereco.logradouro.trim()) erros.logradouro = 'Informe o logradouro'
    if (!u.endereco.numero.trim()) erros.numero = 'Informe o número'
    if (!u.endereco.bairro.trim()) erros.bairro = 'Informe o bairro'
    if (!u.endereco.cidade.trim()) erros.cidade = 'Informe a cidade'
    if (u.endereco.estado.length !== 2) erros.estado = 'Use a sigla (ex.: PR)'

    return erros
}