import React, { useState, useEffect } from 'react';
import { funcionariosService, cidadeService } from '../services/api';
export default function Funcionarios() {
    const [funcionarios, setFuncionarios] = useState([]);
    const [cidades, setCidades] = useState([]);
    const [nome, setNome] = useState('');
    const [setor, setSetor] = useState('');
    const [cidadeId, setCidadeId] = useState('');
    const [editandoId, setEditandoId] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState('');

    useEffect(() => {
        carregarFuncionarios();
        carregarCidades();
    }, []);
    const carregarFuncionarios = async () => {
        setCarregando(true);
        setErro('');
        try {
            const { data, error } = await funcionariosService.listar();
            if (error) throw error;
            setFuncionarios(data);
        } catch (error) {
            console.error("Erro ao buscar funcionario", error);
            setErro('Não foi possível carregar os funcionários.');
        } finally {
            setCarregando(false);
        }
    };
    
     const carregarCidades = async () => {
        try {
            const { data, error } = await cidadeService.listar();
            if (error) throw error;
            setCidades(data);
        } catch (error) {
            console.error("Erro ao buscar cidades", error);
        }
    };

    const limparFormulario = () => {
        setNome('');
        setSetor('');
        setCidadeId('');
        setEditandoId(null);
    };

    const salvar = async () => {
        if (!nome || !setor || !cidadeId) return setErro('Preencha todos os campos, incluindo a cidade!');
        setSalvando(true);
        setErro('');
        const payload = { nome, setor, cidade_id: Number(cidadeId) };
        try {
            if (editandoId) {
                const { error } = await funcionariosService.atualizar(editandoId, payload);
                if (error) throw error;
            } else {
                const { error } = await funcionariosService.criar(payload);
                if (error) throw error;
            }
            limparFormulario();
            carregarFuncionarios();
        } catch (error) {
            console.error("Erro ao cadastrar", error);
            setErro('Não foi possível salvar o funcionário.');
        } finally {
            setSalvando(false);
        }
    };

     const editar = (funcionario) => {
        setEditandoId(funcionario.id);
        setNome(funcionario.nome);
        setSetor(funcionario.setor);
        setCidadeId(funcionario.cidade_id ?? '');
    };

    const remover = async (id) => {
        if (!confirm('Excluir este funcionário?')) return;
        setErro('');
        try {
            const { error } = await funcionariosService.excluir(id);
            if (error) throw error;
            carregarFuncionarios();
        } catch (error) {
            console.error("Erro ao excluir", error);
            setErro('Não foi possível excluir o funcionário.');
        }
    };


    return (
        <div>
            <h2>Gestão de Funcionários</h2>

            {erro && (
                <div style={{ background: '#fdecea', color: '#b71c1c', padding: '10px', borderRadius: '4px', marginBottom: '12px' }}>
                    {erro}
                </div>
            )}

            <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
                <h3>{editandoId ? 'Editar Funcionário' : 'Novo Funcionário'}</h3>
                <input type="text" placeholder="Nome do Funcionário" value={nome}
                    onChange={(e) => setNome(e.target.value)} style={{ marginRight: '10px' }} />
                <input type="text" placeholder="Setor (Ex: Extração)" value={setor}
                    onChange={(e) => setSetor(e.target.value)} style={{ marginRight: '10px' }} />
                <select value={cidadeId} onChange={(e) => setCidadeId(e.target.value)} style={{ marginRight: '10px' }}>
                    <option value="">Selecione a cidade</option>
                    {cidades.map((cidade) => (
                        <option key={cidade.id} value={cidade.id}>{cidade.nome}</option>
                    ))}
                </select>
                <button onClick={salvar} disabled={salvando}>
                    {salvando ? 'Salvando...' : editandoId ? 'Salvar' : 'Cadastrar'}
                </button>
                {editandoId && (
                    <button onClick={limparFormulario} style={{ marginLeft: '8px' }}>Cancelar</button>
                )}
            </div>

            <h3>Funcionários Cadastrados</h3>
            {carregando ? (
                <p>Carregando...</p>
            ) : funcionarios.length === 0 ? (
                <p>Nenhum funcionário cadastrado.</p>
            ) : (
                <ul>
                    {funcionarios.map(funcionario => (
                        <li key={funcionario.id} style={{ marginBottom: '6px' }}>
                            <strong>{funcionario.nome}</strong> - Setor: {funcionario.setor} - Cidade: {funcionario.cidades?.nome ?? '—'}
                            <button className="btn-editar" onClick={() => editar(funcionario)} >Editar</button>
                            <button className="btn-excluir" onClick={() => remover(funcionario.id)} >Excluir</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}