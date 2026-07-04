import React, { useState, useEffect } from 'react';
import { cidadeService } from '../services/api';
export default function Cidades() {
    const [cidades, setCidades] = useState([]);
    const [nome, setNome] = useState('');
    const [estado, setEstado] = useState('');
    const [editandoId, setEditandoId] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState(' ');
    useEffect(() => {
        carregarCidades();
    }, []);
    const carregarCidades = async () => {
        setCarregando(true);
        setErro('');
        try {

            const { data, error } = await cidadeService.listar();
            if (error) throw error;
            setCidades(data);
        } catch (error) {
            console.error("Erro ao buscar cidade", error);
            setErro('Não foi possível carregar as cidades. ');
        } finally {
            setCarregando(false);
        }
    };

    const limparFormulario = () => {
        setNome('');
        setEstado('');
        setEditandoId(null);
    }
    const salvar = async () => {
        if (!nome || !estado) return alert("Preencha todos os campos!");
        setSalvando(true);
        setErro('');
        try {
            if (editandoId) {
                const { error } = await cidadeService.atualizar(editandoId, { nome, estado });
                if (error) throw error;
            } else {
                const { error } = await cidadeService.criar({ nome, estado });
                if (error) throw error;
            }
            limparFormulario();
            carregarCidades();
        } catch (error) {
            console.error("Erro ao salvar", error);
            setErro('Não foi possível salvar a cidade.');
        } finally {
            setSalvando(false);
        }
    };

    const editar = (cidades) => {
        setEditandoId(cidades.id)
        setNome(cidades.nome);
        setEstado(cidades.estado)
    };

    const remover = async (id) => {
        if (!confirm('Deseja realmente excluir esta cidade?')) return;
        setErro('');
        try {
            const { error } = await cidadeService.excluir(id);
            if (error) throw error;
            carregarCidades();
        } catch (error) {
            console.error("Erro ao excluir", error);
            setErro('Não foi possível excluir. Verifique senão há funcionários ou equipamentos vinculados. ');
        }
    };

    const formatarCapitalize = (texto) => {
        if (!texto) return '';
        return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
    };
    return (
        <div className="page-header">
            <h2>Gestão de Cidades</h2>

            {erro && (<div style={{ background: '#fdecea', color: '#b71c1c', padding: '10px', borderRadius: '4px', marginBottom: '12px' }}> {erro}</div>)}

            <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
                <h3>{editandoId ? 'Editar Cidade' : 'Nova Cidade'}</h3>
                <input type="text" placeholder="Nome da Cidade" value={nome}
                    onChange={(e) => setNome(formatarCapitalize(e.target.value))} style={{ marginRight: '10px' }} />
                <input type="text" placeholder="Estado (Ex: Ceará)" value={estado}
                    onChange={(e) => setEstado(e.target.value.toUpperCase())} style={{ marginRight: '10px' }} />
                <button onClick={salvar} disabled={salvando}>{salvando ? 'Salvando...' : editandoId ? 'Salvar' : 'Cadastrar'}</button>
                {editandoId && (<button onClick={limparFormulario} style={{ marginLeft: '8px' }}> Cancelar</button>)}
            </div>
            <h3>Cidades Cadastradas</h3>
            {carregando ? (<p>Carregando...</p>
            ) : cidades.length === 0 ? (
                <p>Nenhuma cidade cadastrada.</p>
            ) : (
                <ul>
                    {cidades.map(cidade => (
                        <li key={cidade.id}>
                            <div className="item-info">
                                <strong>{cidade.nome}</strong>  Estado: {cidade.estado}
                            </div>
                            <div className="item-acoes">
                                <button className="btn-editar" onClick={() => editar(cidade)}>Editar</button>
                                <button className="btn-excluir" onClick={() => remover(cidade.id)}>Excluir</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
}