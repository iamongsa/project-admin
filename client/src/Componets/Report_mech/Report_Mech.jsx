import React, { useEffect, useState } from "react";
import axios from "axios";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import WorkOffOutlinedIcon from "@mui/icons-material/WorkOffOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import CountOrderRepair from "../CountOrderRepair";




function BigMech() {
    const [data, setData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMechanic, setSelectedMechanic] = useState("");
    const [totalInProgress, setTotalInProgress] = useState(0);
    const [totalCompleted, setTotalCompleted] = useState(0);

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear, selectedMechanic]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/repairs?month=${selectedMonth}&year=${selectedYear}&mechanic=${selectedMechanic}`
      );
      const data = response.data;
      setData(data);

      // เพิ่มการร้องข้อมูลจำนวนรายการซ่อมที่ดำเนินการซ่อมและซ่อมเสร็จแล้วของช่าง
      const responseMechanic = await axios.get(
        `http://localhost:3001/repairs/mechanic?mechanic=${selectedMechanic}`
      );
      const dataMechanic = responseMechanic.data;
      setTotalInProgress(dataMechanic.totalInProgress);
      setTotalCompleted(dataMechanic.totalCompleted);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการร้องข้อมูล:", error);
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleMechanicChange = (event) => {
    setSelectedMechanic(event.target.value);
  };

  return (
    <div>
      <h1>รายการซ่อม</h1>
      <div className="report-bg"></div>
      <div>
        <label>เลือกเดือน:</label>
        <select value={selectedMonth} onChange={handleMonthChange}>
          <option value="">ทั้งหมด</option>
          <option value="1">มกราคม</option>
          <option value="2">กุมภาพันธ์</option>
          <option value="3">มีนาคม</option>
          <option value="4">เมษายน</option>
          <option value="5">พฤษภาคม</option>
          <option value="6">มิถุนาคม</option>
          <option value="7">กรกฎาคม</option>
          <option value="8">สิงหาคม</option>
          <option value="9">กันยายน</option>
          <option value="10">ตุลาคม</option>
          <option value="11">พฤศจิกายน</option>
          <option value="12">ธันวาคม</option>
        </select>
      </div>
      <div>
        <label>เลือกปี:</label>
        <select value={selectedYear} onChange={handleYearChange}>
          <option value="">ทั้งหมด</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>
      </div>
      <div>
        <label>เลือกช่าง:</label>
        <select value={selectedMechanic} onChange={handleMechanicChange}>
          <option value="">ทั้งหมด</option>
          <option value="1">ช่างบิ๊ก</option>
          <option value="2">ช่างซี่</option>
          
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>เดือน</th>
            <th>ปี</th>
            <th>รายการ</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.repair_month}</td>
              <td>{item.repair_year}</td>
              <td>{item.total_repairs}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* แสดงจำนวนรายการซ่อมที่ดำเนินการซ่อมและซ่อมเสร็จแล้ว */}
      <div>
        <p>รายการซ่อมที่ดำเนินการซ่อม: {totalInProgress} คัน</p>
        <p>รายการซ่อมที่ซ่อมเสร็จแล้ว: {totalCompleted} คัน</p>
      </div>

      <h1>Dashboard</h1>
      <div className="dashboard">
        <div className="bg-dt">
          <div className="head-dt">งานทั้งหมด</div>
          <div className="con-dt">
            <div className="work-icon">
              <WorkOutlineOutlinedIcon
                sx={{ fontSize: 50, color: "#2D4059" }}
              />
            </div>
            <div className="dt-db"></div>
            <h1 className="dt-num">
            <CountOrderRepair/>
            </h1>
          </div>
        </div>

        <div className="bg-dt">
          <div className="head-dt">งานที่เสร็จแล้ว</div>
          <div className="con-dt">
            <div className="work-icon">
              <WorkOffOutlinedIcon color="success" sx={{ fontSize: 50 }} />
            </div>
            <div className="dt-db"></div>
            <h1 className="dt-num">
            {totalCompleted}
            </h1>
          </div>
        </div>

        <div className="bg-dt">
          <div className="head-dt">งานรอดำเนินการ</div>
          <div className="con-dt">
            <div className="work-icon">
              <WorkHistoryOutlinedIcon color="warning" sx={{ fontSize: 50 }} />
            </div>
            <div className="dt-db"></div>
            <h1 className="dt-num">
            {totalInProgress}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BigMech;
