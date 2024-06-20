import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import Sidebar from '../production_beton/SidebarProduction';
import Header from '../../../components/Main/Header';
import CustomAlert from '../../../components/costumeAlert/costumeAlert';
import './App.css';
const SearchableSelect = ({ options, value, onChange, placeholder, disabled }) => {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    const filteredOptions = useMemo(() => {
        return options.filter(option =>
            option.name && option.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, options]);

    const handleFocus = useCallback(() => {
        setIsOpen(true);
    }, []);

    const handleBlur = useCallback((e) => {
        if (selectRef.current && !selectRef.current.contains(e.relatedTarget)) {
            setIsOpen(false);
        }
    }, []);

    useEffect(() => {
        if (value) {
            const selectedOption = options.find(option => option.name === value);
            setSearch(selectedOption ? selectedOption.name : '');
        }
    }, [value, options]);

    return (
        <div className="searchable-select" ref={selectRef}>
            <input
                type="text"
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={disabled}
                className="searchable-select-input"
            />
            {isOpen && (
                <select
                    value={value}
                    onChange={(e) => {
                        onChange(e);
                        setIsOpen(false);
                        setSearch('');
                    }}
                    size={Math.min(5, filteredOptions.length)}
                    onBlur={handleBlur}
                    className="searchable-select-dropdown"
                >
                    <option value="">{placeholder}</option>
                    {filteredOptions.map(option => (
                        <option key={option.id} value={option.name}>
                            {option.name}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};

function BonProductionForm() {
    const [clients, setClients] = useState([]);
    const [formulas, setFormulas] = useState([]);
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [selectedClient, setSelectedClient] = useState('');
    const [selectedFormula, setSelectedFormula] = useState('');
    const [quantity, setQuantity] = useState('');
    const [codeBon, setCodeBon] = useState('');
    const [lieuLivraison, setLieuLivraison] = useState('');
    const [heure, setHeure] = useState('');
    const [date, setDate] = useState('');
    const [bonProductionAdded, setBonProductionAdded] = useState(false);
    const [bonProductions, setBonProductions] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const currentYear = new Date().getFullYear();
                const response = await fetch('http://localhost:8080/bon_production');
                const data = await response.json();
                const incrementedCount = data.count + 1;
                const displayCount = `BP${incrementedCount}${currentYear}`;
                setCodeBon(displayCount);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchCounts();
    }, []);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get('http://localhost:8080/clients', {
                    params: { IsActive: true }
                });
                setClients(response.data.data);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };

        const fetchFormulas = async () => {
            try {
                const response = await axios.get('http://localhost:8080/Formules');
                setFormulas(response.data);
            } catch (error) {
                console.error('Error fetching formulas:', error);
            }
        };

        fetchClients();
        fetchFormulas();
    }, []);

    const handleAddBonProduction = () => {
        if (!selectedClient || !selectedFormula || !quantity || !heure || !lieuLivraison || !date || !codeBon) {
            setErrorMessage('Veuillez remplir tous les champs.');
            return;
        }

        const newBonProduction = {
            client_name: selectedClient,
            formules: [{ formula_name: selectedFormula }],
            quantite: quantity,
            code_Bon: codeBon,
            lieu_livraison: lieuLivraison,
            heure: heure,
            date: date
        };

        setBonProductions([newBonProduction]);
        setCodeBon(''); // Reset codeBon after adding
        setErrorMessage('');
        setBonProductionAdded(true);
    };

    const handleDelete = (index) => {
        const updatedBonProductions = [...bonProductions];
        updatedBonProductions.splice(index, 1);
        setBonProductions(updatedBonProductions);
        setBonProductionAdded(false);
    };

    const handleValidate = async () => {
        if (bonProductions.length === 0) {
            setErrorMessage('Veuillez ajouter au moins un bon de production.');
            return;
        }

        try {
            const dataToSend = {
                code_bon: bonProductions[0].code_Bon,
                client_name: bonProductions[0].client_name,
                formules: bonProductions.map(bonProduction => bonProduction.formules[0]),
                quantite: bonProductions[0].quantite,
                lieu_livraison: bonProductions[0].lieu_livraison,
                heure: bonProductions[0].heure,
                date: bonProductions[0].date
            };

            await axios.post('http://localhost:8080/bon_production', dataToSend);
            alert('Les données ont été enregistrées avec succès !');
        } catch (error) {
            console.error('Error saving bon productions:', error);
            alert('Une erreur est survenue lors de l\'enregistrement des données.');
        }
    };

    return (
        <div className="grid-container">
            <Header OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <div className='container'>
                <div className="bon-production-form">
                    <h1 className="title-all">Bon de Production</h1>
                    <div className="form-container">
                        <div className='bloc'>
                            <div className='bloc1'>
                                <div>
                                    <label>Client:</label>
                                    <SearchableSelect
                                        options={clients}
                                        value={selectedClient}
                                        onChange={(e) => setSelectedClient(e.target.value)}
                                        placeholder="Sélectionnez un client"
                                    />
                                </div>
                                <div>
                                    <label>Formule:</label>
                                    <SearchableSelect
                                        options={formulas}
                                        value={selectedFormula}
                                        onChange={(e) => setSelectedFormula(e.target.value)}
                                        placeholder="Sélectionnez une formule"
                                    />
                                </div>
                                <div>
                                    <label>Code du bon:</label>
                                    <input placeholder="Code de bon" type="text" value={codeBon} onChange={(e) => setCodeBon(e.target.value)} />
                                </div>
                                <div>
                                    <label>Volume:</label>
                                    <input placeholder="Volume" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                                </div>
                            </div>
                            <div className='bloc2'>
                                <div className='datebon'>
                                    <label>Date:</label>
                                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="styled-date" />
                                </div>
                                <div>
                                    <div>
                                        <label>Heure:</label>
                                        <select value={heure} onChange={(e) => setHeure(e.target.value)} className="styled-select">
                                            <option value="">Sélectionnez une heure</option>
                                            {Array.from({ length: 24 }, (_, i) => (
                                                <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                                                    {i.toString().padStart(2, '0')}:00
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <label>Lieu de livraison:</label>
                                    <input type="text" value={lieuLivraison} onChange={(e) => setLieuLivraison(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className={`add-button ${bonProductionAdded ? 'gray-button' : ''}`} onClick={handleAddBonProduction} disabled={bonProductionAdded}>Ajouter Bon de Production</button>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    <h2>Bons de Production</h2>
                    <table >
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Client</th>
                                <th>Formule</th>
                                <th>Volume</th>
                                <th>Date</th>
                                <th>Heure</th>
                                <th>Lieu de livraison</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bonProductions.map((bonProduction, index) => (
                                <tr key={index}>
                                    <td>{bonProduction.code_Bon}</td>
                                    <td>{bonProduction.client_name}</td>
                                    <td>{bonProduction.formules[0].formula_name}</td>
                                    <td>{bonProduction.quantite}</td>
                                    <td>{bonProduction.date}</td>
                                    <td>{bonProduction.heure}</td>
                                    <td>{bonProduction.lieu_livraison}</td>
                                    <td>
                                        <button className='delete-button' onClick={() => handleDelete(index)}>Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className='print-button' onClick={handleValidate}>Valider</button>
                </div>
            </div>
        </div>
    );
}

export default BonProductionForm;
