import React from 'react';

const SpecsForm = ({ spesifikasi = {}, setSpesifikasi }) => {
  // Helper function untuk get value dengan safe access
  const getValue = (path) => {
    const keys = path.split('.');
    let value = spesifikasi;
    for (const key of keys) {
      if (value && typeof value === 'object') {
        value = value[key];
      } else {
        return '';
      }
    }
    return value || '';
  };

  const handleSpecChange = (category, key, value) => {
    if (!setSpesifikasi) {
      console.error('setSpesifikasi tidak tersedia');
      return;
    }
    
    setSpesifikasi(prev => {
      const prevSpecs = prev || {};
      const newSpecs = {
        ...prevSpecs,
        [category]: {
          ...(prevSpecs[category] || {}),
          [key]: value
        }
      };
      console.log('Updating spesifikasi:', category, key, value, newSpecs);
      return newSpecs;
    });
  };

  const handleTransmissionChange = (type, key, value) => {
    if (!setSpesifikasi) return;
    
    setSpesifikasi(prev => {
      const prevSpecs = prev || {};
      return {
        ...prevSpecs,
        transmission: {
          ...(prevSpecs.transmission || {}),
          [type]: {
            ...(prevSpecs.transmission?.[type] || {}),
            [key]: value
          }
        }
      };
    });
  };

  const handleWheelsChange = (type, key, value) => {
    if (!setSpesifikasi) return;
    
    setSpesifikasi(prev => {
      const prevSpecs = prev || {};
      return {
        ...prevSpecs,
        wheels: {
          ...(prevSpecs.wheels || {}),
          [type]: {
            ...(prevSpecs.wheels?.[type] || {}),
            [key]: value
          }
        }
      };
    });
  };

  return (
    <div className="specs-form-container">
      <h3 className="specs-form-title">Spesifikasi Teknis</h3>
      
      {/* PERFORMANCE */}
      <div className="specs-category">
        <h4>PERFORMANCE</h4>
        <div className="specs-grid">
          <div className="input-group">
            <label>Engine Displacement (cc)</label>
            <input
              type="text"
              value={getValue('performance.engineDisplacement')}
              onChange={(e) => handleSpecChange('performance', 'engineDisplacement', e.target.value)}
              placeholder="1496"
            />
          </div>
          <div className="input-group">
            <label>Power (hp)</label>
            <input
              type="text"
              value={getValue('performance.power')}
              onChange={(e) => handleSpecChange('performance', 'power', e.target.value)}
              placeholder="103"
            />
          </div>
          <div className="input-group">
            <label>Fuel Type</label>
            <input
              type="text"
              value={getValue('performance.fuelType')}
              onChange={(e) => handleSpecChange('performance', 'fuelType', e.target.value)}
              placeholder="Petrol"
            />
          </div>
          <div className="input-group">
            <label>Torque (Nm)</label>
            <input
              type="text"
              value={getValue('performance.torque')}
              onChange={(e) => handleSpecChange('performance', 'torque', e.target.value)}
              placeholder="136"
            />
          </div>
        </div>
      </div>

      {/* CAPACITY */}
      <div className="specs-category">
        <h4>CAPACITY</h4>
        <div className="specs-grid">
          <div className="input-group">
            <label>Seating Capacity</label>
            <input
              type="text"
              value={getValue('capacity.seatingCapacity')}
              onChange={(e) => handleSpecChange('capacity', 'seatingCapacity', e.target.value)}
              placeholder="7 Seats"
            />
          </div>
          <div className="input-group">
            <label>Length (mm)</label>
            <input
              type="text"
              value={getValue('capacity.length')}
              onChange={(e) => handleSpecChange('capacity', 'length', e.target.value)}
              placeholder="4435"
            />
          </div>
          <div className="input-group">
            <label>Width (mm)</label>
            <input
              type="text"
              value={getValue('capacity.width')}
              onChange={(e) => handleSpecChange('capacity', 'width', e.target.value)}
              placeholder="1695"
            />
          </div>
          <div className="input-group">
            <label>Height (mm)</label>
            <input
              type="text"
              value={getValue('capacity.height')}
              onChange={(e) => handleSpecChange('capacity', 'height', e.target.value)}
              placeholder="1705"
            />
          </div>
          <div className="input-group">
            <label>Wheel Base (mm)</label>
            <input
              type="text"
              value={getValue('capacity.wheelBase')}
              onChange={(e) => handleSpecChange('capacity', 'wheelBase', e.target.value)}
              placeholder="2685"
            />
          </div>
          <div className="input-group">
            <label>Front Tread (mm)</label>
            <input
              type="text"
              value={getValue('capacity.frontTread')}
              onChange={(e) => handleSpecChange('capacity', 'frontTread', e.target.value)}
              placeholder="1450"
            />
          </div>
          <div className="input-group">
            <label>Rear Tread (mm)</label>
            <input
              type="text"
              value={getValue('capacity.rearTread')}
              onChange={(e) => handleSpecChange('capacity', 'rearTread', e.target.value)}
              placeholder="1450"
            />
          </div>
        </div>
      </div>

      {/* SUSPENSION & BRAKES */}
      <div className="specs-category">
        <h4>SUSPENSION & BRAKES</h4>
        <div className="specs-grid">
          <div className="input-group">
            <label>Front Suspension</label>
            <input
              type="text"
              value={getValue('suspension.frontSuspension')}
              onChange={(e) => handleSpecChange('suspension', 'frontSuspension', e.target.value)}
              placeholder="MacPherson Strut"
            />
          </div>
          <div className="input-group">
            <label>Rear Suspension</label>
            <input
              type="text"
              value={getValue('suspension.rearSuspension')}
              onChange={(e) => handleSpecChange('suspension', 'rearSuspension', e.target.value)}
              placeholder="Multi-Link"
            />
          </div>
          <div className="input-group">
            <label>Shock Absorbers Type</label>
            <input
              type="text"
              value={getValue('suspension.shockAbsorbersType')}
              onChange={(e) => handleSpecChange('suspension', 'shockAbsorbersType', e.target.value)}
              placeholder="Coil Spring"
            />
          </div>
        </div>
      </div>

      {/* TRANSMISSION */}
      <div className="specs-category">
        <h4>TRANSMISSION</h4>
        <div className="transmission-sections">
          <div className="transmission-section">
            <h5>Manual (M/T)</h5>
            <div className="specs-grid">
              <div className="input-group">
                <label>Gear Box</label>
                <input
                  type="text"
                  value={getValue('transmission.manual.gearBox')}
                  onChange={(e) => handleTransmissionChange('manual', 'gearBox', e.target.value)}
                  placeholder="5-Speed"
                />
              </div>
              <div className="input-group">
                <label>Transmission Type</label>
                <input
                  type="text"
                  value={getValue('transmission.manual.transmissionType')}
                  onChange={(e) => handleTransmissionChange('manual', 'transmissionType', e.target.value)}
                  placeholder="Manual"
                />
              </div>
            </div>
          </div>
          <div className="transmission-section">
            <h5>Automatic (A/T)</h5>
            <div className="specs-grid">
              <div className="input-group">
                <label>Gear Box</label>
                <input
                  type="text"
                  value={getValue('transmission.automatic.gearBox')}
                  onChange={(e) => handleTransmissionChange('automatic', 'gearBox', e.target.value)}
                  placeholder="4-Speed"
                />
              </div>
              <div className="input-group">
                <label>Transmission Type</label>
                <input
                  type="text"
                  value={getValue('transmission.automatic.transmissionType')}
                  onChange={(e) => handleTransmissionChange('automatic', 'transmissionType', e.target.value)}
                  placeholder="Automatic"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ENGINE DETAILS */}
      <div className="specs-category">
        <h4>ENGINE DETAILS</h4>
        <div className="specs-grid">
          <div className="input-group">
            <label>No Of Cylinders</label>
            <input
              type="text"
              value={getValue('engine.noOfCylinders')}
              onChange={(e) => handleSpecChange('engine', 'noOfCylinders', e.target.value)}
              placeholder="4"
            />
          </div>
          <div className="input-group">
            <label>Valves Per Cylinder</label>
            <input
              type="text"
              value={getValue('engine.valvesPerCylinder')}
              onChange={(e) => handleSpecChange('engine', 'valvesPerCylinder', e.target.value)}
              placeholder="4"
            />
          </div>
          <div className="input-group">
            <label>Valve Configuration</label>
            <input
              type="text"
              value={getValue('engine.valveConfiguration')}
              onChange={(e) => handleSpecChange('engine', 'valveConfiguration', e.target.value)}
              placeholder="DOHC"
            />
          </div>
          <div className="input-group">
            <label>Fuel Supply System</label>
            <input
              type="text"
              value={getValue('engine.fuelSupplySystem')}
              onChange={(e) => handleSpecChange('engine', 'fuelSupplySystem', e.target.value)}
              placeholder="EFI"
            />
          </div>
          <div className="input-group">
            <label>Engine</label>
            <input
              type="text"
              value={getValue('engine.engine')}
              onChange={(e) => handleSpecChange('engine', 'engine', e.target.value)}
              placeholder="1.5 L"
            />
          </div>
        </div>
      </div>

      {/* WHEELS & TYRE */}
      <div className="specs-category">
        <h4>WHEELS & TYRE</h4>
        <div className="wheels-sections">
          <div className="wheels-section">
            <h5>Standard Type</h5>
            <div className="specs-grid">
              <div className="input-group">
                <label>Alloy Wheel Size</label>
                <input
                  type="text"
                  value={getValue('wheels.standard.alloyWheelSize')}
                  onChange={(e) => handleWheelsChange('standard', 'alloyWheelSize', e.target.value)}
                  placeholder="16 Inch"
                />
              </div>
              <div className="input-group">
                <label>Tyre Size</label>
                <input
                  type="text"
                  value={getValue('wheels.standard.tyreSize')}
                  onChange={(e) => handleWheelsChange('standard', 'tyreSize', e.target.value)}
                  placeholder="215/65 R16"
                />
              </div>
              <div className="input-group">
                <label>Tyre Type</label>
                <input
                  type="text"
                  value={getValue('wheels.standard.tyreType')}
                  onChange={(e) => handleWheelsChange('standard', 'tyreType', e.target.value)}
                  placeholder="Radial"
                />
              </div>
              <div className="input-group">
                <label>Wheel Size</label>
                <input
                  type="text"
                  value={getValue('wheels.standard.wheelSize')}
                  onChange={(e) => handleWheelsChange('standard', 'wheelSize', e.target.value)}
                  placeholder="R16"
                />
              </div>
            </div>
          </div>
          <div className="wheels-section">
            <h5>TRD Sportivo Only (Optional)</h5>
            <div className="specs-grid">
              <div className="input-group">
                <label>Alloy Wheel Size</label>
                <input
                  type="text"
                  value={getValue('wheels.sportivo.alloyWheelSize')}
                  onChange={(e) => handleWheelsChange('sportivo', 'alloyWheelSize', e.target.value)}
                  placeholder="17 Inch"
                />
              </div>
              <div className="input-group">
                <label>Tyre Size</label>
                <input
                  type="text"
                  value={getValue('wheels.sportivo.tyreSize')}
                  onChange={(e) => handleWheelsChange('sportivo', 'tyreSize', e.target.value)}
                  placeholder="215/60 R17"
                />
              </div>
              <div className="input-group">
                <label>Tyre Type</label>
                <input
                  type="text"
                  value={getValue('wheels.sportivo.tyreType')}
                  onChange={(e) => handleWheelsChange('sportivo', 'tyreType', e.target.value)}
                  placeholder="Radial"
                />
              </div>
              <div className="input-group">
                <label>Wheel Size</label>
                <input
                  type="text"
                  value={getValue('wheels.sportivo.wheelSize')}
                  onChange={(e) => handleWheelsChange('sportivo', 'wheelSize', e.target.value)}
                  placeholder="R17"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STEERING */}
      <div className="specs-category">
        <h4>STEERING</h4>
        <div className="specs-grid">
          <div className="input-group">
            <label>Steering Type</label>
            <input
              type="text"
              value={getValue('steering.steeringType')}
              onChange={(e) => handleSpecChange('steering', 'steeringType', e.target.value)}
              placeholder="Power"
            />
          </div>
          <div className="input-group">
            <label>Steering Column</label>
            <input
              type="text"
              value={getValue('steering.steeringColumn')}
              onChange={(e) => handleSpecChange('steering', 'steeringColumn', e.target.value)}
              placeholder="Adjustable"
            />
          </div>
          <div className="input-group">
            <label>Steering Gear Type</label>
            <input
              type="text"
              value={getValue('steering.steeringGearType')}
              onChange={(e) => handleSpecChange('steering', 'steeringGearType', e.target.value)}
              placeholder="Rack & Pinion"
            />
          </div>
          <div className="input-group">
            <label>Adjustable Steering Column</label>
            <input
              type="text"
              value={getValue('steering.adjustableSteeringColumn')}
              onChange={(e) => handleSpecChange('steering', 'adjustableSteeringColumn', e.target.value)}
              placeholder="Yes"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecsForm;
