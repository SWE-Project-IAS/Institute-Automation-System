import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import Students from './pages/Students';
import Faculty from './pages/Faculty';
import Admin from './pages/Admin';

function App() {
  return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Auth/>} />
            <Route path='/students' element={<Students/>} />
            <Route path='/faculty' element={<Faculty/>} />
            <Route path='/admin' element={<Admin/>} />
            <Route path="/auth" element={<Auth/>} />
            
          </Routes>
        </BrowserRouter>
      </>
  );
}

export default App;
