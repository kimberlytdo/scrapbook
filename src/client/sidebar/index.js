import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Navbar from './components/Navbar';
console.log("123");

const container = document.getElementById('index');
const root = createRoot(container);
root.render(
    <div>
        <Navbar/>
    </div>
);
