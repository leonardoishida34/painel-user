const somenteNumeros = (v: string) => v.replace(/\D/g, '')

export const mascaraCPF = (v: string) =>
    somenteNumeros(v)
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')

export const mascaraTelefone = (v: string) => {
    const n = somenteNumeros(v).slice(0, 11)
    if (n.length <= 10) {
        return n.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2')
    }
    return n.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2')
}

export const mascaraCEP = (v: string) =>
    somenteNumeros(v).slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2')

export const mascaraData = (v: string) =>
    somenteNumeros(v)
        .slice(0, 8)
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2')