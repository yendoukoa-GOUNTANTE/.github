import { useEffect, useState } from 'react';
import { getHealthExpenditureData } from './data-access';
import { createModel, trainModel, predict } from './insights';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

function App() {
  const [data, setData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getHealthExpenditureData();
      setData(data);
      setSelectedCountry(data[0]);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const model = createModel();
      setModel(model);
      trainModel(model, selectedCountry.healthExpenditure).then(() => {
        const predictions = [];
        for (let i = 1; i <= 5; i++) {
          const year = new Date().getFullYear() + i;
          const prediction = predict(model, year);
          predictions.push({ year, value: prediction });
        }
        setPredictions(predictions);
      });
    }
  }, [selectedCountry]);

  const handleCountryChange = (event) => {
    const country = data.find(
      (country) => country.code === event.target.value
    );
    setSelectedCountry(country);
  };

  return (
    <div className="App">
      <h1>Global Health Tracker</h1>
      {selectedCountry && (
        <div>
          <h2>{selectedCountry.name}</h2>
          <select
            value={selectedCountry.code}
            onChange={handleCountryChange}
          >
            {data.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
          <LineChart
            width={800}
            height={400}
            data={selectedCountry.healthExpenditure.concat(predictions)}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </div>
      )}
    </div>
  );
}

export default App;
