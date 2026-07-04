import React from 'react';
export default function Menu({ setPagina }) {
return (
<nav className="menu-nav">
    <button onClick={() => setPagina('inicio')} style={{ marginRight: '10px'
    }}>Início</button>
    <button onClick={() => setPagina('cidades')} >Cidades</button>
    <button onClick={() => setPagina('equipamentos')} >Equipamentos</button>
    <button onClick={() => setPagina('funcionarios')} >Funcionários</button>
    <button onClick={() => setPagina('servicos')}>Serviços</button>
</nav>
);
}