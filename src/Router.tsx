import { Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Activities } from './pages/Activities';
import { SignUp } from './pages/SignUp';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/activities" element={<Activities />} />
    </Routes>
  );
}
