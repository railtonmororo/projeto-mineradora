import React, { useState, useEffect } from 'react';
import { cidadeService } from '../services/api';
export default function Cidades() {
    const [cidades, setCidades] = useState([]);
    const [nome, setNome] = useState('');
    const [localizacao, setLocalizacao] = useState('');
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
       try{

            const {data, error} = await cidadeService.listar();
            if (error) throw error;
            setCidades(data);
       } catch(error) {
            console.error("Erro ao buscar cidade", error);
            setErro('Não foi possível carregar as cidades. ');
       } finally{
            setCarregando(false);
       }
    };

    const limparFormulario = () => {
        setNome('');
        setLocalizacao('');
        setEditandoId(null);
    }
    const salvar = async () => {
        if (!nome || !localizacao) return alert("Preencha todos os campos!");
        setSalvando(true);
        setErro('');
        try {
            if(editandoId) {
                const {error} = await cidadeService.atualizar(editandoId, {nome, localizacao});
                if(error) throw error;
            }else {
                const {error} = await cidadeService.criar({nome, localizacao});
                if (error) throw error;
            }
            limparFormulario();
            carregarCidades();
        }catch(error) {
            console.error("Erro ao salvar", error);
            setErro('Não foi possível salvar a cidade.');
        }finally{
            setSalvando(false);
        }
    };

    const editar = (cidades) => {
        setEditandoId(cidades.id)
        setNome(cidades.nome);
        setLocalizacao(cidades.localizacao)   
    };

    const remover = async (id) => {
        if(!confirm('Deseja realmente excluir esta cidade?')) return;
        setErro('');
        try{
            const {error} = await cidadeService.excluir(id);
            if(error) throw error;
            carregarCidades();
        }catch (error) {
            console.error("Erro ao excluir", error);
            setErro('Não foi possível excluir. Verifi1que senão há funcionários ou equipamentos vinculados. ');
        }
    };
    return (
        <div className="page-header">
            <h2>Gestão de Cidades</h2>

            {erro && ( <div style={{background: '#fdecea', color: '#b71c1c', padding: '10px',  borderRadius: '4px', marginBottom: '12px'}}> {erro}</div>)}

            <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
                <h3>{editandoId ? 'Editar Cidade' : 'Nova Cidade'}</h3>
                <input type="text" placeholder="Nome da Cidade" value={nome}
                    onChange={(e) => setNome(e.target.value)} style={{ marginRight: '10px' }} />
                <input type="text" placeholder="Localização (Ex: Ceará)" value={localizacao}
                    onChange={(e) => setLocalizacao(e.target.value)} style={{ marginRight: '10px' }} />
                <button onClick={salvar} disabled={salvando}>{salvando ? 'Salvando...' : editandoId ? 'Salvar' : 'Cadastrar'}</button>
                {editandoId && (<button onClick={limparFormulario} style={{marginLeft: '8px'}}> Cancelar</button>)}
            </div>
            <h3>Cidades Cadastradas</h3>
            {carregando ? (<p>Carregando...</p>
            ) : cidades.length === 0 ? (
                <p>Nenhuma cidade cadastrada.</p>
            ) : (
                <ul>
                {cidades.map(cidade => (
                    <li key={cidade.id} style={{marginBottom: '6px'}}><strong>{cidade.nome}</strong> -Localizacao: {cidade.localizacao}
                    <button className="btn-editar" onClick={() => editar(cidade)} >Editar</button>
                    <button className="btn-excluir" onClick={() => remover(cidade.id)}>Excluir</button>
                    </li>
                ))}
            </ul>
            )}
            
        </div>
    );
}