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

    setQuestion(''); // Clear the question field
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Checks if at least one field has been added
    if (fields.length === 0) {
      alert('Please add at least one field to the form.');
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
      alert('Form created successfully!');
      history('/forms'); // Redirects to the list of forms
    } catch (error) {
      console.error('Error creating form:', error);
      alert('An error occurred while creating the form. Please try again.');
    }
  };

  return (
    <div className="pt-16 w-full max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-medium text-white mb-6">Create New Form</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="mb-4">
          <label className="font-medium text-white block mb-1">Form Name</label>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="w-full p-2 rounded border border-gray-300"
            placeholder="form name"
            required
          />
        </div>

        {/* Adicionar Campos ao Formulário */}
        <div className="mb-4">
          <label className="font-medium text-white block mb-1">Add Field</label>
          <div className="flex gap-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-1/2 p-2 rounded border border-gray-300"
              placeholder="question"
            />
            <select
              value={fieldType}
              onChange={(e) => setFieldType(e.target.value)}
              className="p-2 rounded border border-gray-300"
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="datetime">Date and Time</option>
              <option value="password">Password</option>
              <option value="tel">Phone Number</option>
              <option value="date">Date</option>
              <option value="time">Time</option>
              <option value="datetime-local">Date & Time</option>
              <option value="url">URL</option>
              <option value="color">Color Picker</option>
            </select>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={isRequired}
                onChange={() => setIsRequired(!isRequired)}
                className="mr-2"
              />
              <span className="text-white">Required</span>
            </div>
            <button
              type="button"
              onClick={handleAddField}
              className="w-1/4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
            >
              Add
            </button>
          </div>
        </div>

        {/* Show added fields */}
        {fields.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl text-white mb-2">Added Fields</h2>
            <ul className="text-white">
              {fields.map((field, index) => (
                <li key={index}>
                  <strong>{field.question}</strong> ({field.type})
                  {field.required && <span className="text-red-500"> *Required</span>}
                </li>
              ))}
            </ul>
          </div>
        )}


        <button
          type="submit"
          disabled={fields.length === 0} // Disables the button if there are no fields
          className={`w-full py-2 px-4 rounded transition duration-200 ${fields.length === 0 ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'} text-white`}
        >
          Create Form
        </button>
      </form>
    </div>
  );
}

export default CreateForm;
