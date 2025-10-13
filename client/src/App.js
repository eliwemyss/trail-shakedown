import { useState } from 'react';
import axios from 'axios';
import './App.css';
import WeightSummaryCards from './components/WeightSummaryCards';
import SwapCard from './components/SwapCard';
import OptimizeCard from './components/OptimizeCard';
import LookingGoodCard from './components/LookingGoodCard';

function App() {
  const [mode, setMode] = useState(null); // 'own-gear' or 'build-gear'
  const [currentStep, setCurrentStep] = useState(0);
  const [gearList, setGearList] = useState([]);
  const [tripDetails, setTripDetails] = useState({
    tripName: '',
    duration: '',
    season: 'summer',
    terrain: 'moderate'
  });
  const [gearProfile, setGearProfile] = useState({
    tripType: 'weekend',
    season: 'summer',
    terrain: 'moderate',
    experience: 'intermediate',
    budget: 'mid-range'
  });
  const [summary, setSummary] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lighterpackUrl, setLighterpackUrl] = useState('');

  // New item being added
  const [newItem, setNewItem] = useState({
    name: '',
    brand: '',
    category: 'Shelter',
    weight_oz: '',
    price: '',
    qty: 1
  });

  const categories = [
    'Shelter',
    'Sleep System',
    'Backpack',
    'Clothing',
    'Cooking',
    'Water',
    'Electronics',
    'First Aid',
    'Misc'
  ];

  const estimatePrice = async () => {
    if (!newItem.name || !newItem.weight_oz) {
      setError('Please enter name and weight first');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/price-estimate', {
        name: newItem.name,
        category: newItem.category,
        weight_oz: parseFloat(newItem.weight_oz)
      });

      if (response.data.success) {
        setNewItem({...newItem, price: response.data.data.estimatedPrice});
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to estimate price');
    } finally {
      setLoading(false);
    }
  };

  const buildGearRecommendations = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/recommendations', gearProfile);

      if (response.data.success) {
        setGearList(response.data.data.gearList);
        setMode('own-gear');
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate gear recommendations');
    } finally {
      setLoading(false);
    }
  };

  const importFromLighterpack = async () => {
    if (!lighterpackUrl) {
      setError('Please enter a Lighterpack URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/lighterpack/import', {
        url: lighterpackUrl
      });

      if (response.data.success) {
        setGearList(response.data.data.gearList);
        setLighterpackUrl('');
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to import from Lighterpack');
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    if (!newItem.name || !newItem.weight_oz) {
      setError('Name and weight are required');
      return;
    }

    const item = {
      name: newItem.name,
      brand: newItem.brand || '',
      category: newItem.category,
      weight_oz: parseFloat(newItem.weight_oz) * parseInt(newItem.qty),
      price: newItem.price ? parseFloat(newItem.price) : 0
    };

    setGearList(prev => [...prev, item]);
    setNewItem({
      name: '',
      brand: '',
      category: 'Shelter',
      weight_oz: '',
      price: '',
      qty: 1
    });
    setError('');
  };

  const removeItem = (index) => {
    setGearList(prev => prev.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const totalWeightOz = gearList.reduce((sum, item) => sum + item.weight_oz, 0);
    return {
      totalItems: gearList.length,
      totalWeightOz: Math.round(totalWeightOz),
      totalWeightLbs: (totalWeightOz / 16).toFixed(1)
    };
  };

  const handleNextStep = async () => {
    if (currentStep === 0 && gearList.length === 0) {
      setError('Please add at least one item');
      return;
    }

    if (currentStep === 1) {
      // Submit to backend and get results
      setLoading(true);
      try {
        const response = await axios.post('/api/shakedown', {
          gearList,
          tripDetails
        });
        console.log('Shakedown API response:', response);
        if (response.data.success) {
          setSummary(response.data.data.summary);
          setRecommendations(response.data.data.recommendations);
          setCurrentStep(2);
        } else {
          console.error('Shakedown API error:', response.data);
          setError(response.data.message || 'Failed to submit shakedown');
        }
      } catch (err) {
        console.error('Shakedown API exception:', err);
        setError(err.response?.data?.message || err.message || 'Failed to submit shakedown');
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const totals = calculateTotals();

  return (
    <div className="App">
      <header className="App-header">
        <h1>⛰️ Trail Shakedown</h1>
        <p>AI-Powered Ultralight Gear Optimization</p>
      </header>

      <main className="wizard-container">
        {/* Mode Selection */}
        {!mode && (
          <div className="mode-selection">
            <h2>How would you like to get started?</h2>
            <div className="mode-cards">
              <div className="mode-card" onClick={() => setMode('own-gear')}>
                <div className="mode-icon">📦</div>
                <h3>I Have My Gear</h3>
                <p>Import from Lighterpack or manually add your existing gear list</p>
              </div>
              <div className="mode-card" onClick={() => setMode('build-gear')}>
                <div className="mode-icon">🎒</div>
                <h3>Help Me Build a Gear List</h3>
                <p>Answer a few questions and get personalized gear recommendations</p>
              </div>
            </div>
          </div>
        )}

        {/* Build Gear Flow */}
        {mode === 'build-gear' && gearList.length === 0 && (
          <div className="build-gear-section">
            <button onClick={() => setMode(null)} className="btn-back">← Back</button>
            <h2>Tell Us About Your Trip</h2>

            <div className="form-group">
              <label>Trip Length</label>
              <select
                value={gearProfile.tripType}
                onChange={(e) => setGearProfile({...gearProfile, tripType: e.target.value})}
              >
                <option value="weekend">Weekend (1-3 days)</option>
                <option value="1-week">1 Week (4-7 days)</option>
                <option value="2+weeks">2+ Weeks</option>
              </select>
            </div>

            <div className="form-group">
              <label>Season</label>
              <select
                value={gearProfile.season}
                onChange={(e) => setGearProfile({...gearProfile, season: e.target.value})}
              >
                <option value="spring">Spring</option>
                <option value="summer">Summer</option>
                <option value="fall">Fall</option>
                <option value="winter">Winter</option>
              </select>
            </div>

            <div className="form-group">
              <label>Terrain</label>
              <select
                value={gearProfile.terrain}
                onChange={(e) => setGearProfile({...gearProfile, terrain: e.target.value})}
              >
                <option value="easy">Easy (trails, low elevation)</option>
                <option value="moderate">Moderate (some climbing)</option>
                <option value="difficult">Difficult (high altitude, technical)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Experience Level</label>
              <select
                value={gearProfile.experience}
                onChange={(e) => setGearProfile({...gearProfile, experience: e.target.value})}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div className="form-group">
              <label>Budget</label>
              <select
                value={gearProfile.budget}
                onChange={(e) => setGearProfile({...gearProfile, budget: e.target.value})}
              >
                <option value="budget">Budget (Under $1000)</option>
                <option value="mid-range">Mid-Range ($1000-$2500)</option>
                <option value="premium">Premium ($2500+)</option>
              </select>
            </div>

            {error && <div className="error">{error}</div>}

            <button
              onClick={buildGearRecommendations}
              className="btn-next"
              disabled={loading}
            >
              {loading ? 'Building Your Gear List...' : 'Generate Gear Recommendations →'}
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        {mode === 'own-gear' && (
        <>
          <div className="tabs">
            <button
              className={`tab ${currentStep === 0 ? 'active' : ''}`}
              onClick={() => setCurrentStep(0)}
            >
              📝 Your Gear
            </button>
            <button
              className={`tab ${currentStep === 1 ? 'active' : ''}`}
              onClick={() => gearList.length > 0 && setCurrentStep(1)}
              disabled={gearList.length === 0}
            >
              ⛰️ Trip Details
            </button>
            <button
              className={`tab ${currentStep === 2 ? 'active' : ''}`}
              disabled={!summary}
            >
              ✨ Shakedown Results
            </button>
          </div>

          {/* Step Content */}
          <div className="step-content">
          {currentStep === 0 && (
            <div className="gear-step">
              <h2>Add Your Gear</h2>

              {/* Lighterpack Import */}
              <div className="import-section">
                <input
                  type="url"
                  placeholder="Import from Lighterpack (paste URL)"
                  value={lighterpackUrl}
                  onChange={(e) => setLighterpackUrl(e.target.value)}
                  className="lighterpack-input"
                />
                <button
                  onClick={importFromLighterpack}
                  disabled={loading}
                  className="btn-import"
                >
                  {loading ? 'Importing...' : 'Import'}
                </button>
              </div>

              {/* Manual Add */}
              <div className="add-item-form">
                <div className="add-item-grid">
                  <input
                    type="text"
                    placeholder="Item name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  />
                    <input
                      type="text"
                      placeholder="Brand / Model (optional)"
                      value={newItem.brand}
                      onChange={(e) => setNewItem({...newItem, brand: e.target.value})}
                    />
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Weight (oz)"
                    value={newItem.weight_oz}
                    onChange={(e) => setNewItem({...newItem, weight_oz: e.target.value})}
                    step="0.1"
                  />
                  <input
                    type="number"
                    placeholder="Price ($)"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                    step="1"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={newItem.qty}
                    onChange={(e) => setNewItem({...newItem, qty: e.target.value})}
                    min="1"
                  />
                  <button onClick={addItem} className="btn-add-single">+</button>
                </div>
                <button
                  onClick={estimatePrice}
                  disabled={!newItem.name || !newItem.weight_oz || loading}
                  className="btn-estimate-price"
                >
                  {loading ? 'Estimating...' : '💡 Estimate Price'}
                </button>
              </div>

              {/* Gear List */}
              {gearList.map((item, index) => (
                <div key={index} className="gear-item-row">
                  <span className="item-name">{item.name}</span>
                  <span className="item-brand">{item.brand || '-'}</span>
                  <span className="item-category">{item.category}</span>
                  <span className="item-weight">{item.weight_oz} oz</span>
                  <span className="item-qty">1</span>
                  <button
                    onClick={() => removeItem(index)}
                    className="btn-remove"
                  >
                    ×
                  </button>
                </div>
              ))}

              {gearList.length > 0 && (
                <button onClick={addItem} className="btn-add-item">
                  + Add Item
                </button>
              )}

              {/* Totals */}
              <div className="totals-grid">
                <div className="total-card">
                  <div className="total-value">{totals.totalWeightOz}</div>
                  <div className="total-label">Base Weight (oz)</div>
                </div>
                <div className="total-card">
                  <div className="total-value">{totals.totalWeightLbs}</div>
                  <div className="total-label">Base Weight (lbs)</div>
                </div>
                <div className="total-card">
                  <div className="total-value">{totals.totalItems}</div>
                  <div className="total-label">Total Items</div>
                </div>
              </div>

              {error && <div className="error">{error}</div>}

              <button
                onClick={handleNextStep}
                className="btn-next"
                disabled={gearList.length === 0}
              >
                Next: Trip Details →
              </button>
            </div>
          )}

          {currentStep === 1 && (
            <div className="trip-step">
              <h2>Trip Details</h2>

              <div className="form-group">
                <label>Trip Name</label>
                <input
                  type="text"
                  value={tripDetails.tripName}
                  onChange={(e) => setTripDetails({...tripDetails, tripName: e.target.value})}
                  placeholder="e.g., John Muir Trail"
                />
              </div>

              <div className="form-group">
                <label>Duration (days)</label>
                <input
                  type="number"
                  value={tripDetails.duration}
                  onChange={(e) => setTripDetails({...tripDetails, duration: e.target.value})}
                  placeholder="e.g., 7"
                />
              </div>

              <div className="form-group">
                <label>Season</label>
                <select
                  value={tripDetails.season}
                  onChange={(e) => setTripDetails({...tripDetails, season: e.target.value})}
                >
                  <option value="spring">Spring</option>
                  <option value="summer">Summer</option>
                  <option value="fall">Fall</option>
                  <option value="winter">Winter</option>
                </select>
              </div>

              <div className="form-group">
                <label>Terrain</label>
                <select
                  value={tripDetails.terrain}
                  onChange={(e) => setTripDetails({...tripDetails, terrain: e.target.value})}
                >
                  <option value="easy">Easy (trails, low elevation)</option>
                  <option value="moderate">Moderate (some climbing)</option>
                  <option value="difficult">Difficult (high altitude, technical)</option>
                </select>
              </div>

              {error && <div className="error">{error}</div>}

              <div className="button-row">
                <button onClick={() => setCurrentStep(0)} className="btn-back">
                  ← Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="btn-next"
                  disabled={loading}
                >
                  {loading ? 'Analyzing...' : 'Get Shakedown Results →'}
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && summary && (
            <div className="results-step">
              <h2>Shakedown Results</h2>

              {/* Weight Summary Cards */}
              <WeightSummaryCards data={recommendations || {}} />

              {/* High Priority Recommendations */}
              <div className="priority-section">
                <h3 className="priority-title">🎯 High Priority Recommendations</h3>
                {recommendations?.highPriority?.length > 0 ? (
                  recommendations.highPriority.map((rec, index) => (
                    <SwapCard key={index} rec={rec} />
                  ))
                ) : (
                  <div className="recommendation-message">No high priority recommendations found for your gear.</div>
                )}
              </div>

              {/* Medium Priority */}
              <div className="priority-section">
                <h3 className="priority-title">⚠️ Medium Priority</h3>
                {recommendations?.mediumPriority?.length > 0 ? (
                  recommendations.mediumPriority.map((rec, index) => (
                    <OptimizeCard key={index} rec={rec} />
                  ))
                ) : (
                  <div className="recommendation-message">No medium priority optimizations found for your gear.</div>
                )}
              </div>

              {/* Looking Good */}
              <div className="priority-section">
                <h3 className="priority-title">✅ Looking Good</h3>
                {recommendations?.lookingGood?.length > 0 ? (
                  recommendations.lookingGood.map((rec, index) => (
                    <LookingGoodCard key={index} message={rec.message} />
                  ))
                ) : (
                  <div className="recommendation-message">No positive notes for your gear yet.</div>
                )}
              </div>

              {/* Fallback: render generic recommendation items if provided by backend */}
              {Array.isArray(recommendations?.items) && recommendations.items.length > 0 && (
                <div className="priority-section">
                  <h3 className="priority-title">🔎 Additional Recommendations</h3>
                  <div className="recommendations-list">
                    {recommendations.items.map((item, idx) => (
                      <div key={idx} className={`recommendation-card ${item.type === 'tip' ? 'tip' : item.type === 'info' ? 'info' : 'suggestion'}`}>
                        <div className="recommendation-title">{item.title}</div>
                        <div className="recommendation-message">{item.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}


              <button onClick={() => {
                setMode(null);
                setCurrentStep(0);
                setGearList([]);
                setSummary(null);
                setRecommendations(null);
              }} className="btn-new-shakedown">
                Start New Shakedown
              </button>
            </div>
          )}
          </div>
        </>
        )}
      </main>
    </div>
  );
}

export default App;
