import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  const { id } = useParams(); // get the form Id from url
  const [form, setForm] = useState<Form | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // load form detail component
  useEffect(() => {
    async function loadFormDetail() {
      try {
        const response = await api.get(`/form/${id}`);
        const rawForm = response.data.data;

        // transform the objects fields into an array of objects with de details of each field
        const fieldsArray = Object.entries(rawForm.fields).map(([key, value]) => ({
          id: key,
          ...value,
        }));

        console.log(fieldsArray)

        // update the form state
        setForm({ ...rawForm, fields: fieldsArray });
      } catch (error) {
        console.error('Error fetching form details:', error);
      }
    }

    if (id) {
      loadFormDetail(); // load the form informations
    }
  }, [id]);

  // Function to prepare and submit the form data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.keys(answers).length === 0) {
      alert('Please, fill in allrequired fields');
      return;
    }

    try {
      const response = await api.post('/form/submission', {
        formId: id,
        answers,
      });

      if (response.status === 201) {
        alert('Form sent successfully!');
        // Clear form and responses after submission
        setAnswers({});
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form. Please try again.');
    }
  };

  // Function to capture form responses
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldId: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [fieldId]: e.target.value,
    }));
  };

  // If the form is still loading
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
      
      {/* Form to capture responses */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {form.fields.map((field) => (
          <div key={field.id} className="mb-4">
            <label className="font-medium text-white block mb-1">{field.question}</label>
            <input
              type={field.type}
              className="w-full p-2 rounded border border-gray-300"
              required={field.required}
              placeholder={`Enter ${field.question.toLowerCase()}`}
              value={answers[field.question] || ''} // Binds the value with the responses stored in the state
              onChange={(e) => handleInputChange(e, field.question)} // Capture the responses
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

      {/* Link to the filling page */}
      <div className="mt-6">
        <Link
          to={`/form-fills/${id}`}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
        >
          Completed Forms
        </Link>
      </div>
    </div>
  );
}

export default FormDetail;
