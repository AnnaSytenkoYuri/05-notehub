import { useState } from "react";
import NoteList from "../NoteList/NoteList";
import css from "./App.module.css";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import { useDebounce } from "use-debounce";
import Pagination from "../Pagination/Pagination";

export default function App() {
  const [page, setPage] = useState(1);
  const [perPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchTerm} onChange={setSearchTerm} />
        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(selectedPage) => setPage(selectedPage)}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      <NoteList
        page={page}
        perPage={perPage}
        search={debouncedSearchTerm}
        onTotalPages={(total) => setTotalPages(total)}
      />
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onCancel={closeModal} />
        </Modal>
      )}
    </div>
  );
}
