/**
 * AuthorList.jsx — List all authors with edit and delete
 * Deleting an author also deletes all their books (handled in backend)
 */

import { useQuery, useMutation } from "@apollo/client";
import {
  GET_AUTHORS,
  DELETE_AUTHOR,
  GET_BOOKS,
} from "../graphql/operations.js";
import { s, colors } from "../styles/common.js";

export default function AuthorList({ onEdit }) {
  const { data, loading, error } = useQuery(GET_AUTHORS);

  const [deleteAuthor, { loading: deleting }] = useMutation(DELETE_AUTHOR, {
    refetchQueries: [{ query: GET_AUTHORS }, { query: GET_BOOKS }],
  });

  const handleDelete = async (id, name, bookCount) => {
    const warn =
      bookCount > 0
        ? `\n\n⚠️ This will also delete ${bookCount} book${bookCount > 1 ? "s" : ""} by this author.`
        : "";
    if (!window.confirm(`Delete author "${name}"?${warn}`)) return;
    try {
      await deleteAuthor({ variables: { id } });
    } catch (err) {
      alert(err.graphQLErrors?.[0]?.message || err.message);
    }
  };

  if (loading) return <div style={s.loading}>Loading authors…</div>;
  if (error) return <div style={s.error}>Error: {error.message}</div>;

  const authors = data?.authors || [];

  return (
    <div>
      <div style={{ ...s.toolbar, marginBottom: 20 }}>
        <span style={{ fontSize: 13, color: colors.textMuted }}>
          {authors.length} author{authors.length !== 1 ? "s" : ""}
        </span>
      </div>

      {authors.length === 0 ? (
        <div style={s.empty}>No authors yet. Add one!</div>
      ) : (
        <div style={s.grid}>
          {authors.map((author) => (
            <div key={author.id} style={s.card}>
              {/* Name & book count */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 8,
                }}
              >
                <div style={s.cardTitle}>{author.name}</div>
                <span style={s.badge(colors.primary)}>
                  {author.bookCount} book{author.bookCount !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Bio */}
              {author.bio && (
                <p
                  style={{
                    ...s.cardMeta,
                    fontSize: 12,
                    lineHeight: 1.6,
                    marginBottom: 12,
                  }}
                >
                  {author.bio}
                </p>
              )}

              {/* Books list */}
              {author.books.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  {author.books.map((book) => (
                    <div
                      key={book.id}
                      style={{
                        fontSize: 12,
                        color: colors.textMuted,
                        padding: "4px 0",
                        borderTop: "1px solid #f3f4f6",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{book.title}</span>
                      <span style={{ color: "#bbb", fontSize: 11 }}>
                        {book.year}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  style={{ ...s.btnSecondary, flex: 1 }}
                  onClick={() => onEdit(author)}
                >
                  ✏️ Edit
                </button>
                <button
                  style={{ ...s.btnDanger, flex: 1 }}
                  disabled={deleting}
                  onClick={() =>
                    handleDelete(author.id, author.name, author.bookCount)
                  }
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
