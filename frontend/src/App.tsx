import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import FormList from './pages/FormList';
import FormDetail from './pages/FormDetail';
import CreateForm from './pages/CreateForm';
import FormFills from './pages/FormFills';

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen bg-gray-900">
        <Navbar />
        <Routes>
        <Route path="/" element={<FormList />} />
          <Route path="/forms" element={<FormList />} />
          <Route path="/form/:id" element={<FormDetail />} />
          <Route path='/create-form' element={<CreateForm/>}/>
          <Route path="/form-fills/:id" element={<FormFills />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;