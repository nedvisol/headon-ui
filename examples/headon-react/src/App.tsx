import { RenderView } from '@headon/react';
import {
  BrowserRouter,
  Routes,
  Route,
  useParams
} from "react-router-dom";
import './App.css';

function PageFromCMs() {
  const params = useParams();
  const pageName = params.pageName;
  return (
    <RenderView name={pageName} />
  )
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RenderView name={'/home'} />}>            
          </Route>
          <Route path="/pages/:pageName" element={<PageFromCMs />}></Route>
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
