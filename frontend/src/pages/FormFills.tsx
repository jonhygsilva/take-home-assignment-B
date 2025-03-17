import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../services/api';

type Fill = {
  id: string;
  question: string;
  answer: string;
  sourceRecordId: string;
};

type GroupedFill = {
  sourceRecordId: string;
  questions: {
    question: string;
    answer: string;
  }[];
};

function FormFills() {
  const { id } = useParams(); // form id
  const [fills, setFills] = useState<GroupedFill[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadFormFills() {
      try {
        const response = await api.get(`/form/${id}/submissions`);
        const data = response.data.data;

        // group fillers by `sourceRecordId`
        const groupedData = data.reduce((acc: GroupedFill[], fill: Fill) => {
          const existingGroup = acc.find((group) => group.sourceRecordId === fill.sourceRecordId);

          if (existingGroup) {
            existingGroup.questions.push({ question: fill.question, answer: fill.answer });
          } else {
            acc.push({
              sourceRecordId: fill.sourceRecordId,
              questions: [{ question: fill.question, answer: fill.answer }],
            });
          }

          return acc;
        }, []);

        setFills(groupedData);
      } catch (error) {
        console.error('Error fetching form fills:', error);
      }
    }

    if (id) {
      loadFormFills();
    }
  }, [id]);

  if (fills.length === 0) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-900">
        <div className="text-white text-xl mb-6">No fills found.</div>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="pt-16 my-10 w-full max-w-4xl mx-auto px-4 mt-6 min-h-screen">
      <h1 className="text-4xl font-medium text-white mb-6">Completed Forms</h1>
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
      >
        Back
      </button>
      <section className="flex flex-col gap-4">
        {fills.map((fill) => (
          <div key={fill.sourceRecordId} className="w-full bg-white p-4 rounded shadow">
            <h2 className="font-medium text-gray-700">ID: {fill.sourceRecordId}</h2>
            <ul className="mt-2">
              {fill.questions.map((q, questionIndex) => (
                <li key={questionIndex} className="text-gray-700">
                  <strong>{q.question}:</strong> {q.answer}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}

export default FormFills;
