// This page is used to register users when you're an admin user

import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { adminRegisterRequest } from "../auth/authApi";
import type { LoginResponse } from "../auth/authApi";
import { type Role, type CommitteeCategory, NumberNeedingCategories } from "../constants/roles";
import { useCommitteeCategories, useRoles } from "../fetching/UseCommittee";
import { MissingToken, useAsyncStatus } from "../fetching/ErrorHandling";
import { emptyUser, type FilledUser, type User } from "../types/authTypes";



export function RegisterPage() {
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [committee, setCommittee] = useState<CommitteeCategory | null>(null); 
  // const [role, setRole] = useState<Role | null>(null);
  // const [number, setNumber] = useState<number | null>(null);
  // const year = 2026; 

  const [user, setUser] = useState<User>(emptyUser);
  const [loadingRegister, setLoading] = useState(false);
  const [errorRegister, setError] = useState<string | null>(null);

  const { token } = useAuth();
  const { categories, loadingCategories, errorCategories } = useCommitteeCategories(user.year);
  const { roles, loadingRoles, errorRoles } = useRoles(user.year);
  const status = useAsyncStatus({ loading: loadingCategories, error: errorCategories});
  const statusRoles = useAsyncStatus({ loading: loadingRoles, error: errorRoles });

  const tokenMissing = MissingToken({token});

  if (tokenMissing) {return tokenMissing;}

  if (status) { return status; }
  if (statusRoles) { return status; }

  const handleChange = (e: any) => {
    setUser((prev: User) => ({
      ...prev, 
      [e.target.name]: e.target.value,
    }));
  };

  const handleSpecificChange = ({ fieldName, fieldValue }: { fieldName: string, fieldValue: string | number | null}) => {
    setUser((prev: User) => ({
      ...prev, 
      [fieldName]: fieldValue,
    }));
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (user.email == undefined){
        throw new Error("Il manque le champ 'email'.");
      }
      if (user.password == undefined){
        throw new Error("Il manque le champ 'password'.");
      }
      if (user.role == undefined){
          throw new Error("Il manque le champ 'role'.");
      }
      if (user.committee == undefined || user.committee == null){
        if (user.role == "ADM" || user.role == "BRE"){
          // handleSpecificChange({ fieldName: "committee", fieldValue: "BRE" });
          user.committee = "BRE";
        }
        else {
          throw new Error("Le champ 'association' manque");
        }
      }
      if (NumberNeedingCategories.includes(user.committee) && user.number == undefined){
          throw new Error("Le champ 'numéro' manque");
      }
      const filledUser: FilledUser = user;
      const registerAnswer: LoginResponse = await adminRegisterRequest(filledUser, token);
      if (!registerAnswer.success){
        setError(registerAnswer.message);
      }
    } catch (err: any) {
        console.log(err);
        setError("Something went wrong: "+err.message);
    } finally {
        setLoading(false);
    }
  };

  function handleRoleSelect(e: React.ChangeEvent<HTMLSelectElement>){
    const newRole = e.target.value as Role;
    handleSpecificChange({fieldName: "role", fieldValue: newRole});
  }

  function handleCommitteeSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const newCategory = e.target.value as CommitteeCategory;
    if (NumberNeedingCategories.includes(newCategory)){
      handleSpecificChange({fieldName: "number", fieldValue: null});
    }
    handleSpecificChange({fieldName: "committee", fieldValue: newCategory});
  }

  const isListeux: boolean = user.role == "LIS";
  const needNumber: boolean = user.committee ? NumberNeedingCategories.includes(user.committee) : false;

  if (needNumber && user.number == null){
    handleSpecificChange({fieldName: "number", fieldValue: 1})
  }
  if (!needNumber && user.number != null){
    handleSpecificChange({fieldName: "number", fieldValue: null})
  }


  console.log(user);
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
                name="name"
                type="text"
                value={user.name}
                onChange={handleChange}
                required
                />
            </label>

          <label style={styles.label}>
            Email
            <input
              style={styles.input}
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </label>

          <label style={styles.label}>
            Password
            <input
              style={styles.input}
              name="password"
              type="password"
              value={user.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </label>

          <label style={styles.label}>
            Rôle
            <select
              name="select-role"
              id={user.role ?? ""}
              value={user.role ?? ""}
              onChange={handleRoleSelect}
            >
              <option value="" disabled>Choisissez le rôle</option>
                {roles.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
            </select>
            {/* <Select
                options={roleOptions}
                value={role}
                onChange={(newRole) => handleRoleSelect(newRole)}
                required
            /> */}
          </label>
          {isListeux && <label style={styles.label}>
            Association
            <select
              name="select-committee"
              id={user.committee || ""}
              value={user.committee ?? ""}
              onChange={handleCommitteeSelect}
            >
              <option value="" disabled>choisissez l'asso</option>
              {categories.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {/* <Select
                options={committeeOptions}
                value={committee}
                onChange={(newCommittee) => handleCommitteeSelect(newCommittee)}
                required
            /> */}
          </label>
          }
          { needNumber && 
            <label style={styles.label}>
                Numéro
                <input
                style={styles.input}
                name="number"
                type="number"
                value={user.number}
                min={1}
                max={3}
                step={1}
                onChange={handleChange}
                required
                />
            </label>

          }

          <button type="submit" disabled={loadingRegister} style={styles.submit}>
            {loadingRegister ? "Please wait…" : "Create account"}
          </button>
        </form>

        {errorRegister && <p style={styles.error}>{errorRegister}</p>}
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