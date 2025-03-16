import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';

type Form = {
  name: string;
  fields: Field[];
};

type Field = {
  id: string;
  question: string;
  required: boolean;
  type: string;
};

function FormDetail() {
  const { id } = useParams();
  const [form, setForm] = useState<Form | null>(null);

  useEffect(() => {
    async function loadFormDetail() {
      try {
        const response = await api.get(`/form/${id}`);
        const rawForm = response.data.data;

        // Converter o objeto fields para um array
        const fieldsArray = Object.entries(rawForm.fields).map(([key, value]) => ({
          id: key,
          ...value,
        }));

        // Atualizar o estado do form com o array de campos
        setForm({ ...rawForm, fields: fieldsArray });
      } catch (error) {
        console.error('Error fetching form details:', error);
      }
    }

    if (id) {
      loadFormDetail();
    }
  }, [id]);

  if (!form) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="pt-16 my-10 w-full max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-medium text-white mb-6">{form.name}</h1>
      <form className="flex flex-col gap-4">
        {form.fields.map((field) => (
          <div key={field.id} className="mb-4">
            <label className="font-medium text-white block mb-1">{field.question}</label>
            <input
              type={field.type}
              className="w-full p-2 rounded border border-gray-300"
              required={field.required}
              placeholder={`Enter ${field.question.toLowerCase()}`}
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default FormDetail;