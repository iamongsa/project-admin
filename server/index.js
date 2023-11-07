const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "admin_project",
});

app.get("/", (req, res) => {
  let sql = `SELECT order_repair.order_id, order_repair.create_order, customers.name, cars.plate_license, mechanic.mech_name, order_repair.description, status_order.status_name
  FROM order_repair
  INNER JOIN customers ON order_repair.customer_id = customers.cus_id
  INNER JOIN cars ON order_repair.car_id = cars.car_id
  INNER JOIN mechanic ON order_repair.mechanic_id = mechanic.mech_id
  INNER JOIN status_order ON order_repair.status_id = status_order.status_id
  ORDER BY order_repair.create_order DESC;`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//ลบข้อมูล order
app.delete("/delete/:order_id", (req, res) => {
  const order_id = req.params.order_id;
  db.query(
    "DELETE FROM order_repair WHERE order_id =?",
    order_id,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

//Add order
app.post("/form", (req, res) => {
  // รับข้อมูลจากแบบฟอร์ม
  const phone = req.body.customer_phone;
  const plate_id = req.body.plate_id;
  const mech_name = req.body.mech_name;
  const repair_status = req.body.repair_status;
  const order_description = req.body.order_description;
  const estimate_time = req.body.estimate_time;

  // สร้างคำสั่ง SQL สำหรับการค้นหา customer_id จากตาราง customers
  const customerSQL = "SELECT cus_id FROM customers WHERE phone = ?";

  // สร้างคำสั่ง SQL สำหรับการค้นหา car_id จากตาราง cars
  const carSQL = "SELECT car_id FROM cars WHERE plate_license = ?";

  // สร้างคำสั่ง SQL สำหรับการค้นหา mechanic_id จากตาราง mechanic
  const mechSQL = "SELECT mech_id FROM mechanic WHERE mech_name = ?";

  // สร้างคำสั่ง SQL สำหรับการค้นหา status_id จากตาราง status_order
  const statusSQL = "SELECT status_id FROM status_order WHERE status_name = ?";

  // ค้นหา customer_id จากตาราง customers
  db.query(customerSQL, [phone], (customerErr, customerResult) => {
    if (customerErr) {
      console.log(customerErr);
    } else {
      const customer_id = customerResult[0].cus_id;

      // ค้นหา car_id จากตาราง cars
      db.query(carSQL, [plate_id], (carErr, carResult) => {
        if (carErr) {
          console.log(carErr);
        } else {
          const car_id = carResult[0].car_id;

          // ค้นหา mechanic_id จากตาราง mechanic
          db.query(mechSQL, [mech_name], (mechErr, mechResult) => {
            if (mechErr) {
              console.log(mechErr);
            } else {
              const mechanic_id = mechResult[0].mech_id;

              // ค้นหา status_id จากตาราง status_order
              db.query(
                statusSQL,
                [repair_status],
                (statusErr, statusResult) => {
                  if (statusErr) {
                    console.log(statusErr);
                  } else {
                    const status_id = statusResult[0].status_id;

                    // เพิ่มข้อมูลลงในตาราง order_repair
                    db.query(
                      "INSERT INTO order_repair (customer_id, car_id, mechanic_id, status_id, description, estimate_time) VALUES (?, ?, ?, ?, ?, ?)",
                      [
                        customer_id,
                        car_id,
                        mechanic_id,
                        status_id,
                        order_description,
                        estimate_time,
                      ],
                      (err, result) => {
                        if (err) {
                          console.log(err);
                        } else {
                          res.send("Values Inserted");
                        }
                      }
                    );
                  }
                }
              );
            }
          });
        }
      });
    }
  });
});

app.get("/admin/update/:order_id", (req, res) => {
  const sql =
    "SELECT order_repair.order_id, order_repair.estimate_time, customers.phone, cars.plate_license, mechanic.mech_name, order_repair.description, status_order.status_name FROM order_repair INNER JOIN customers ON order_repair.customer_id = customers.cus_id INNER JOIN cars ON order_repair.car_id = cars.car_id INNER JOIN mechanic ON order_repair.mechanic_id = mechanic.mech_id INNER JOIN status_order ON order_repair.status_id = status_order.status_id WHERE order_id = ?";
  const order_id = req.params.order_id;
  db.query(sql, [order_id], (err, result) => {
    if (err) return res.json({ Error: err });
    return res.json(result);
  });
});

app.put("/admin/edit/:order_id", (req, res) => {
  const { order_id } = req.params;
  const mech_name = req.body.mech_name;
  const repair_status = req.body.repair_status;
  const order_description = req.body.order_description;
  const estimate_time = req.body.estimate_time;

  const mechSQL = "SELECT mech_id FROM mechanic WHERE mech_name = ?";
  const statusSQL = "SELECT status_id FROM status_order WHERE status_name = ?";

  db.query(mechSQL, [mech_name], (mechErr, mechResult) => {
    if (mechErr) {
      console.log(mechErr);
    } else {
      const mechanic_id = mechResult[0].mech_id;

      db.query(statusSQL, [repair_status], (statusErr, statusResult) => {
        if (statusErr) {
          console.log(statusErr);
        } else {
          const status_id = statusResult[0].status_id;

          db.query(
            `UPDATE order_repair SET mechanic_id = ?, status_id = ?,  description = ? ,estimate_time = ? WHERE order_id = ?`,
            [
              mechanic_id,
              status_id,
              order_description,
              estimate_time,
              order_id,
            ],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                res.send(result);
              }
            }
          );
        }
      });
    }
  });
});

///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////Users/////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

app.get("/admin/manage/users", (req, res) => {
  db.query("SELECT * FROM `customers`", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//Add Users
app.post("/admin/manage/user/add", (req, res) => {
  const name = req.body.name;
  const phone = req.body.phone;
  const line_id = req.body.line_id;
  const address = req.body.address;

  db.query(
    "INSERT INTO customers (`name`, `phone`, `line_id`, `address`) VALUES(?,?,?,?)",
    [name, phone, line_id, address],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

app.delete("/admin/manage/users/delete/:cus_id", (req, res) => {
  const cus_id = req.params.cus_id;
  db.query("DELETE FROM customers WHERE cus_id =?", cus_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

////Get id to edit page
app.get("/admin/manage/users/update/:cus_id", (req, res) => {
  const sql = "SELECT * FROM customers WHERE cus_id=?";
  const cus_id = req.params.cus_id;
  db.query(sql, [cus_id], (err, result) => {
    if (err) return res.json({ Error: err });
    return res.json(result);
  });
});

app.put("/admin/manage/users/edit/:cus_id", async (req, res) => {
  const { cus_id } = req.params;
  const { Name, phone, line_id, address } = req.body;

  try {
    await db.query(
      `UPDATE customers SET name = ?, phone = ?,  line_id = ? ,address = ? WHERE cus_id = ?`,
      [Name, phone, line_id, address, cus_id]
    );

    res.json({
      message: "User updated successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
});

///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////Cars///////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

app.get("/admin/manage/cars", (req, res) => {
  db.query("SELECT * FROM cars", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//Add Car
app.post("/admin/manage/car/add", (req, res) => {
  const plate = req.body.plate_license;
  const brand = req.body.make;
  const model = req.body.model;
  const vin_number = req.body.vin_number;

  db.query(
    "INSERT INTO cars (plate_license,make,model,vin_number) VALUES(?,?,?,?)",
    [plate, brand, model, vin_number],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

///Delete
app.delete("/admin/manage/car/delete/:car_id", (req, res) => {
  const car_id = req.params.car_id;
  db.query("DELETE FROM cars WHERE car_id =?", car_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

///Get update list id
app.get("/admin/manage/cars/update/:car_id", (req, res) => {
  const sql = "SELECT * FROM cars WHERE car_id=?";
  const id = req.params.car_id;
  db.query(sql, id, (err, result) => {
    if (err) return res.json({ Error: err });
    return res.json(result);
  });
});

//// update
app.put("/admin/manage/cars/edit/:car_id", async (req, res) => {
  const { car_id } = req.params;
  const { plate_license, make, model, vin_number } = req.body;

  try {
    await db.query(
      `UPDATE cars SET plate_license = ?, make = ?, model = ?, vin_number = ?  WHERE car_id = ?`,
      [plate_license, make, model, vin_number, car_id]
    );

    res.json({
      message: "User updated successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
});

///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////Mechanics//////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

app.get("/admin/manage/mechanics", (req, res) => {
  db.query("SELECT * FROM mechanic", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//Add Mech
app.post("/admin/manage/mechanic/add", (req, res) => {
  const m_name = req.body.mech_name;
  const m_phone = req.body.mech_phone;

  db.query(
    "INSERT INTO mechanic (mech_name,phone) VALUES(?,?)",
    [m_name, m_phone],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

app.delete("/admin/manage/mechanics/delete/:mech_id", (req, res) => {
  const mech_id = req.params.mech_id;
  db.query("DELETE FROM mechanic WHERE mech_id =?", mech_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

///Get update list id
app.get("/admin/manage/mechanic/update/:mech_id", (req, res) => {
  const sql = "SELECT * FROM mechanic WHERE mech_id=?";
  const id = req.params.mech_id;
  db.query(sql, id, (err, result) => {
    if (err) return res.json({ Error: err });
    return res.json(result);
  });
});

//// update
app.put("/admin/manage/mechanic/edit/:mech_id", async (req, res) => {
  const { mech_id } = req.params;
  const { mech_name, phone } = req.body;

  try {
    await db.query(
      `UPDATE mechanic SET mech_name = ?, phone = ? WHERE mech_id = ?`,
      [mech_name, phone, mech_id]
    );

    res.json({
      message: "Mechanic updated successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
});

///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////Dashboard/////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

app.get("/admin/dashboard/on_progress", (req, res) => {
  db.query(
    "SELECT COUNT(*) FROM order_repair WHERE status_id = 2",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/admin/dashboard/on_finish", (req, res) => {
  db.query(
    "SELECT COUNT(*) FROM order_repair WHERE status_id = 3",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/admin/dashboard/all_order_repair", (req, res) => {
  db.query("SELECT COUNT(*) FROM order_repair ", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

// app.get("/admin/dashboard/all_order_repair/", (req, res) => {
//   db.query("SELECT COUNT(*) FROM order_repair "
//   , (err, result) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.send(result);
//     }
//   });
// });

app.get("/repairs", (req, res) => {
  const selectedMonth = req.query.month || ""; // เดือนที่เลือก
  const selectedYear = req.query.year || ""; // ปีที่เลือก
  const selectedMechanic = req.query.mechanic || ""; // ช่างที่เลือก
  // คำสั่ง SQL สำหรับดึงข้อมูลรายการซ่อม
  // คำสั่ง SQL สำหรับดึงข้อมูลรายการซ่อม
  let sql = `SELECT MONTH(create_order) AS repair_month, YEAR(create_order) AS repair_year, COUNT(*) AS total_repairs
FROM order_repair
WHERE 1 = 1`;

  if (selectedMonth) {
    sql += ` AND MONTH(create_order) = ${selectedMonth}`;
  }

  if (selectedYear) {
    sql += ` AND YEAR(create_order) = ${selectedYear}`;
  }

  if (selectedMechanic) {
    sql += ` AND mechanic_id = ${selectedMechanic}`;
  }

  sql += ` GROUP BY repair_month, repair_year`;

  // ดึงข้อมูลจากฐานข้อมูล
  db.query(sql, (err, result) => {
    if (err) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", err);
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    } else {
      res.json(result);
    }
  });
});

app.get("/repairs/mechanic", (req, res) => {
  const selectedMechanic = req.query.mechanic || ""; // ช่างที่เลือก
  // คำสั่ง SQL สำหรับดึงจำนวนรายการซ่อมตามสถานะ
  const sqlInProgress = `SELECT COUNT(*) AS total_in_progress
FROM order_repair
WHERE mechanic_id = ? AND status_id = 2`; // 1 คือสถานะ "ดำเนินการซ่อม"

  const sqlCompleted = `SELECT COUNT(*) AS total_completed
FROM order_repair
WHERE mechanic_id = ? AND status_id = 3`; // 2 คือสถานะ "ซ่อมเสร็จแล้ว"

  // ดึงจำนวนรายการซ่อมตามสถานะ
  db.query(
    sqlInProgress,
    [selectedMechanic],
    (errInProgress, resultInProgress) => {
      if (errInProgress) {
        console.error(
          "เกิดข้อผิดพลาดในการดึงข้อมูลรายการซ่อมที่ดำเนินการซ่อม:",
          errInProgress
        );
      } else {
        const totalInProgress = resultInProgress[0].total_in_progress;

        // ดึงจำนวนรายการซ่อมที่ซ่อมเสร็จแล้ว
        db.query(
          sqlCompleted,
          [selectedMechanic],
          (errCompleted, resultCompleted) => {
            if (errCompleted) {
              console.error(
                "เกิดข้อผิดพลาดในการดึงข้อมูลรายการซ่อมที่ซ่อมเสร็จแล้ว:",
                errCompleted
              );
            } else {
              const totalCompleted = resultCompleted[0].total_completed;

              // ส่งข้อมูลกลับไปยังหน้า React
              res.json({ totalInProgress, totalCompleted });
            }
          }
        );
      }
    }
  );
});

////////////////// List_order ///////
app.get("/admin/status_order/succcess_order", (req, res) => {
  let sql = `SELECT order_repair.order_id, order_repair.create_order, customers.name, cars.plate_license, mechanic.mech_name, order_repair.description, status_order.status_name
  FROM order_repair
  INNER JOIN customers ON order_repair.customer_id = customers.cus_id
  INNER JOIN cars ON order_repair.car_id = cars.car_id
  INNER JOIN mechanic ON order_repair.mechanic_id = mechanic.mech_id
  INNER JOIN status_order ON order_repair.status_id = status_order.status_id
  WHERE order_repair.status_id = 3
  ORDER BY order_repair.create_order DESC;
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/admin/status_order/onprogress_repair", (req, res) => {
  let sql = `SELECT order_repair.order_id, order_repair.create_order, customers.name, cars.plate_license, mechanic.mech_name, order_repair.description, status_order.status_name
  FROM order_repair
  INNER JOIN customers ON order_repair.customer_id = customers.cus_id
  INNER JOIN cars ON order_repair.car_id = cars.car_id
  INNER JOIN mechanic ON order_repair.mechanic_id = mechanic.mech_id
  INNER JOIN status_order ON order_repair.status_id = status_order.status_id
  WHERE order_repair.status_id = 2
  ORDER BY order_repair.create_order DESC;
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/admin/status_order/waiting_order", (req, res) => {
  let sql = `SELECT order_repair.order_id, order_repair.create_order, customers.name, cars.plate_license, mechanic.mech_name, order_repair.description, status_order.status_name
  FROM order_repair
  INNER JOIN customers ON order_repair.customer_id = customers.cus_id
  INNER JOIN cars ON order_repair.car_id = cars.car_id
  INNER JOIN mechanic ON order_repair.mechanic_id = mechanic.mech_id
  INNER JOIN status_order ON order_repair.status_id = status_order.status_id
  WHERE order_repair.status_id = 1
  ORDER BY order_repair.create_order DESC;
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(3001, () => {
  console.log("Hey , yoour server is running on port 3001!");
});
