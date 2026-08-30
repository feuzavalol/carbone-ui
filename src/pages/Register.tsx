// This page is used to register users when you're an admin user

import { useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { adminRegisterRequest } from "../auth/authApi";
import { type Role, type CommitteeCategory, NumberNeedingCategories, Roles, CommitteeCategories } from "../constants/roles";
import type { SingleValue } from "react-select";

type Object = Role | CommitteeCategory

type CustomOption = {
  value: Object,
  label: string
}

function customOptionOf(f: Object){
  const opt : CustomOption = {
    value: f,
    label: f
  }
  return opt
}

function toCustomOption(l:Object[]){
  return l.map((f:Object) => customOptionOf(f));
}

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [committee, setCommittee] = useState<CustomOption | null>(null); 
  const [role, setRole] = useState<CustomOption | null>(null);
  const [number, setNumber] = useState<number>();
  const year = 2025; // TODO: change to be dynamically picked
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roleOptions = toCustomOption(Roles);
  const committeeOptions = toCustomOption(CommitteeCategories)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
        if (role == undefined){
            throw new Error("Le champ 'role' manque.");
        }
        if (committee == undefined){
            throw new Error("Le champ 'association' manque");
        }
        if (NumberNeedingCategories.includes(committee.value) && number == undefined){
            throw new Error("Le champ 'numéro' manque");
        }
        await adminRegisterRequest(name, email, password, role.value, committee.value, year, number);
    } catch (err) {
        setError("L'email ou le mot de passe sont incorrects");
    } finally {
        setLoading(false);
    }
  };

  function handleRoleSelect(newRole: SingleValue<CustomOption>){
    setRole(newRole?.label != undefined ? customOptionOf(newRole?.value) : null);
  }

  function handleCommitteeSelect(newCommittee: SingleValue<CustomOption>){
    setCommittee(newCommittee?.label != undefined ? customOptionOf(newCommittee?.value) : null);
  }

  const isListeux: boolean = role?.value == "LIS";
  const needNumber: boolean = committee ? NumberNeedingCategories.includes(committee.value) : false

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.tabs}>
            Register
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>
                Name
                <input
                style={styles.input}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                />
            </label>

          <label style={styles.label}>
            Email
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </label>

          <label style={styles.label}>
            Password
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </label>

          <label style={styles.label}>
            Rôle
            <Select
                options={roleOptions}
                value={role}
                onChange={(newRole) => handleRoleSelect(newRole)}
                required
            />
          </label>
          {isListeux && <label style={styles.label}>
            Association
            <Select
                options={committeeOptions}
                value={committee}
                onChange={(newCommittee) => handleCommitteeSelect(newCommittee)}
                required
            />
          </label>
          }
          { needNumber && 
            <label style={styles.label}>
                Numéro
                <input
                style={styles.input}
                type="number"
                value={number}
                min={0}
                max={4}
                step={1}
                onChange={(e) => {console.log(parseInt(e.target.value)); setNumber(parseInt(e.target.value))}}
                required
                />
            </label>

          }

          <button type="submit" disabled={loading} style={styles.submit}>
            {loading ? "Please wait…" : "Create account"}
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f5f5",
    fontFamily: "system-ui, sans-serif",
  },
  card: {
    width: 360,
    background: "#fff",
    borderRadius: 8,
    padding: 24,
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },
  tabs: {
    display: "flex",
    marginBottom: 20,
    borderBottom: "1px solid #e0e0e0",
  },
  tab: {
    flex: 1,
    padding: "8px 0",
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    cursor: "pointer",
    color: "#888",
    fontSize: 14,
  },
  tabActive: {
    flex: 1,
    padding: "8px 0",
    background: "none",
    border: "none",
    borderBottom: "2px solid #2563eb",
    cursor: "pointer",
    color: "#2563eb",
    fontWeight: 600,
    fontSize: 14,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  label: {
    display: "flex",
    flexDirection: "column",
    fontSize: 13,
    color: "#333",
    gap: 4,
  },
  input: {
    padding: "8px 10px",
    fontSize: 14,
    border: "1px solid #ccc",
    borderRadius: 4,
  },
  submit: {
    marginTop: 8,
    padding: "10px 0",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  error: {
    marginTop: 16,
    color: "#dc2626",
    fontSize: 13,
  },
  result: {
    marginTop: 16,
    paddingTop: 16,
    borderTop: "1px solid #e0e0e0",
  },
  resultLabel: {
    fontSize: 13,
    color: "#333",
    marginBottom: 6,
  },
  tokenBox: {
    width: "100%",
    fontSize: 11,
    fontFamily: "monospace",
    padding: 8,
    border: "1px solid #ccc",
    borderRadius: 4,
    resize: "none",
    boxSizing: "border-box",
  },
  copyButton: {
    marginTop: 8,
    padding: "6px 12px",
    fontSize: 13,
    background: "#f0f0f0",
    border: "1px solid #ccc",
    borderRadius: 4,
    cursor: "pointer",
  },
};