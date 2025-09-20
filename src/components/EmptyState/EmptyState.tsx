import css from "./EmptyState.module.css"

export default function EmptyState({message}:{message:string}) {
    return <p className={css.emty}>{message}</p>
}