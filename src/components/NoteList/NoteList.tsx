import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import css from "./NoteList.module.css";
import {
  deleteNote,
  fetchNotes,
  type FetchNotesResponse,
} from "../../services/noteService";
import { useEffect } from "react";
import { queryClient } from "../../main";
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import EmptyState from "../EmptyState/EmptyState";

interface NoteListProps {
  page: number;
  perPage: number;
  search: string;
  onTotalPages: (total: number) => void;
}

export default function NoteList({
  page,
  perPage,
  search,
  onTotalPages,
}: NoteListProps) {
  const { data, isLoading, isError, error } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", page, perPage, search],
    queryFn: () => fetchNotes(page, perPage, search),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error: Error) => {
      alert(`Failed to delete note: ${error.message}`);
    },
  });

  useEffect(() => {
    if (data) {
      onTotalPages(data.totalPages);
    }
  }, [data, onTotalPages]);

  if (isLoading) return <LoadingIndicator />;
  if (isError || !data)
    return (
      <ErrorMessage message={(error as Error)?.message || "Unknown error"} />
    );
  if (data.notes.length === 0) return <EmptyState message="No notes found." />;

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <ul className={css.list}>
      {data.notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => {
                handleDelete(note.id);
              }}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
