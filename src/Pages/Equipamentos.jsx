import React, { useState, useEffect } from 'react';
import { equipamentoService, cidadeService } from '../services/api';
export default function Equipamentos() {
    const [equipamentos, setEquipamentos] = useState([]);
    const [cidades, setCidades] = useState([]);
    const [nome, setNome] = useState('');
    const [setor, setSetor] = useState('');
    const [cidadeId, setCidadeId] = useState('');
    const [editandoId, setEditandoId] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState('');
    useEffect(() => {
        carregarEquipamentos();
        carregarCidades();
    }, []);
    const carregarEquipamentos = async () => {
            setCarregando(true);
            setErro('');
            try {
                    const { data, error } = await equipamentoService.listar();
                    if (error) throw error;
                    setEquipamentos(data);
                } catch (error) {
                    console.error("Erro ao buscar equipamentos", error);
                    setErro('Não foi possível carregar os equipamentos.');
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
                const { error } = await equipamentoService.atualizar(editandoId, payload);
                if (error) throw error;
            } else {
                const { error } = await equipamentoService.criar(payload);
                if (error) throw error;
            }
            limparFormulario();
            carregarEquipamentos();
        } catch (error) {
            console.error("Erro ao salvar", error);
            setErro('Não foi possível salvar o equipamento.');
        } finally {
            setSalvando(false);
        }
    };

    const editar = (eq) => {
        setEditandoId(eq.id);
        setNome(eq.nome);
        setSetor(eq.setor);
        setCidadeId(eq.cidade_id ?? '');
    };

    const remover = async (id) => {
        if (!confirm('Excluir este equipamento?')) return;
        setErro('');
        try {
            const { error } = await equipamentoService.excluir(id);
            if (error) throw error;
            carregarEquipamentos();
        } catch (error) {
            console.error("Erro ao excluir", error);
            setErro('Não foi possível excluir o equipamento.');
        }
    };

    return (
        <div>
            <h2>Gestão de Equipamentos</h2>

            {erro && (
                <div style={{ background: '#fdecea', color: '#b71c1c', padding: '10px', borderRadius: '4px', marginBottom: '12px' }}>
                    {erro}
                </div>
            )}

            <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
                <h3>{editandoId ? 'Editar Equipamento' : 'Novo Equipamento'}</h3>
                <input type="text" placeholder="Nome do Equipamento" value={nome}
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

            <h3>Equipamentos Cadastrados</h3>
            {carregando ? (
                <p>Carregando...</p>
            ) : equipamentos.length === 0 ? (
                <p>Nenhum equipamento cadastrado.</p>
            ) : (
                <ul>
                    {equipamentos.map(eq => (
                        <li key={eq.id} style={{ marginBottom: '6px' }}>
                            <strong>{eq.nome}</strong> - Setor: {eq.setor} - Cidade: {eq.cidades?.nome ?? '—'}
                            <button className="btn-editar" onClick={() => editar(eq)} >Editar</button>
                            <button className="btn-excluir" onClick={() => remover(eq.id)} >Excluir</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}