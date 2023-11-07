import React from "react";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import WorkOffOutlinedIcon from "@mui/icons-material/WorkOffOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import Onprogress from "../Componets/Onprogress";
import Onfinish from "../Componets/Onfinish";
import CountOrderRepair from "../Componets/CountOrderRepair";
import Report_mech from "../Componets/Report_mech/Report_Mech";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { Box, Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
// import Button from "@mui/material/Button";

function Dashboard() {
  return (
    <div >
      <h1 className="head-center">Dashboard</h1>
      <div>
        <Box
          sx={{
            margin: "3%",
            flexDirection: "row",
            display: "flex",
          }}
        >
          <FormControl fullWidth>
            <InputLabel
            id="name-repairman">ช่างซ่อม</InputLabel>
            <Select
              label="ช่างซ่อม"
              labelId="name-repairman"
              style={{ width: "30%",height:"auto", margin: "0" ,color:"black",backgroundColor: "white"}}
              onChange={(e) => {
                setMech(e.target.value);
              }}
            >
              <MenuItem value="ช่างทุกคน">
                <em>ช่างทุกคน</em>
              </MenuItem>
              <MenuItem value="ช่างบิ๊ก">
                <em>ช่างบิ๊ก</em>
              </MenuItem>
              <MenuItem value="ช่างซี่">
                <em>ช่างซี่</em>
              </MenuItem>
            </Select>
          </FormControl>
          <TextField
            style={{ width: "30%", margin: "0", backgroundColor: "white" }}
            id="date"
            type="date"
            onChange={(e) => {
              setEstimateTime(e.target.value);
            }}
          />

          <TextField
            style={{ width: "30%", margin: "0", backgroundColor: "white" }}
            id="month"
            type="month"
            onChange={(e) => {
              setEstimateTime(e.target.value);
            }}
          />
        </Box>
      </div>

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
              <CountOrderRepair />
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
              <Onfinish />
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
              <Onprogress />
            </h1>
          </div>
        </div>
      </div>
{/* 
      <div className="dashboard">
        <Report_mech />
      </div> */}
    </div>
  );
}

export default Dashboard;
