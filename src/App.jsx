import React, { useState } from 'react';
import Menu from './components/Menu';
import Inicio from './Pages/Inicio';
import Equipamentos from './Pages/Equipamentos';
import Cidades from './Pages/Cidades';
import Funcionarios from './Pages/Funcionarios';
import Servicos from './Pages/Servicos';

import './App.css';

function App() {
    const [pagina, setPagina] = useState('inicio');
    return (
        <div className="app-container">
            <Menu setPagina={setPagina} />
            <hr />
            {pagina === 'inicio' && <Inicio />}
            {pagina === 'cidades' && <Cidades />}
            {pagina === 'equipamentos' && <Equipamentos />}
            {pagina === 'funcionarios' && <Funcionarios />}
            {pagina === 'servicos' && <Servicos />}
        </div>
    );
}
export default App;