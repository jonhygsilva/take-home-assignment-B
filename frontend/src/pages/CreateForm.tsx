import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

type Field = {
  question: string;
  type: string;
  required: boolean;
};

function CreateForm() {
  const [formName, setFormName] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  const [question, setQuestion] = useState('');
  const [fieldType, setFieldType] = useState('text');
  const [isRequired, setIsRequired] = useState(false);
  const history = useNavigate();

  const handleAddField = () => {
    if (question.trim() === '') return;

    setFields((prevFields) => [
      ...prevFields,
      { question, type: fieldType, required: isRequired },
    ]);

    setQuestion(''); // Limpa o campo de pergunta
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verifica se ao menos um campo foi adicionado
    if (fields.length === 0) {
      alert('Por favor, adicione ao menos um campo ao formulário.');
      return;
    }

    const newForm = {
      name: formName,
      fields: fields.reduce((acc, field, index) => {
        acc[`field-${index + 1}`] = field;
        return acc;
      }, {}),
    };

    try {
      await api.post('/form', newForm);
      alert('Formulário criado com sucesso!');
      history('/forms'); // Redireciona para a lista de formulários
    } catch (error) {
      console.error('Erro ao criar o formulário:', error);
      alert('Ocorreu um erro ao criar o formulário. Tente novamente.');
    }
  };

  return (
    <div className="pt-16 w-full max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-medium text-white mb-6">Criar Novo Formulário</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Nome do Formulário */}
        <div className="mb-4">
          <label className="font-medium text-white block mb-1">Nome do Formulário</label>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="w-full p-2 rounded border border-gray-300"
            placeholder="Digite o nome do formulário"
            required
          />
        </div>

        {/* Adicionar Campos ao Formulário */}
        <div className="mb-4">
          <label className="font-medium text-white block mb-1">Adicionar Campo</label>
          <div className="flex gap-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-1/2 p-2 rounded border border-gray-300"
              placeholder="Pergunta"
            />
            <select
              value={fieldType}
              onChange={(e) => setFieldType(e.target.value)}
              className="p-2 rounded border border-gray-300"
            >
              <option value="text">Texto</option>
              <option value="email">Email</option>
              <option value="datetime">Data e Hora</option>
            </select>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={isRequired}
                onChange={() => setIsRequired(!isRequired)}
                className="mr-2"
              />
              <span className="text-white">Requerido</span>
            </div>
            <button
              type="button"
              onClick={handleAddField}
              className="w-1/4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* Exibir campos adicionados */}
        {fields.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl text-white mb-2">Campos Adicionados</h2>
            <ul className="text-white">
              {fields.map((field, index) => (
                <li key={index}>
                  <strong>{field.question}</strong> ({field.type})
                  {field.required && <span className="text-red-500"> *Requerido</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Botão de Submissão */}
        <button
          type="submit"
          disabled={fields.length === 0} // Desabilita o botão se não houver campos
          className={`w-full py-2 px-4 rounded transition duration-200 ${fields.length === 0 ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'} text-white`}
        >
          Criar Formulário
        </button>
      </form>
    </div>
  );
}

export default CreateForm;
