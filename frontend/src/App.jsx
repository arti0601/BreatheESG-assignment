import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [records, setRecords] = useState([]);
  const [file, setFile] = useState(null);

  const fetchRecords = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:8000/api/records/"
      );

      setRecords(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const uploadCSV = async () => {

    if (!file) {
      alert("Please select a CSV file");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    try {

      await axios.post(
        "http://127.0.0.1:8000/api/upload/sap/",
        formData
      );

      alert("CSV Uploaded Successfully");

      fetchRecords();

    } catch (error) {

      console.log(error);

      alert("Upload failed");
    }
  };

  const approveRecord = async (id) => {

    try {

      await axios.post(
        `http://127.0.0.1:8000/api/approve/${id}/`
      );

      fetchRecords();

    } catch (error) {
      console.log(error);
    }
  };

  return (

    <div style={styles.page}>

      <div style={styles.overlay}>

        <div style={styles.topSection}>

          <div>

            <h1 style={styles.title}>
              🌍 Breathe ESG Dashboard
            </h1>

            <p style={styles.subtitle}>
              AI Powered Carbon Emissions Monitoring
            </p>

          </div>

        </div>

        <div style={styles.statsGrid}>

          <div style={styles.card}>
            <h2>{records.length}</h2>
            <p>Total Records</p>
          </div>

          <div style={styles.card}>
            <h2>
              {
                records.filter(
                  r => r.suspicious
                ).length
              }
            </h2>

            <p>Suspicious</p>
          </div>

          <div style={styles.card}>
            <h2>
              {
                records.filter(
                  r => r.status === "approved"
                ).length
              }
            </h2>

            <p>Approved</p>
          </div>

        </div>

        <div style={styles.uploadBox}>

          <input
            type="file"
            accept=".csv"
            onChange={(e) =>
              setFile(e.target.files[0])
            }
            style={styles.fileInput}
          />

          <button
            onClick={uploadCSV}

            onMouseOver={(e) => {

              e.target.style.transform =
                "translateY(-3px) scale(1.03)";

              e.target.style.boxShadow =
                "0 8px 25px rgba(34,197,94,0.5)";
            }}

            onMouseOut={(e) => {

              e.target.style.transform =
                "translateY(0px) scale(1)";

              e.target.style.boxShadow =
                "0 4px 15px rgba(34,197,94,0.4)";
            }}

            style={styles.uploadButton}
          >
            Upload CSV
          </button>

        </div>

        <div style={styles.tableWrapper}>

          <table style={styles.table}>

            <thead>

              <tr>

                <th style={styles.th}>Category</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Unit</th>
                <th style={styles.th}>CO2e</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Risk</th>
                <th style={styles.th}>Action</th>

              </tr>

            </thead>

            <tbody>

              {records.map((record) => (

                <tr key={record.id} style={styles.row}>

                  <td style={styles.td}>
                    {record.category}
                  </td>

                  <td style={styles.td}>
                    {record.quantity}
                  </td>

                  <td style={styles.td}>
                    {record.unit}
                  </td>

                  <td style={styles.td}>
                    {record.co2e}
                  </td>

                  <td style={styles.td}>

                    <span
                      style={{
                        ...styles.badge,

                        background:
                          record.status === "approved"
                            ? "#22c55e"
                            : "#f59e0b",
                      }}
                    >

                      {record.status}

                    </span>

                  </td>

                  <td style={styles.td}>

                    {record.suspicious ? (

                      <span
                        style={{
                          ...styles.badge,
                          background: "#ef4444",
                        }}
                      >
                        ⚠ High
                      </span>

                    ) : (

                      <span
                        style={{
                          ...styles.badge,
                          background: "#22c55e",
                        }}
                      >
                        Safe
                      </span>

                    )}

                  </td>

                  <td style={styles.td}>

                    <button
                      onClick={() =>
                        approveRecord(record.id)
                      }

                      onMouseOver={(e) => {

                        e.target.style.transform =
                          "translateY(-3px) scale(1.03)";

                        e.target.style.boxShadow =
                          "0 8px 25px rgba(255,255,255,0.25)";
                      }}

                      onMouseOut={(e) => {

                        e.target.style.transform =
                          "translateY(0px) scale(1)";

                        e.target.style.boxShadow =
                          "0 4px 15px rgba(0,0,0,0.25)";
                      }}

                      style={{
                        ...styles.button,

                        background:
                          record.status === "approved"

                            ? "linear-gradient(135deg,#ef4444,#dc2626)"

                            : "linear-gradient(135deg,#3b82f6,#2563eb)",
                      }}
                    >

                      {record.status === "approved"
                        ? "Undo"
                        : "Approve"}

                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

const styles = {

  page: {
    minHeight: "100vh",
    width: "100%",
    background:
      "linear-gradient(135deg,#0f172a,#1e293b,#334155)",

    padding: "30px",
    boxSizing: "border-box",
    overflowX: "hidden",
    fontFamily: "Arial",
  },

  overlay: {
    width: "100%",
  },

  topSection: {
    marginBottom: "30px",
  },

  title: {
    color: "white",
    fontSize: "42px",
    marginBottom: "10px",
  },

  subtitle: {
    color: "#cbd5e1",
    fontSize: "18px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",

    gap: "20px",
    marginBottom: "35px",
    width: "100%",
  },

  card: {
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(12px)",
    padding: "25px",
    borderRadius: "18px",
    color: "white",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
  },

  uploadBox: {
    display: "flex",
    gap: "15px",
    marginBottom: "25px",
    alignItems: "center",
    flexWrap: "wrap",
  },

  fileInput: {
    color: "white",
    fontSize: "15px",
  },

  uploadButton: {
    background:
      "linear-gradient(135deg,#22c55e,#16a34a)",

    color: "white",

    border:
      "1px solid rgba(255,255,255,0.3)",

    padding: "12px 22px",

    borderRadius: "12px",

    cursor: "pointer",

    fontWeight: "bold",

    fontSize: "15px",

    boxShadow:
      "0 4px 15px rgba(34,197,94,0.4)",

    transition: "all 0.3s ease",

    backdropFilter: "blur(10px)",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    padding: "10px",
    boxSizing: "border-box",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1000px",
  },

  th: {
    padding: "20px",
    textAlign: "left",
    color: "white",
    borderBottom:
      "1px solid rgba(255,255,255,0.2)",
  },

  td: {
    padding: "18px",
    color: "white",
    borderBottom:
      "1px solid rgba(255,255,255,0.1)",
  },

  row: {
    transition: "0.3s",
  },

  badge: {
    padding: "8px 14px",
    borderRadius: "30px",
    color: "white",
    fontSize: "13px",
    fontWeight: "bold",
  },

  button: {

    border:
      "1px solid rgba(255,255,255,0.2)",

    padding: "11px 20px",

    borderRadius: "12px",

    color: "white",

    cursor: "pointer",

    fontWeight: "bold",

    fontSize: "14px",

    transition: "all 0.3s ease",

    boxShadow:
      "0 4px 15px rgba(0,0,0,0.25)",

    backdropFilter: "blur(10px)",
  },
};

export default App;