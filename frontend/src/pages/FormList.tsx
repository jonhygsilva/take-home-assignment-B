import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

type Form = {
  id: string;
  name: string;
};

function FormList() {
  const [forms, setForms] = useState<Form[]>([]);

  useEffect(() => {
    async function loadForms() {
      try {
        const response = await api.get("/form");
        setForms(response.data.data);
      } catch (error) {
        console.error('Error fetching forms:', error);
      }
    }
    loadForms();
  }, []);

  return (
    <div className="pt-16 my-10 w-full max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-medium text-white mb-6">Forms</h1>

      {/* Form list */}
      <section className="flex flex-col gap-4 mb-6">
        {forms.map((form) => (
          <Link key={form.id} to={`/form/${form.id}`} className="w-full bg-white p-4 rounded shadow hover:scale-105 duration-200">
            <h2 className="font-medium text-gray-700">{form.name}</h2>
          </Link>
        ))}
      </section>

      {/* create a new form */}
      <div className="flex justify-center">
        <Link
          to="/create-form"
          className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition duration-200"
        >
          Create new form
        </Link>
      </div>
    </div>
  );
}

export default FormList;
