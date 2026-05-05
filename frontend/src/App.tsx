import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainScreen } from './features/search/MainScreen';
import { ItemEditScreen } from './features/item/ItemEditScreen';
import { ManagementScreen } from './features/management/ManagementScreen';
import { SettingsScreen } from './features/settings/SettingsScreen';
import { ItemLocationScreen } from './features/item/ItemLocationScreen';
import { RoomManagementScreen } from './features/room/RoomManagementScreen';
import { RoomEditScreen } from './features/room/RoomEditScreen';
import { RoomLayoutScreen } from './features/room/RoomLayoutScreen';
import { StorageLayoutScreen } from './features/storage/StorageLayoutScreen';
import { PersonLabelManagementScreen } from './features/label/PersonLabelManagementScreen';
import { CategoryManagementScreen } from './features/category/CategoryManagementScreen';
import { OnboardingProvider } from './contexts/OnboardingContext';
import { AppDataProvider } from './contexts/AppDataContext';
import './App.css';

function App() {
  return (
    <OnboardingProvider>
      <AppDataProvider>
        <BrowserRouter>
          <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/add" element={<ItemEditScreen />} />
        <Route path="/management" element={<ManagementScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/location/:itemId" element={<ItemLocationScreen />} />
        <Route path="/management/rooms" element={<RoomManagementScreen />} />
        <Route path="/management/rooms/edit/:roomId?" element={<RoomEditScreen />} />
        <Route path="/management/rooms/layout/:roomId" element={<RoomLayoutScreen />} />
        <Route path="/management/storage/layout" element={<StorageLayoutScreen />} />
        <Route path="/management/labels" element={<PersonLabelManagementScreen />} />
        <Route path="/management/categories" element={<CategoryManagementScreen />} />
          </Routes>
        </BrowserRouter>
      </AppDataProvider>
    </OnboardingProvider>
  );
}

export default App;
