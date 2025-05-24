import React, { useState, useEffect } from "react";
import "./logic.css";

export default function OptimizeScheduleVisualizer({ devices, slotCapacity = 300 }) {
  const [result, setResult] = useState([]);
  const [log, setLog] = useState([]);

  useEffect(() => {
    const logs = [];

    function quickSort(devs) {
      if (devs.length <= 1) return devs;
      const [pivot, ...rest] = devs;
      const pivotVal = pivot.power * pivot.duration;
      const left = rest.filter(d => d.power * d.duration > pivotVal);
      const right = rest.filter(d => d.power * d.duration <= pivotVal);
      return [...quickSort(left), pivot, ...quickSort(right)];
    }

    logs.push("Sorting devices by power × duration...");
    const sorted = quickSort(devices);
    logs.push(`Sorted order: ${sorted.map(d => d.name).join(" → ")}`);

    const powerPerSlot = {};
    const scheduled = [];

    for (let device of sorted) {
      const { name, power, duration, slots } = device;
      logs.push(`\nTrying to schedule ${name}...`);
      let scheduledNow = false;

      for (let i = 0; i <= slots.length - duration; i++) {
        const candidate = slots.slice(i, i + duration);
        const canFit = candidate.every(
          (hour) => (powerPerSlot[hour] || 0) + power <= slotCapacity
        );


        if (canFit) {
          candidate.forEach(hour => {
            powerPerSlot[hour] = (powerPerSlot[hour] || 0) + power;
          });
          scheduled.push({ name, power, duration, slots: candidate });
          logs.push(`✅ Scheduled ${name} in slots: ${candidate.map(h => h + ":00").join(", ")}`);
          scheduledNow = true;
          break;
        }
      }

      if (!scheduledNow) {
        scheduled.push({ name, power, duration, slots: [] });
        logs.push(`❌ Could not schedule ${name}`);
      }
    }

    setResult(scheduled);
    setLog(logs);
  }, [devices, slotCapacity]);

  return (
    <div style={{ padding: "1rem" }}>
      <h3>📋 Optimized Schedule Table</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1rem" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Device</th>
            <th>Power</th>
            <th>Duration</th>
            <th>Scheduled Slots</th>
          </tr>
        </thead>
        <tbody>
          {result.map((d, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{d.name}</td>
              <td>{d.power}</td>
              <td>{d.duration} hrs</td>
              <td>
                {d.slots.length > 0
                  ? d.slots.map(h => h.toString().padStart(2, "0") + ":00").join(", ")
                  : <span style={{ color: "red" }}>❌ Not Scheduled</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>🪵 Console Logs</h4>
      <div className="dry-log-box">
        {log.map((entry, i) => <div key={i}>{entry}</div>)}
      </div>

      <h4>🕐 Slot Usage (Timeline)</h4>
      <h4>🕐 Slot Usage (Timeline)</h4>
<div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "1rem" }}>
  {[...Array(24).keys()].map(hour => {
    const devicesInSlot = result.filter(d => d.slots.includes(hour));
    const totalPower = devicesInSlot.reduce((sum, d) => sum + d.power, 0);

    return (
      <div key={hour} className={`slot-box ${totalPower > 0 ? "active" : ""}`}>
        <div style={{ fontWeight: "bold" }}>{hour.toString().padStart(2, "0")}:00</div>
        <div>{totalPower}W</div>
        <div style={{ fontSize: "0.7rem", marginTop: "2px" }}>
          {devicesInSlot.map(d => d.name).join(", ")}
        </div>
      </div>
    );
  })}
</div>

    </div>
  );
}
