import React, { useState, useEffect } from 'react';
import { servicosService } from '../services/api';
export default function Servicos() {
    const [servicos, setServicos] = useState([]);
    const [nome, setNome] = useState('');
    const [setor, setSetor] = useState('');
    const [editandoId, setEditandoId] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState('');

    useEffect(() => {
        carregarServicos();
    }, []);
    const carregarServicos = async () => {
        setCarregando(true);
        setErro('');
        try {
            const { data, error } = await servicosService.listar();
            if (error) throw error;
            setServicos(data);
        } catch (error) {
            console.error("Erro ao buscar serviços", error);
            setErro('Não foi possível carregar os serviços.');
        } finally {
            setCarregando(false);
        }
    };

    const limparFormulario = () => {
        setNome('');
        setSetor('');
        setEditandoId(null);
    };

    const salvar = async () => {
        if (!nome || !setor) return setErro('Preencha todos os campos!');
        setSalvando(true);
        setErro('');
        try {
            if (editandoId) {
                const { error } = await servicosService.atualizar(editandoId, { nome, setor });
                if (error) throw error;
            } else {
                const { error } = await servicosService.criar({ nome, setor });
                if (error) throw error;
            }
            limparFormulario();
            carregarServicos();
        } catch (error) {
            console.error("Erro ao cadastrar", error);
            setErro('Não foi possível salvar o serviço.');
        } finally {
            setSalvando(false);
        }
    };

    const editar = (servico) => {
        setEditandoId(servico.id);
        setNome(servico.nome);
        setSetor(servico.setor);
    };

    const remover = async (id) => {
        if (!confirm('Excluir este serviço?')) return;
        setErro('');
        try {
            const { error } = await servicosService.excluir(id);
            if (error) throw error;
            carregarServicos();
        } catch (error) {
            console.error("Erro ao excluir", error);
            setErro('Não foi possível excluir o serviço.');
        }
    };

    
    return (
        <div>
            <h2>Gestão de Serviços</h2>

            {erro && (
                <div style={{ background: '#fdecea', color: '#b71c1c', padding: '10px', borderRadius: '4px', marginBottom: '12px' }}>
                    {erro}
                </div>
            )}

            <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
                <h3>{editandoId ? 'Editar Serviço' : 'Novo Serviço'}</h3>
                <input type="text" placeholder="Nome do Serviço" value={nome}
                    onChange={(e) => setNome(e.target.value)} style={{ marginRight: '10px' }} />
                <input type="text" placeholder="Setor (Ex: Extração)" value={setor}
                    onChange={(e) => setSetor(e.target.value)} style={{ marginRight: '10px' }} />
                <button onClick={salvar} disabled={salvando}>
                    {salvando ? 'Salvando...' : editandoId ? 'Salvar' : 'Cadastrar'}
                </button>
                {editandoId && (
                    <button onClick={limparFormulario} style={{ marginLeft: '8px' }}>Cancelar</button>
                )}
            </div>

            <h3>Serviços Cadastrados</h3>
            {carregando ? (
                <p>Carregando...</p>
            ) : servicos.length === 0 ? (
                <p>Nenhum serviço cadastrado.</p>
            ) : (
                <ul>
                    {servicos.map(servico => (
                        <li key={servico.id} style={{ marginBottom: '6px' }}>
                            <strong>{servico.nome}</strong> - Setor: {servico.setor}
                            <button className="btn-editar" onClick={() => editar(servico)}>Editar</button>
                            <button className="btn-excluir" onClick={() => remover(servico.id)}>Excluir</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}