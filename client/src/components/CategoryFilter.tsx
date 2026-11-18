type Category = { id: number; name: string }

type Props = {
  categories?: Category[]
  selected: number | null
  onChange: (id: number | null) => void
}

const CategoryFilter = ({ categories = [], selected, onChange }: Props) => {
  const chip = (active: boolean) =>
    `shrink-0 cursor-pointer whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition ${
      active
        ? " bg-black text-white"
        : "bg-background hover:border-black dark:hover:border-white"
    }`

  return (
    <div className="sticky top-17 z-30 -mx-3 mb-4 rounded-2xl border border-t-0 bg-background/95 px-3 py-2 shadow-md backdrop-blur sm:-mx-6 sm:px-6">
      <div
        className="flex scrollbar-none gap-2 overflow-x-auto overscroll-x-contain scroll-smooth pb-1 [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-label="Filter by category"
      >
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-pressed={selected === null}
          className={chip(selected === null)}
        >
          All
        </button>

        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange(c.id)}
            aria-pressed={selected === c.id}
            className={chip(selected === c.id)}
          >
            # {c.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CategoryFilter
