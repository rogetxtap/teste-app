'use client';

import Head from 'next/head';
import axios from 'axios';
import { useState } from 'react';

function Home() {
  const [formData, setFormData] = useState({
    squareMeters: '',
    numberOfRooms: '',
    hasYard: '',
    hasPool: '',
    floors: '',
    cityCode: '',
    cityPartRange: '',
    numPrevOwners: '',
    made: '',
    isNewBuilt: '',
    hasStormProtector: '',
    basement: '',
    attic: '',
    garage: '',
    hasStorageRoom: '',
    hasGuestRoom: '',
  });
  const [prediction, setPrediction] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePredict = async () => {
    if (Object.values(formData).every(value => value !== '')) {
      setIsLoading(true);
      try {
        const data = Object.fromEntries(
          Object.entries(formData).map(([key, value]) => [key, Number(value)])
        );

        const response = await axios.post('http://localhost:5000/predict', data);
        if (response.data.predicted_price !== undefined) {
          setPrediction(`Preço Previsto: €${response.data.predicted_price.toFixed(2)}`);
        } else {
          setPrediction('Ocorreu um erro ao fazer a previsão. Por favor, tente novamente mais tarde.');
        }
      } catch (error) {
        console.error("Erro ao fazer a previsão:", error);
        setPrediction('Ocorreu um erro ao fazer a previsão. Por favor, tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setPrediction('Por favor, preencha todos os campos para obter uma previsão!');
    }
  };

  return (
    <div>
      <Head>
        <title>Previsão de Preços de Imóveis em Paris</title>
      </Head>
      <h1 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '20px' }}>Previsão de Preços de Imóveis em Paris</h1>
      <div style={{ width: '80%', margin: '0 auto', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        {Object.keys(formData).map((key) => (
          <input
            key={key}
            type="number"
            name={key}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
            value={formData[key as keyof typeof formData]}
            onChange={handleInputChange}
            style={{ margin: '10px', padding: '10px', width: 'calc(50% - 20px)', color: '#000000' }}
          />
        ))}
        <button 
          onClick={handlePredict} 
          style={{ 
            margin: '20px 10px', 
            padding: '13px', 
            backgroundColor: 'rgb(0, 0, 238)', 
            border: 'none', 
            color: 'white', 
            cursor: 'pointer',
            width: 'calc(100% - 20px)'
          }}
        >
          Estimar Preço
        </button>
        {isLoading && <div style={{ textAlign: 'center', fontSize: '20px', marginTop: '20px' }}>Carregando...</div>}
        <div style={{ textAlign: 'center', fontSize: '20px', marginTop: '20px' }}>{prediction}</div>
      </div>
    </div>
  );
}

export default Home;