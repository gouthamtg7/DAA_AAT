import "./Entry.css"
import Stepper, { Step } from './assets/stepper.jsx';
import { useState } from "react";
import OptimizeScheduleVisualizer from "../Logic/logic.jsx";


export default function EntryUI(){
    const [step, setStep] = useState(0);
    const [deviceName, setDeviceName] = useState([]);
    const [powerUsage, setPowerUsage] = useState([]);
    const [duration, setDuration] = useState([]);
    const [fromTime, setFromTime] = useState("");
    const [toTime, setToTime] = useState("");
    const [preferredSlots, setPreferredSlots] = useState([]);
    const [range, setRange] = useState([]);
    const [n, setN] = useState(1);


    const [dummyDeviceName, setDummyDeviceName] = useState("");
    const [deviceCount, setDeviceCount] = useState(0);
    const [dummyPowerUsage, setDummyPowerUsage] = useState("");
    const [powerCount, setPowerCount] = useState(0);
    const [dummyDuration, setDummyDuration] = useState(0);
    const [durationCount, setDurationCount] = useState(0);
    const [dummyRange, setDummyRange] = useState([]);
    const [rangeCount, setRangeCount] = useState(0);



    const [output, setOutput] = useState(false);

const handleSlotChange = (e) => {
  const options = Array.from(e.target.selectedOptions);
  const selectedHours = options.map((opt) => Number(opt.value));
  setPreferredSlots(selectedHours);
};

    
    return(
    <div className="main-wrapper">
            {!output ? (
  <h1 className="main-title">Save Time. Save Electricity.</h1>
) : (<h1></h1>)}


            
  
<Stepper
  initialStep={1}
  onStepChange={(step) => {
  setStep(step);
  if (step === 6) {
    setOutput(true); 
  } else {
    setOutput(false);  
  }
}}

  onFinalStepCompleted={() => console.log("All steps completed!")}
  backButtonText="Previous"
  nextButtonText="Next"
>
  <Step>
    <h2>Welcome to the Energy Consumption Optimizer!</h2>
    <p>Let's save you some energy (lol)!</p>
    <label className="n-devices">Enter the number of devices :</label>
    <input value={n} onChange={(e)=> setN(e.target.value)} />
  </Step>

  {/* Step 1 : Device Names */}
  <Step>
    <h2>Fill in the device names.</h2>
    
    <div className="device-name">
        <input value={dummyDeviceName} onChange={(e)=>setDummyDeviceName(e.target.value)} placeholder="Eg. Refridgerator" required={true}/>
    </div>
    <button
    
  style={{ marginTop: "1rem" }}
  onClick={() => {
    if(deviceCount>=n){
        alert("Exceeding mentioned devices limit!");
        setDummyDeviceName("");
        return
    }
    if (!dummyDeviceName?.trim()) {
  alert("Please enter a device name!");
  return;
}

    setDeviceName((prev)=>([
        ...prev,
        dummyDeviceName
    ]));

    setDummyDeviceName("");
    setDeviceCount((prev)=>prev+1);
  }}
>
  Save
</button>
{deviceName.map((device, index) => (
  <p className="devices-display" key={index}>
    <strong>{index + 1}. {device}</strong> {" "}
    
  </p>
))}

    
  </Step>

  {/* STEP 2 : Power Usage */}
  <Step>


    <h2>Now, provide their power usages in KWpH.</h2>
    <div className="power-usage">
        <h2 className="power-usage-title">Power Usage (kWpH) : </h2>
        <input value={dummyPowerUsage} onChange={(e) => setDummyPowerUsage(e.target.value)} placeholder="Eg. 150KW/H"/>
    </div>
    <button
  style={{ marginTop: "1rem" }}
  onClick={() => {
    if(deviceCount<n){
        alert("You have missed to fill in a few device names!");
        return;
    }
    if(powerCount>=n){
        alert("Exceeding limit!");
        setDummyPowerUsage("");
        return
    }
    if (!dummyPowerUsage?.trim()) {
  alert("Please enter a value!");
  return;
}

    setPowerUsage((prev)=>([
        ...prev,
        dummyPowerUsage
    ]));

    setDummyPowerUsage("");
    setPowerCount((prev)=>prev+1);
  }}
>
  Save
</button>
{deviceName.map((device, index) => (
  <p className="devices-display" key={index}>
    <strong>{index + 1}. {device}</strong> :{" "}
    {powerUsage[index]}
  </p>
))}

  </Step>


  {/* STEP 3 : Duration */}
  <Step>
        <div className="duration">
            <h2 className="power-usage-title">Duration (in hours): </h2>
            <input value={dummyDuration} onChange={(e) => setDummyDuration(e.target.value)} placeholder="Eg. 2 Hours"/>
        </div>

        <button
  style={{ marginTop: "1rem" }}
  onClick={() => {
    if(powerCount<n){
        alert("You have missed to fill in a few power usages!");
        return;
    }
    if(durationCount>=n){
        alert("Exceeding limit!");
        setDummyDuration("");
        return
    }
    if (!dummyDuration?.trim()) {
  alert("Please enter a value!");
  return;
}

if (isNaN(Number(dummyDuration)) || dummyDuration.trim() === "") {
  alert("Please enter a valid number for duration");
  return;
}


    setDuration((prev)=>([
        ...prev,
        dummyDuration
    ]));

    setDummyDuration("");
    setDurationCount((prev)=>prev+1);
  }}
>
  Save
</button>
{deviceName.map((device, index) => (
  <p className="devices-display" key={index}>
    <strong>{index + 1}. {device}</strong> :{" "}
    {powerUsage[index]}, {duration[index]} hrs,{" "}
    
  </p>
))}

        

  </Step>

  {/* STEP 4 : SLOT TIMINGS */}

  <Step>
    <div className="slot-timings">
            <h2>Preferred Time Slots:</h2>
<label>From:</label>
<select value={fromTime} onChange={(e) => setFromTime(e.target.value)}>
  <option value="">--Select--</option>
  {[...Array(24).keys()].map((hour) => {
    const label = hour.toString().padStart(2, "0") + ":00";
    return <option key={hour} value={hour}>{label}</option>;
  })}
</select>

<label style={{ marginLeft: "1rem" }}>To:</label>
<select value={toTime} onChange={(e) => setToTime(e.target.value)}>
  <option value="">--Select--</option>
  {[...Array(24).keys()].map((hour) => {
    const label = hour.toString().padStart(2, "0") + ":00";
    return <option key={hour} value={hour}>{label}</option>;
  })}
  
</select>
<button
  style={{ marginTop: "1rem" }}
  onClick={() => {
    if(durationCount<n){
        alert("You have missed to fill in a few values!");
        return;
    }
    if(rangeCount>=n){
        alert("Exceeding limit!");
        setFromTime("");
        setToTime("");
        return
    }
    const from = parseInt(fromTime);
    const to = parseInt(toTime);

    if (isNaN(from) || isNaN(to) || from >= to) {
      alert("Please select a valid time range (From < To)");
      return;
    }

    // ✅ Generate dummy range
    const newRange = [];
    for (let i = from; i < to; i++) {
      newRange.push(i);
    }

    // ✅ Save to dummy and push to main
    setDummyRange(newRange);
    setPreferredSlots((prev) => [...prev, newRange]);
    setRangeCount((prev) => prev + 1);

    // ✅ Clear inputs
    setFromTime("");
    setToTime("");
  }}
>
  Save
</button>

{deviceName.map((device, index) => (
  <p className="devices-display" key={index}>
    <strong>{index + 1}. {device}</strong> :{" "}
    {powerUsage[index]}, {duration[index]} hrs,{" "}
    {preferredSlots[index]
      ?.map((hour) => hour.toString().padStart(2, "0") + ":00")
      .join(", ")}
  </p>
))}








        </div>
  </Step>

  



 <Step>
  <h2>✅ Final Output</h2>
  {output && (
    <>
      {console.log("Devices passed to visualizer:", deviceName, powerUsage, duration, preferredSlots)}
      <OptimizeScheduleVisualizer
        devices={deviceName.map((name, i) => ({
          name,
          power: Number(powerUsage[i]),
          duration: Number(duration[i]),
          slots: preferredSlots[i] || []
        }))}
        slotCapacity={300}
      />
    </>
  )}
</Step>



    

</Stepper>
            
        
    </div>
    )
}