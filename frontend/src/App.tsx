import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import FormList from './pages/FormList';
import FormDetail from './pages/FormDetail';
import CreateForm from './pages/CreateForm';

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen bg-gray-900">
        <Navbar />
        <Routes>
          <Route path="/forms" element={<FormList />} />
          <Route path="/form/:id" element={<FormDetail />} />
          <Route path='/create-form' element={<CreateForm/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;