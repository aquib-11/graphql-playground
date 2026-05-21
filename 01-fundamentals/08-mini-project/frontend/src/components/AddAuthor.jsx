/**
 * AddAuthor.jsx
 *
 * Demonstrates:
 *   - useMutation hook
 *   - Form state handling
 *   - Loading state during mutation
 *   - GraphQL error handling
 *   - Refetching authors after successful mutation
 */

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_AUTHOR, GET_AUTHORS } from "../graphql/operations.js";

const s = {
card: {background: "#fff",borderRadius: 10,padding: 28,boxShadow: "0 1px 4px rgba(0,0,0,0.08)",maxWidth: 480,
},
title: {fontSize: 18,fontWeight: 600,marginBottom: 20,color: "#1a1a2e",
},
group: {marginBottom: 16,
},
label: {display: "block",fontSize: 13,fontWeight: 500,color: "#555",marginBottom: 5,
},
input: {width: "100%",padding: "8px 12px",border: "1px solid #ddd",borderRadius: 6,fontSize: 14,outline: "none",
},
textarea: {width: "100%",padding: "10px 12px",border: "1px solid #ddd",borderRadius: 6,fontSize: 14,outline: "none",resize: "vertical",minHeight: 100,fontFamily: "inherit",
},
btn: (loading) => ({width: "100%",padding: "10px",background: loading ? "#a5b4fc" : "#6c63ff",color: "#fff",border: "none",borderRadius: 6,fontSize: 14,fontWeight: 600,cursor: loading ? "not-allowed" : "pointer",marginTop: 8,
}),
error: {background: "#fef2f2",border: "1px solid #fca5a5",color: "#dc2626",padding: 12,borderRadius: 6,fontSize: 13,marginTop: 12,
},
success: {border: "1px solid #86efac",color: "#16a34a",padding: 12,borderRadius: 6,fontSize: 13,marginTop: 12,
},
};

const EMPTY_FORM = {
  name: "",
  bio: "",
};

export default function AddAuthor({ onAdded }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [successMsg, setSuccessMsg] = useState("");

  // useMutation hook
  const [addAuthor, { loading, error }] = useMutation(ADD_AUTHOR, {
    // Refresh authors list after adding
    refetchQueries: [{ query: GET_AUTHORS }],
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");

    try {
      const result = await addAuthor({
        variables: {
          name: form.name,
          bio: form.bio,
        },
      });

      setSuccessMsg(`"${result.data.addAuthor.name}" added successfully!`);

      setForm(EMPTY_FORM);

      setTimeout(() => {
        onAdded?.();
      }, 1500);
    } catch {
      // Error already available from `error`
    }
  };

  return (
    <div style={s.card}>
      <h2 style={s.title}>Add New Author</h2>

      <form onSubmit={handleSubmit}>
        <div style={s.group}>
          <label style={s.label}>Author Name *</label>

          <input
            style={s.input}
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Robert C. Martin"
            required
          />
        </div>

        <div style={s.group}>
          <label style={s.label}>Bio</label>

          <textarea
            style={s.textarea}
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Write a short author biography..."
          />
        </div>

        <button style={s.btn(loading)} type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Author"}
        </button>
      </form>

      {/* GraphQL Error */}
      {error && (
        <div style={s.error}>
          {error.graphQLErrors?.[0]?.message || error.message}
        </div>
      )}

      {/* Success Message */}
      {successMsg && <div style={s.success}>{successMsg}</div>}
    </div>
  );
}
