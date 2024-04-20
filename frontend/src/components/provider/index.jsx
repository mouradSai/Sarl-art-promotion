import React, { useState } from 'react'; // Importez useState de React
import ReactDOM from 'react-dom';
import CRUDTable, { Fields, Field, CreateForm, UpdateForm, DeleteForm } from 'react-crud-table';
import "./Appprovider.css"


import Header from 	"../Main/Header"
import Sidebar from "../Main/Sidebar";


// Fonction pour le rendu de la zone de texte
const DescriptionRenderer = ({ field }) => <textarea {...field} />;

// Tableau de données initial
let providers = [
  {
    id: 1,
    name: 'Provider 1',
    address: '123 Main St',
    description: 'Description 1',
    number: '555-1234',
    comment: 'Lorem ipsum dolor sit amet',
    isActive: true
  },
  {
    id: 2,
    name: 'Provider 2',
    address: '456 Elm St',
    description: 'Description 2',
    number: '555-5678',
    comment: 'Consectetur adipiscing elit',
    isActive: false
  },
];

// Fonction pour trier les données
const SORTERS = {
  NUMBER_ASCENDING: mapper => (a, b) => mapper(a) - mapper(b),
  NUMBER_DESCENDING: mapper => (a, b) => mapper(b) - mapper(a),
  STRING_ASCENDING: mapper => (a, b) => mapper(a).localeCompare(mapper(b)),
  STRING_DESCENDING: mapper => (a, b) => mapper(b).localeCompare(mapper(a)),
};

const getSorter = (data) => {
  const mapper = x => x[data.field];
  let sorter = SORTERS.STRING_ASCENDING(mapper);

  if (data.field === 'id') {
    sorter = data.direction === 'ascending' ?
      SORTERS.NUMBER_ASCENDING(mapper) : SORTERS.NUMBER_DESCENDING(mapper);
  } else {
    sorter = data.direction === 'ascending' ?
      SORTERS.STRING_ASCENDING(mapper) : SORTERS.STRING_DESCENDING(mapper);
  }

  return sorter;
};

// Compteur pour l'ID
let count = providers.length;

// Service CRUD
const service = {
  fetchItems: (payload) => {
    let result = Array.from(providers);
    result = result.sort(getSorter(payload.sort));
    return Promise.resolve(result);
  },
  create: (provider) => {
    count += 1;
    providers.push({
      ...provider,
      id: count,
    });
    return Promise.resolve(provider);
  },
  update: (data) => {
    const provider = providers.find(p => p.id === data.id);
    provider.name = data.name;
    provider.address = data.address;
    provider.description = data.description;
    provider.number = data.number;
    provider.comment = data.comment;
    provider.isActive = data.isActive;
    return Promise.resolve(provider);
  },
  delete: (data) => {
    const provider = providers.find(p => p.id === data.id);
    providers = providers.filter(p => p.id !== provider.id);
    return Promise.resolve(provider);
  },
};

const styles = {
  container: { margin: 'auto', width: 'fit-content' },
};






const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

const [selectedContent, setSelectedContent] = useState("home"); // État pour stocker le contenu sélectionné

const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
};

const handleSidebarItemClick = (content) => {
    setSelectedContent(content); // Mettre à jour le contenu sélectionné
};




const Provider = () => (
  <div style={styles.container}>

    <Header OpenSidebar={OpenSidebar}/>
    <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} handleItemClick={handleSidebarItemClick}/>

    <CRUDTable
      caption="Providers"
      fetchItems={payload => service.fetchItems(payload)}
    >
      <Fields>
        <Field
          name="id"
          label="Id"
          hideInCreateForm
          readOnly
        />
        <Field
          name="name"
          label="Name"
          placeholder="Name"
        />
        <Field
          name="address"
          label="Address"
          placeholder="Address"
        />
        <Field
          name="description"
          label="Description"
          placeholder="Description"
        />
        <Field
          name="number"
          label="Number"
          placeholder="Number"
        />
        <Field
          name="comment"
          label="Comment"
          render={DescriptionRenderer}
        />
        <Field
          name="isActive"
          label="Active"
          render={({ field, record }) => (
            <input type="checkbox" {...field} defaultChecked={record?.isActive || false} />
          )}
        />
        <Field
          name="status"
          label="Status"
          render={({ record }) => (
            <span>{record?.isActive ? 'Active' : 'Inactive'}</span>
          )}
        />
      </Fields>
      <CreateForm
        title="Provider Creation"
        message="Create a new provider!"
        trigger="Create Provider"
        onSubmit={provider => service.create(provider)}
        submitText="Create"
        validate={(values) => {
          const errors = {};
          if (!values.name) {
            errors.name = 'Please, provide provider\'s name';
          }
          // Validation pour les autres champs si nécessaire
          return errors;
        }}
      />

      <UpdateForm
        title="Provider Update Process"
        message="Update provider"
        trigger="Update"
        onSubmit={provider => service.update(provider)}
        submitText="Update"
        validate={(values) => {
          const errors = {};

          if (!values.id) {
            errors.id = 'Please, provide id';
          }

          if (!values.name) {
            errors.name = 'Please, provide provider\'s name';
          }

          // Validation pour les autres champs si nécessaire
          return errors;
        }}
      />

      <DeleteForm
        title="Provider Delete Process"
        message="Are you sure you want to delete the provider?"
        trigger="Delete"
        onSubmit={provider => service.delete(provider)}
        submitText="Delete"
        validate={(values) => {
          const errors = {};
          if (!values.id) {
            errors.id = 'Please, provide id';
          }
          return errors;
        }}
      />
    </CRUDTable>
  </div>
);

ReactDOM.render(
  <Provider />,
  document.getElementById('root')
);

export default Provider;
